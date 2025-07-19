const apiURL = "http://localhost:3000";
var coffee = coffee || {};

const BusinessTable = ["name", "location", "contact"];
const RoasteryTable = ["Roasteryname", "RoasteryLocation", "RoasteryContact"];
const RestaurantTable = ["RestName", "RestAddr", "RestContact"];
const FarmTable = ["FarmName", "FarmAddr", "FarmContact"];
const CustomerTable = ["Name", "Address", "Username"];
const BeansTable = ["Breed", "FarmFromLoc" , "FarmFromContact"];
const BlendTable = ["Flavor","Origin","BlendName"];
const BlendMadeByTable = ["BlendID", "RoasteryLocation", "RoasteryContact"];
const BlendSoldToCustTable = ["Price", "Quantity", "BlendSold","CustomerSoldTo"];
const BlendSoldToRestTable = ["Price", "Quantity", "BlendSold", "RestName", "RestAddr", "RestContact"];
const DrinkTable = ["RestName", "RestAddr", "RestContact", "DrinkName", "Price"];
const DrinkSoldToTable = ["DrinkSoldID", "RestName", "RestAddr", "RestContact", "CustomerSoldTo"];
const RoastByTable = ["Type", "RoastLocation", "RoastContact", "RoastedBeans"];

const tableNamesList = ["Business", "Roastery", "Restaurant", "Farm", "Customer", "Beans", "Blend", "BlendMadeBy", "BlendSoldToCust", "BlendSoldToRest", "Drink", "DrinkSoldTo", "RoastBy"];
const SecondlistOfTables = [BusinessTable, RoasteryTable, RestaurantTable, FarmTable, CustomerTable, BeansTable, BlendTable, BlendMadeByTable, BlendSoldToCustTable, 
    BlendSoldToRestTable, DrinkTable, DrinkSoldToTable, RoastByTable];

const sproc = ["selectDrink", "drinkOrigin", "blendLookup", "updateDrink", "updateBlend", "removeFarm", "updateLocation" ]

const insertSprocParam = {"Beans": ["Breed","FarmFromLoc", "FarmFromContact"], "Blend":["Flavor","Origin","BlendName"]
,"BlendMadeBy": ["BlendID","RoasteryLocation","RoasteryContact"], "BlendSoldToCust": ["PriceTotal","Quantity","CUstomerSoldTo","BlendSold"], "BlendSoldToRest":["PriceTotal","Quantity","RestAddr","RestContact","BlendSold"]
,"Business": ["Name", "Location", "Contact"], "Customer":["Username"],"Drink":["RestAddr", "RestName", "RestContact", "DrinkName", "Price"],"DrinkSoldTo":["DrinkSoldID","RestAddr","RestContact","CustomerSoldTo"]
,"Farm":["FarmName","FarmAddr","FarmContact"],"Restaurant":["RestName","RestAddr","RestContact"],"RoastBy":["Type","RoastLocation","RoastContact","RoastedBeans"],"Roastery":["RoasteryName","RoasteryLocation","RoasteryContact"]}

const insertSprocNames ={"Beans":"insertBeans","Blend":"insertBlend","BlendMadeBy":"insertBlendMadeBy","BlendSoldToCust":"insertBlendSoldToCust", "BlendSoldToRest": "insertBlendSoldToRest"
,"Business": "insertBusiness", "Customer":"insertCustomer","Drink": "insertDrink","DrinkSoldTo": "insertDrinkSoldTo","Farm": "insertFarm", "Restaurant":"insertRestaurant","RoastBy":"insertRoastBy","Roastery":"insertRoastery"};

const sprocSelectDrink = ["Name" , "RestFrom" , "Price"];
const sprocDrinkOrigin = ["Name"];
const sprocBlendLookUp = ["bName"];
const sprocUpdateDrink = ["OldDrinkName", "NewDrinkName", "RestName"];
const sprocUpdateBlend = ["OldBlendName", "NewBlendName", "Origin"];
const sprocRemoveFarm = ["Addr", "Contact"];
const sprocUpdateLocation = ["oldLocation", "newLocation", "contact"];

const Category = ["Drink", "DrinkOrigin", "Blend", "updateDrink", "updateBlend", "removeFarm", "updateLocation"];
const sprocList = [sprocSelectDrink, sprocDrinkOrigin, sprocBlendLookUp, sprocUpdateDrink, sprocUpdateBlend, sprocRemoveFarm, sprocUpdateLocation];

