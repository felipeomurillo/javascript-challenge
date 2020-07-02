//////////////////////////////////
// Get input data from data.js
//////////////////////////////////
var tableData = data;

////////////////////////////////////////////////////////////////////
// Create a function that adds the whole table from a given dataset
////////////////////////////////////////////////////////////////////

/**
 * This function adds an HTML table with the contents of a specified dataset
 * @param {vars} dataset array of JSON entries
 */
function addTable (dataset) {
    // Select table body
    let table = d3.select('tbody')
    // For each data item, add a table row
    dataset.forEach(d => {
    let row = table.append('tr');
   // Within each row, add data to each column
   Object.values(d).forEach(i => {
       let dataRow = row.append('td').text(i);
   });
 });  
};

////////////////////////////////////////////
// Initial form population
///////////////////////////////////////////

// Initialize filter matrix to null entiers, i.e. no filters specified
let filters = {
    datetime: '',
    city:'',
    state:'',
    country:'',
    shape:''
};

// Create a mapping of data attributes and their correpsonding HTML tags
const dataMap = {
    datetime: 'inputDatetime',
    city: 'inputCity',
    state: 'inputState',
    country: 'inputCountry',
    shape: 'inputShape'
};

/**
 * This function creates a list of drop-down items based on dataset received
 * @param {vars} dataset array of JSON entries
 * @param {vars} attr key within dataset
 * @param {vars} tag HTML id within select class, wherre drop-down lists are specified
 */
function addOptions (dataset, attr, tag) {
    // List unique values for each key in dataset
    let diffAttr = d3.map(dataset, function (d) {return d[attr];}).keys();

    // Sorts items in alphabetical order for non-date entries
    if (attr !== 'datetime') {
        diffAttr = diffAttr.sort();
    };

    // Select specific tag drop down menu
    let diffTag = d3.select(`#${tag}`);

    //Remove values (in case there were previous records added)
    diffTag.selectAll("option#value").remove();

    // Add valid entries 
    for (let i = 0; i<diffAttr.length; i++){
        diffTag.append('option').attr("id","value").text(diffAttr[i]);
    }
};

/**
 * This function resets drop-down selection to default value
 */
function resetSelects () {
    let classTags = Object.values(dataMap);
    // Select all drop-down menus and set to default
    classTags.forEach(d => {
        var dropDown = document.getElementById(d);
        dropDown.selectedIndex = 0;  
    });
};

//////////////////////////////////////////////////////////////////
// Initially populate HTML table with all available sighting data
//////////////////////////////////////////////////////////////////

/**
 * Reset routine used by Clear Filter button
 */
function reset () {
    d3.select("tbody").html(null);
    addTable(tableData);
    let attr = Object.keys(dataMap);
    let tag = Object.values(dataMap);

    for (let i = 0; i < attr.length; i++){
        addOptions(tableData,attr[i],tag[i]);
    };
    resetSelects();

    // Initialize filters
    filters['datetime']= '';
    filters['city']= '';
    filters['state']= '';
    filters['country']= '';
    filters['shape']= '';
};

// Execute reset
reset();

//////////////////////////////////////////////////////////////////////
// Create function to execute once data in entered into form field
// This function will reset the table and filter it with user specified
// inputs. Note: dynamic filtering -- user can only select values from
// from an already filtered dataset.
//////////////////////////////////////////////////////////////////////

/**
 * This function filters a specified dataset given a user-defined filter matrix
 * constructed by individual drop-down menu selections
 * @param {*} dataset dataset to be filtered
 * @param {*} filters JSON containing keys and correpsonding filters
 */
function filterData (dataset, filters){

    // Start by filtering datetime key. Start filter with the complete dataset
    let r1data = dataset;
    // Perform filter only if filter has been specified for this key
    if (filters['datetime'].length > 0){
        r1data = dataset.filter(d => d['datetime'] === filters['datetime']);
    };

    //Second, filter by city name. Dataset to be filtered may have already undergone
    //a level of filtering above.
    let r2data = r1data;
    // Perform filter only if filter has been specified for this key
    if (filters['city'].length > 0){
        r2data = r1data.filter(d => d['city'] === filters['city']);
    };

    //Third, filter by state. Dataset to be filtered may have already undergone
    //a level of filtering above.
    let r3data = r2data;
    // Perform filter only if filter has been specified for this key
    if (filters['state'].length > 0){
        r3data = r2data.filter(d => d['state'] === filters['state']);
    };

    //Fourth, filter by country. Dataset to be filtered may have already undergone
    //a level of filtering above.
    let r4data = r3data;
     // Perform filter only if filter has been specified for this key
    if (filters['country'].length > 0){
        r4data = r3data.filter(d => d['country'] === filters['country']);
    };

    //Lastly, filter by shape. Dataset to be filtered may have already undergone
    //a level of filtering above.
    let r5data = r4data;
    if (filters['shape'].length > 0){
        r5data = r4data.filter(d => d['shape'] === filters['shape']);
    };

    return r5data;  
};

// Perform filtering based on input values
/**
 * This function reads inputs, constructs filter matrix, and executes
 * the filtering routine. Once a new filter is specified, it updates
 * drop-down menu items to dynamically freflect allowable values.
 * @param {*} dataset dataset contianing data to be filtered
 * @param {*} attr dataset keys
 * @param {*} tag HTML tags for individual drop-down menus 
 */
function runEnter(dataset, attr, tag) {

    //Prevent form data from being sent to server
    d3.event.preventDefault();

    // Select the form input
    let inputField = d3.select(`#${tag}`);

     // Retrive data in form input
    let inputValue = inputField.property('value')

    // Add new filter to filter matrix
    filters[attr] = inputValue;

    //Perform filter with specified filter matrix
    filteredData = filterData(dataset,filters);
        
    // Remove HTML table body entries of previos queries
    d3.select('tbody').remove()

    // Add new data content for user-defined date
    let newTable = d3.select('.table').append('tbody');
    addTable(filteredData);

    // Delete previous selectable items list from drop-down menus
    let localDatamap = dataMap;
    delete localDatamap.attr;
    let localAttr = Object.keys(localDatamap);
    let localTag = Object.values(localDatamap);

    //Limit the drop-down option for other attributes
    for (let i = 0; i < localAttr.length; i++){
        addOptions(filteredData,localAttr[i],localTag[i]);
    };

}; //end_function

///////////////////////
// Activate  Listeners
//////////////////////
let formDatetime = d3.select('#inputDatetime');
let formCity = d3.select('#inputCity')
let formState = d3.select('#inputState')
let formCountry = d3.select('#inputCountry')
let formShape = d3.select('#inputShape')
//
let button = d3.select('#clearFilter')

// Execute runEnter when user presses ENTER and/or clicks button
formDatetime.on('change',function() {runEnter(tableData,'datetime','inputDatetime');});
formCity.on('change',function() {runEnter(tableData,'city','inputCity');});
formState.on('change',function() {runEnter(tableData,'state','inputState');});
formCountry.on('change',function() {runEnter(tableData,'country','inputCountry');});
formShape.on('change',function() {runEnter(tableData,'shape','inputShape');});
//
button.on('click',reset)