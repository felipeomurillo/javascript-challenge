//////////////////////////////////
// Get input data from data.js
//////////////////////////////////
var tableData = data;

///////////////////////////////////////////////////////////
// Create a function to add a table from a given dataset
//////////////////////////////////////////////////////////
function addTable (dataset) {
    // Select table body
    let table = d3.select('tbody')

    dataset.forEach(d => {

    // For each data item, add a table row
    let row = table.append('tr');
  
   // Within each row, add data to each column
   Object.values(d).forEach(i => {
       let dataRow = row.append('td').text(i);
   });
 });  

};

//////////////////////////////////////////////////////////////////
// Initially populate HTML table with all available sighting data
//////////////////////////////////////////////////////////////////
addTable(tableData);


//////////////////////////////////////////////////////////////////////
// Create function to execute once data in entered into form field
// This function will reset the table and filter it to only display 
// data for the desired date or return an error if date is invalid
//////////////////////////////////////////////////////////////////////

// Initialize a failed query counter
var failedQueries = 0;

function runEnter() {

    //Prevent form data from being sent to server
    d3.event.preventDefault();

    // Select the form input
    let inputField = d3.select('#datetime');

    // Retrive data in form input
    let inputValue = inputField.property('value')

    // Filter data per user-input
    filteredData = data.filter(d => d.datetime === inputValue);

    // If date filter returns results then return filtered table,
    // else, return an error message as a table caption
    if (filteredData.length > 0){
        
        // Checks to see if the query has failed. If so, remove caption
        // added from previous failed queries and reset counter. Else,
        // remove the previous table content 
        if (failedQueries > 0){
            d3.select('caption').remove();
            failedQueries = 0;
        }else{
            d3.select('tbody').remove()
        };

        // Add data content for user-defined date
        let newTable = d3.select('.table').append('tbody');
        addTable(filteredData);

    }else{

        // Increment failed query counter
        failedQueries +=1

        // Remove table content
        d3.select('tbody').remove()

        // if this is the first query failure, add caption section and populate. Else,
        // select pre-existing caption section and populate
        if (failedQueries === 1) {
            d3.select('.table').append('caption')
            .text(`No Records Found for: '${inputValue}'. Please Try Again!`)
            .style("color","#fafafa")
            .style("font-size","20pt");
        } else {
            d3.select('caption')
            .text(`No Records Found for: '${inputValue}'. Please Try Again!`)
            .style("color","#fafafa")
            .style("font-size","20pt");
        }; //endif

    }; //endif

    // Report failed queries to console
    console.log(`# of attempts: ${failedQueries}`)

}; //end_function


///////////////////////
// Activate  Listeners
//////////////////////
let form = d3.select('form');
let button = d3.select('#filter-btn')

// Execute runEnter when user presses ENTER and/or clicks button
form.on('submit',runEnter);
button.on('click',runEnter)