function showData(){
    //document.getElementById("Fields").innerHTML = "";
    //document.getElementById("comments").innerHTML = "";
    const tableToShow = document.getElementById("tableOptions").value;
    if(tableToShow != "Choose Category to Add" && document.getElementById("selectedInputFields").innerHTML == ""){
        console.log(tableToShow);
        //const tableIndex = updateSprocNames.indexOf(tableName);
        //console.log(tableIndex);
        //const tableToShow = updateTableNames[tableIndex];
        fetch(apiURL + '/getTable',
            {method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                tableName : tableToShow,
            }),
        })
        .then(response => response.json())
        .then(data =>{
            if(data.length != 0){
                const firstRow = data[0];
                const table = document.getElementById("selectedInputFields")
                const tableHead = document.createElement('thead')
                const tableHeadRow = document.createElement('tr');
                var rownumber = document.createElement('th')
                rownumber.scope = "col";
                rownumber.innerHTML = "#"
                tableHeadRow.appendChild(rownumber);
                table.innerHTML = "";
                for(const [key,value] of Object.entries(firstRow)){
                   var col = document.createElement('th')
                   col.scope = "col"
                   col.innerHTML = key
                   tableHeadRow.appendChild(col);
                }
                tableHead.appendChild(tableHeadRow);
                table.appendChild(tableHead);
                let rowCount = 1;
                const tableBody = document.createElement('tbody');
                for(const item of data){
                    //console.log(item['username']);
                    const bodyRow = document.createElement('tr');
                    var rowNumColumn = document.createElement('th');
                    rowNumColumn.scope = "col";
                    rowNumColumn.innerHTML = rowCount;
                    bodyRow.appendChild(rowNumColumn);
                   for (const [key,value] of Object.entries(item)){
                    //console.log(value);
                    var bodyColumn = document.createElement('td');
                    bodyColumn.scope = "col";
                    bodyColumn.innerHTML = value;
                    bodyRow.appendChild(bodyColumn);
                   }
                    // var updateColumn = document.createElement('td');
                    // updateColumn.scope = "col";
                    // var modal = createUpdateModal(tableName, updateColumn ,rowCount);
                    // bodyRow.appendChild(modal);
                   tableBody.appendChild(bodyRow);
                   rowCount++;
                }
                table.appendChild(tableBody);
                //table.appendChild(createUpdateModalBoot());
                // alert("Returned " +  (rowCount - 1)+ " rows")
                }
                else{
                    alert("data attempted to search does not exist")
                    return;
                }
        }).catch(error => {
            console.error('Error:', error);
        });
    }else{
        document.getElementById("selectedInputFields").innerHTML = "";
    }
}

function importData(){
    const tableColumns = document.getElementById("inputFields").getElementsByTagName('label');
   // const tableInputs = document.getElementById("inputFields").getElementsByTagName('input');
    const tableValues = [];
    //const columnToValuesPair = [];
    const tableName = document.getElementById("tableOptions").value;
    const tableIndex = tableNamesList.indexOf(tableName);
    const tableColumnNames = SecondlistOfTables[tableIndex];
    if(tableName != "Select Table"){
    for(let i = 0; i< tableColumns.length; i++){
        var inputID = "Field_" +i;
        //tableColumnNames.push(tableColumns[i].innerText);
        var input = document.getElementById(inputID).value
        if(input == "" || input == null){
            alert("input values must be filled");
            return;
        }
        tableValues.push(input);
        //var pair = MakeTableColumnPair(tableColumns[i].innerText, input)
        //columnToValuesPair.push(pair);
    }
    const arrayOfTableValues = tableValues.map(function(string){
        return "'" + string + "'";
    })
    const query = "INSERT into "+ tableName + " (" + tableColumnNames.join(", ") + ")"  + " values (" + arrayOfTableValues.join(", ") + ")";
    console.log(query);
    // const RoasteryTable = new TableColumnPair(tableName, {Field_1: "name", Field_2 : "location", Field_3:"contact"})
    // const field_1 = document.getElementById('Field_1').value;
    // const field_2 = document.getElementById('Field_2').value;
    // const field_3 = document.getElementById('Field_3').value;
    // const values = ({field_1, field_2, field_3});
    // console.log(values);
    
    fetch(apiURL + '/addData', {
        method: 'POST',
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({
            insertQuery : query,
        }),
    })
    .then(response => response.json()).then(data => {
        alert("Additions Successful");
    })
    // .then(result => {
    //    alert('Data uploaded successfully!');
    // })
    .catch(error => {
        console.error('Error:'+ error);
        alert('Error uploading data. Please try again.');
    });
}
else{
    alert("Table must be selected");
    return;
}

}

function deleteData(){
    console.log("deleting data");
    //const sprocColumns = document.getElementById("deleteFields").getElementsByTagName('label');
    const CategoryName = document.getElementById("deleteOptions").value; // tableName
    //console.log(tableName);
    const sprocIndex = Category.indexOf(CategoryName)
    //console.log(sprocIndex);
    const sprocParamNames = sprocList[sprocIndex]; // go get the right sproc parameters
    //console.log(sprocParamNames)
    const conditionValues = [];
    const storedProcedureName = sproc[sprocIndex];
    if(CategoryName != "What would you like to delete?"){
        for(let i = 0; i< sprocParamNames.length; i++){
            var inputID = "Field_" +i;
            var input = document.getElementById(inputID).value
            conditionValues.push(input);
        }
        console.log(conditionValues)
        // const arrayOfTableValues = conditionValues.map(function(string){
        //     return "'" + string + "'";
        // })

        
        fetch(apiURL + '/DeleteData', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                Param : conditionValues,
                StoredProcedure: storedProcedureName,
                paramNames : sprocParamNames,
            }),
        })
        .then(response => response.json())
        .then(data =>{
            alert("Delete Successful");
    }).catch(error => {
        console.error('Error:'+ error);
        alert('Error uploading data. Please try again.');
    });
    }
    else{
        alert("Table must be selected");
        return;
    }


}

function updateData(){
    console.log("updating data");
    const sprocColumns = document.getElementById("updateFields").getElementsByTagName('label');
    const CategoryName = document.getElementById("updateOptions").value; // tableName
    //console.log(tableName);
    const sprocIndex = Category.indexOf(CategoryName)
    //console.log(sprocIndex);
    const sprocParamNames = sprocList[sprocIndex]; // go get the right sproc parameters
    //console.log(sprocParamNames)
    const conditionValues = [];
    const storedProcedureName = sproc[sprocIndex];
    if(CategoryName != "Update Table"){
        for(let i = 0; i< sprocColumns.length; i++){
            var inputID = "Field_" +i;
            var input = document.getElementById(inputID).value
            conditionValues.push(input);
        }
        console.log(conditionValues)
        // const arrayOfTableValues = conditionValues.map(function(string){
        //     return "'" + string + "'";
        // })

        
        fetch(apiURL + '/UpdateData', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                Param : conditionValues,
                StoredProcedure: storedProcedureName,
                paramNames : sprocParamNames,
            }),
        })
        .then(response => response.json())
        .then(data =>{
            //console.log(JSON.stringify(data).Message);
           alert("Update Successful");
            // else{
            //     alert("data attempted to search does not exist")
            //     return;
            // }
        })
        // .then(result => {
        //    alert('Data uploaded successfully!');
        // })
        .catch(error => {
            console.error('Error:'+ error);
            alert('Error retreiving data. Please try again.');
        });
    }
    else{
        alert("Table must be selected");
        return;
    }

}

function selectData() {
    console.log("selecting data");
    const sprocColumns = document.getElementById("inputConditions").getElementsByTagName('label');
    const CategoryName = document.getElementById("searchOptions").value; // tableName
    //console.log(tableName);
    const sprocIndex = Category.indexOf(CategoryName)
    //console.log(sprocIndex);
    const sprocParamNames = sprocList[sprocIndex]; // go get the right sproc parameters
    //console.log(sprocParamNames)
    const conditionValues = [];
    const storedProcedureName = sproc[sprocIndex];
    if(CategoryName != "Select Category"){
        for(let i = 0; i< sprocColumns.length; i++){
            var inputID = "Field_" +i;
            var input = document.getElementById(inputID).value
            conditionValues.push(input);
        }
        console.log(conditionValues)
        // const arrayOfTableValues = conditionValues.map(function(string){
        //     return "'" + string + "'";
        // })

        
        fetch(apiURL + '/SelectData', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                Param : conditionValues,
                StoredProcedure: storedProcedureName,
                paramNames : sprocParamNames,
            }),
        })
        .then(response => response.json())
        .then(data =>{
            if(data.length != 0){
            const firstRow = data[0];
            const table = document.getElementById("selectedFields")
            const tableHead = document.createElement('thead')
            const tableHeadRow = document.createElement('tr');
            var rownumber = document.createElement('th')
            rownumber.scope = "col";
            rownumber.innerHTML = "#"
            tableHeadRow.appendChild(rownumber);
            table.innerHTML = ""
            for(const [key,value] of Object.entries(firstRow)){
               var col = document.createElement('th')
               col.scope = "col"
               col.innerHTML = key
               tableHeadRow.appendChild(col);
            }
            tableHead.appendChild(tableHeadRow);
            table.appendChild(tableHead);
            let rowCount = 1;
            const tableBody = document.createElement('tbody');
            for(const item of data){
                //console.log(item['username']);
                const bodyRow = document.createElement('tr');
                var rowNumColumn = document.createElement('th');
                rowNumColumn.scope = "col";
                rowNumColumn.innerHTML = rowCount;
                bodyRow.appendChild(rowNumColumn);
               for (const [key,value] of Object.entries(item)){
                //console.log(value);
                var bodyColumn = document.createElement('td');
                bodyColumn.scope = "col";
                bodyColumn.innerHTML = value;
                bodyRow.appendChild(bodyColumn);
               }
               tableBody.appendChild(bodyRow);
               rowCount++;
            }
            table.appendChild(tableBody);
            // alert("Returned " +  (rowCount - 1)+ " rows")
            }
            else{
                alert("data attempted to search does not exist")
                return;
            }
        })
        // .then(result => {
        //    alert('Data uploaded successfully!');
        // })
        .catch(error => {
            console.error('Error:'+ error);
            alert('Error retreiving data. Please try again.');
        });
    }
    else{
        alert("Table must be selected");
        return;
    }
}


// function MakeTableColumnPair(column, value){
//     const data = {
//         Column: column,
//         Value : value,
//     }
//     return data;
// }
function importFile() {
    const csvFile = document.getElementById('ImportedData');
    const file = csvFile.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;
            processData(csvData);
        };
        reader.readAsText(file);
    } else {
        alert('Please select a CSV file');
    }
}

function processData(csvData) {
    // Here, you can parse and process the CSV data
    // For simplicity, let's assume it's an array of objects
    const parsedData = readCSV(csvData);

    const jsonData = JSON.stringify(parsedData, null, 2);
    //fs.writeFileSync("/data.json", jsonData, 'utf-8');
    //alert("data Written Successfully");

    // Send the parsed data to the server for further processing
    sendDataToServer(parsedData);
}


function readCSV(csvData) {
    // Implement your CSV parsing logic here
    // For simplicity, let's assume it's a comma-separated values
    const businessData = [];
    const roasteryData = [];
    const farmData = [];
    const restaurantData = [];
    const blendData = [];
    const customerData = [];
    const drinkData = [];
    const beansData = [];
    const blendMadeByData = [];
    const blendSoldToCustData = [];
    const blendSoldToRestData = [];
    const brewsData = [];
    const drinkSoldToData = [];
    const roastByData = [];
    const rows = csvData.split('\r\n');
    //const tableName = rows[0].split(',');
    

    for(let i = 0; i< rows.length; i++){
        const values = rows[i].split(',');
             const rowData = [];
             for (let j = 1; j < values.length; j++) {
                if(values[j] != ""){
                    rowData.push(values[j]);
                }
             }

             if (values[0] === 'Business') {
                businessData.push(rowData);
              } else if (values[0] === 'Roastery') {
                roasteryData.push(rowData);
              } else if (values[0] === 'Farm') {
                farmData.push(rowData);
              } else if (values[0] === 'Restaurant') {
                restaurantData.push(rowData);
              } else if (values[0] === 'Blend') {
                blendData.push(rowData);
              } else if (values[0] === 'Customer') {
                customerData.push(rowData);
              } else if (values[0] === 'Drink') {
                drinkData.push(rowData);
              } else if (values[0] === 'Beans') {
                beansData.push(rowData);
              } else if (values[0] === 'BlendMadeBy') {
                blendMadeByData.push(rowData);
              } else if (values[0] === 'BlendSoldToCust') {
                blendSoldToCustData.push(rowData);
              } else if (values[0] === 'BlendSoldToRest') {
                blendSoldToRestData.push(rowData);
              } else if (values[0] === 'DrinkSoldTo') {
                drinkSoldToData.push(rowData);
              } else if (values[0] === 'RoastBy') {
                roastByData.push(rowData);
              }
        };
    
    const parsedData = {
        "Business" : businessData,
        "Roastery" : roasteryData,
        "Farm" : farmData,
        "Restaurant" : restaurantData,
        "Blend" : blendData,
        "Customer" : customerData,
        "Drink" : drinkData,
        "Beans" : beansData,
        "BlendMadeBy" : blendMadeByData,
        "BlendSoldToCust" : blendSoldToCustData,
        "BlendSoldToRest" : blendSoldToRestData,
        "DrinkSoldTo" : drinkSoldToData,
        "RoastBy" : roastByData,
    }
    //     const values = rows[i].split(',');
    //     const rowData = {};

    //     for (let j = 0; j < headers.length; j++) {
    //         rowData[headers[j]] = values[j];
    //     }
    //     parsedData.push(rowData);
    // }

    return parsedData;
}

function sendDataToServer(parsedData) {
    // Use AJAX or fetch to send the data to the server
    // Example: Send a POST request to your server endpoint
    // const tableName = document.getElementById("tableOptions").value;
    // console.log(tableName);
    fetch(apiURL + '/importData', {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({
            sprocNames : insertSprocNames,
            sprocParams : insertSprocParam,
            data : parsedData,
        }),
    })
    .then(response => response.json())
    .then(data =>{
        alert("import successful");
    }) 
        
    // .then(result => {
    //     alert('Data uploaded successfully!');
    // })
    .catch(error => {
        console.error('Error:', error);
        alert('Error uploading data. Please try again.');
    });
}
