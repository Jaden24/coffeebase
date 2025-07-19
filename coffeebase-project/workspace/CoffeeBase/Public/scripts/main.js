

var coffee = coffee || {};
var admin = false;
var authDirector = null;

coffee.functionName = function(){
}

const Business = ["Business Name", "Business location", "Business Contact"];
const Roastery = ["Roastery Name", "Roastery Location", "Roastery Contact"];
const Restaurant = ["Restaurant Name", "Restaurant Address", "Restaurant Contact"];
const Farm = ["Farm Name", "Farm Address", "Farm Contact"];
const Customer = ["Customer Name", "Customer Address", "Username"];
const Beans = ["Breed Name", "Farm From Location" , "Farm From Contact"];
const Blend = ["Blend Flavor","Blend Origin","Blend Name"];
const BlendMadeBy = ["BlendID", "Roastery Location", "Roastery Contact"];
const BlendSoldToCust = ["Price", "Quantity", "ID of Blend Sold","Customer Purchased"];
const BlendSoldToRest = ["Price", "Quantity", "ID of Blend Sold", "Restaurant Name", "Restaurant Address", "Restaurant Contact"];
const Drink = ["Restaurant Name", "Restaurant Address", "Restaurant Contact", "Drink Name", "Price"];
const DrinkSoldTo = ["ID of Drink Sold", "Restaurant Name", "Restaurant Address", "Restaurant Contact", "Customer Purchased"];
const RoastBy = ["Bean Type", "Roastery Location", "Roastery Contact", "Roasted Beans"];


const tableNames = ["Business", "Roastery", "Restaurant", "Farm", "Customer", "Beans", "Blend", "BlendMadeBy", "BlendSoldToCust", "BlendSoldToRest", "Drink", "DrinkSoldTo", "RoastBy"];
const listOfTables = [Business, Roastery, Restaurant, Farm, Customer, Beans, Blend, BlendMadeBy, BlendSoldToCust, BlendSoldToRest, Drink, DrinkSoldTo, RoastBy];




coffee.initializePage = function(){
    //window.location.href= "/main.html";
        if(document.querySelector("#registerPage")){
        console.log("you are at register page");
        new coffee.RegisterPageController();
        }
        if(document.querySelector("#loginPage")){
        console.log("you are at login page");
        new coffee.LoginPageController();
        }
        if(document.querySelector("#mainPage")){
        console.log("you are at a main page");
        new coffee.mainPageController();
        }
    
}

coffee.LoginPageController = class{
    constructor(){
        document.getElementById("loginButton").addEventListener("click", (event) => {
            const userID = document.getElementById("inputUsername").value;
            const password =  document.getElementById("currentPassword").value;
            console.log("username: " + userID);
            console.log("password" + password);
            coffee.authDirector.authenticateUser(userID, password)
            .then(auth =>{
                if(auth){
                    coffee.authDirector.setUser(userID);
                    //coffee.authDirector.toggleState(true);
                }
                else{
                    //coffee.authDirector.toggleState(false);
                    alert("authentication failed");
                }
                console.log("is logged in: " + coffee.authDirector.isLoggedIn);
                console.log('is admin:'+ coffee.authDirector.isAdmin);
            }); 
        })
        document.getElementById("signUpButton").addEventListener("click", (event)=>{
            window.location.href = "/register.html";
        })
    }
}

coffee.RegisterPageController = class {    
    constructor(){  
        document.getElementById("registerButton").addEventListener("click", (event) =>{
            const userID = document.getElementById("inputNewUsername").value;
            const password =  document.getElementById("inputNewPassword").value;
            const repeatPassword = document.getElementById("inputNewRepeatPassword").value;
            const isOwner = document.getElementById("isOwnerCheck").checked;
            console.log(userID);
            console.log(password);
            console.log(repeatPassword);
            console.log("Check button" + isOwner);
            registerNewUser(userID, password, isOwner);
        })
        document.getElementById("backButton").addEventListener("click", (event)=>{
            window.location.href = "/index.html";
        });
    }
}

coffee.mainPageController = class {
    constructor(){
        console.log("is logged in: " + coffee.authDirector.isLoggedIn);
        console.log("is Admin: " + coffee.authDirector.isAdmin); 
        const navTab = document.getElementById("navTab");
        if(coffee.authDirector.isAdmin == 'no'){
            navTab.innerHTML = "";
            const searchButton = document.createElement('a');
            //searchButton.className = "nav-link";
            searchButton.className = "nav-link"
            searchButton.href ="/SELECT.html";
            searchButton.innerHTML = 'Look Up Drinks'
            navTab.appendChild(searchButton);
        }
        else{
            navTab.innerHTML = "";
            const htmlString = '<a class="nav-link active" aria-current="page" href="/main.html">ADD Drinks/Businesses</a> <a class="nav-link" href="/update.html">CHANGE Products/Location</a> <a class="nav-link" href="/delete.html">DELETE Product/Business</a> <a class="nav-link" href="/SELECT.html">Look Up Drinks</a> <a class = "nav-link">Signed in as Business Owner</a>'
            navTab.innerHTML = htmlString;
        }       
        
        document.getElementById("logoutButton").addEventListener("click", (event) =>{
          coffee.authDirector.signOut();
        })

    }
}

const removeFarm = ["Address: ", "Phone Number:"];

const deleteSprocNames = ["Business"];
const deleteListOfSproc = [removeFarm];


function switchDeletePageHTML(){
    const tableName = "Business";
    document.getElementById("instructions").innerHTML ="";
    if(document.getElementById("deleteOptions").value != "What would you like to delete?"){
        const tableIndex = deleteSprocNames.indexOf(tableName);
        const tableColumns = deleteListOfSproc[tableIndex];
        console.log(tableIndex);
        console.log(tableColumns);
        //const fieldContainer = document.getElementById("deleteFields");
        //fieldContainer.innerHTML = "";
        fetch(apiURL + '/getTable',
            {method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                tableName : tableName,
            }),
        })
        .then(response => response.json())
        .then(data =>{
            if(data.length != 0){
                const firstRow = data[0];
                const table = document.getElementById("selectedDeleteFields")
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
                    var deleteColumn = document.createElement('td');
                    deleteColumn.scope = "col";
                    var modal = createDeleteModal(tableName, deleteColumn ,rowCount);
                    bodyRow.appendChild(modal);
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
        var instructions = document.getElementById("instructions");
        var instructionElement = document.createElement('a');
        instructions.innerHTML = "To Update, Click the Delete button in the last data column"
        instructions.style.color = "Blue"
        instructions.style.fontWeight ="bold";
        instructions.appendChild(instructionElement);
        }
        else{
            document.getElementById("selectedDeleteFields").innerHTML = "";
        }
}

function switchDeleteInfoTab(buttonID){
    document.getElementById("warnings").innerHTML = "";
    var deleteName = "";
    var deleteLocation = "";
    var deleteContact = "";
    console.log("swtiched to " + buttonID);
    const tableName = document.getElementById("deleteOptions").value;
    const table = document.getElementById("selectedDeleteFields");
    const rows = table.getElementsByTagName("tr");
    const heads = rows[0].getElementsByTagName("th");
    var cells = rows[buttonID].getElementsByTagName("td");
    deleteName = cells[0].textContent;
    deleteLocation = cells[1].textContent;
    deleteContact = cells[2].textContent;
    console.log(deleteName,deleteLocation,deleteContact);
    // const tableIndex = updateSprocNames.indexOf(tableName);
    // const tableColumns = updateListOfSproc[tableIndex];
    // console.log(tableIndex);
    // console.log(tableColumns);
    const fieldContainer = document.getElementById("deleteFields");
    fieldContainer.innerHTML = "";
//     <input type="text" id="Field_3" class="form-control" />
//   <label class="form-label" for="Field_3">Field 3</label>
    for(let i = 0; i< 3; i++){
        var input = document.createElement('input');
        var label = document.createElement('label');
        input.type = "text";
        input.className = "form-control";
        label.className = "form-label";
        if(i == 0){
            input.value = deleteName
            //input.disabled = true;
            input.style.border = "none";
            input.style.textAlign = "center";
            label.innerHTML = "Business Name"
            label.style.fontSize = "1.3rem";
        }
        if(i == 1){
            input.id = "Field_0";
            input.value =deleteLocation;
            //input.disabled = true;
            input.style.border = "none";
            input.style.textAlign = "center";
            label.htmlFor = "Field_0"
            label.innerHTML = removeFarm[0];
            label.style.fontSize = "1.3rem";
        }
        if(i == 2){
            input.id = "Field_1";
            input.value =deleteContact;
            //input.disabled = true;
            input.style.border = "none";
            input.style.textAlign = "center";
            label.htmlFor = "Field_1"
            label.innerHTML = removeFarm[1];
            label.style.fontSize = "1.3rem";
        }
        //input.className = "form-control";
        //label.className = "form-label";
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
    }
    var deleteCommentsSection = document.getElementById("warnings")
    var deleteComments = document.createElement('a');
    deleteComments.innerHTML = "NOTE: Pressing COMMIT will <strong>PERMENANTLY</strong> delete the selected information above from the database.<br> The applied changes can also <strong>IMPACT</strong> other sets of Data.<br> Please check the information above before commit";
    deleteCommentsSection.appendChild(deleteComments)


}

const updateDrink = ["Old Name", "New Name", "Restaurant Name"];
const updateBlend = ["Old Name", "New Name", "Origin"];
const updateLocation = ["Old Location", "New Location", "Phone Number"];

const updateSprocNames = ["updateDrink", "updateBlend", "updateLocation"];
const updateTableNames = ["Drink", "Blend", "Business"];
const updateListOfSproc = [updateDrink, updateBlend, updateLocation];

function switchUpdatePageHTML(){
    document.getElementById("updateFields").innerHTML = "";
    document.getElementById("comments").innerHTML = "";
    document.getElementById("instructions").innerHTML = "";
    const tableName = document.getElementById("updateOptions").value;
    if(tableName != "What would you like to update?"){
        console.log(tableName);
        const tableIndex = updateSprocNames.indexOf(tableName);
        console.log(tableIndex);
        const tableToUpdate = updateTableNames[tableIndex];
        fetch(apiURL + '/getTable',
            {method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                tableName : tableToUpdate,
            }),
        })
        .then(response => response.json())
        .then(data =>{
            if(data.length != 0){
                const firstRow = data[0];
                const table = document.getElementById("selectedUpdateFields")
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
                    var updateColumn = document.createElement('td');
                    updateColumn.scope = "col";
                    var modal = createUpdateModal(tableName, updateColumn ,rowCount);
                    bodyRow.appendChild(modal);
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
        var instructions = document.getElementById("instructions");
        var instructionElement = document.createElement('a');
        instructions.innerHTML = "To Update, Click the Update button in the last data column"
        instructions.style.color = "Blue"
        instructions.style.fontWeight ="bold";
        instructions.appendChild(instructionElement);
    }else{
        document.getElementById("selectedUpdateFields").innerHTML = "";
    }
}

function switchUpdateInfoTab(buttonID){
    document.getElementById("comments").innerHTML = "";
    var oldField="";
    var condition ="";
    var changingField =""
    console.log("swtiched to " + buttonID);
    const tableName = document.getElementById("updateOptions").value;
    const table = document.getElementById("selectedUpdateFields");
    const rows = table.getElementsByTagName("tr");
    const heads = rows[0].getElementsByTagName("th");
    var cells = rows[buttonID].getElementsByTagName("td");
    if(tableName == "updateDrink"){
        oldField = cells[0].textContent;
        condition = cells[3].textContent;
        changingField = heads[1].textContent;
    }
    else if(tableName == "updateBlend"){
        oldField = cells[2].textContent;
        condition = cells[1].textContent;
        changingField = heads[3].textContent;
    }
    else if(tableName == "updateLocation"){
        oldField = cells[1].textContent;
        condition = cells[2].textContent;
        changingField = heads[2].textContent;
    }
    console.log(oldField,condition,changingField);
    const tableIndex = updateSprocNames.indexOf(tableName);
    const tableColumns = updateListOfSproc[tableIndex];
    console.log(tableIndex);
    console.log(tableColumns);
    const fieldContainer = document.getElementById("updateFields");
    fieldContainer.innerHTML = "";
//     <input type="text" id="Field_3" class="form-control" />
//   <label class="form-label" for="Field_3">Field 3</label>
    for(let i = 0; i< tableColumns.length; i++){
        var input = document.createElement('input');
        input.type = "text";
        input.id = "Field_" + i;
        input.style.textAlign = "center";
        input.className = "form-control";
        if(i == 0){
            input.value = oldField;
            //input.disabled = true;
            input.style.border = "none";
        }
        if(i == 1){
            input.placeholder = "Enter New Value"
        }
        if(i == 2){
            input.value =condition;
            //input.disabled = true;
            input.style.border = "none";
        }
        //input.className = "form-control";
        var label = document.createElement('label');
        //label.className = "form-label";
        label.htmlFor = "Field_" +i
        label.className = "form-label";
        label.innerHTML = tableColumns[i];
        label.style.fontSize = "1.3rem";
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
    }
    var changeCommentsSection = document.getElementById("comments")
    var changeComments = document.createElement('a');
    changeComments.innerHTML = "NOTE: By Pressing COMMIT, it will apply changes to the database.<br> This will change the selected data's <strong>" + changingField + "</strong> above to the new value <strong>PERMENANTLY</strong>.";
    changeCommentsSection.appendChild(changeComments);
}

function createUpdateModal(tableName, updateColumn, rowNum){

const updateButton = document.createElement('button');
updateButton.className = "btn btn-secondary";
updateButton.type = "button";
updateButton.id = rowNum;
updateButton.innerHTML = "update";
updateButton.onclick = function (){
    switchUpdateInfoTab(rowNum);
};
updateColumn.appendChild(updateButton);
return updateColumn;
}
function createDeleteModal(tableName, deleteColumn, rowNum){

    const updateButton = document.createElement('button');
    updateButton.className = "btn btn-danger btn-floating";
    updateButton.type = "button";
    updateButton.id = rowNum;
    updateButton.innerHTML = "Delete";
    const bootstraps = document.createElement('i')
    bootstraps.className = "fas fa-magic";
    updateButton.onclick = function (){
        switchDeleteInfoTab(rowNum);
    };
    updateButton.appendChild(bootstraps);
    deleteColumn.appendChild(updateButton);
    return deleteColumn;
    }


function switchMainPageHTML(){
    document.getElementById("selectedInputFields").innerHTML= ""; 
    const tableName = document.getElementById("tableOptions").value;
    if(tableName != "Choose Category to Add"){
        const tableIndex = tableNames.indexOf(tableName);
        const tableColumns = listOfTables[tableIndex];
        console.log(tableIndex);
        console.log(tableColumns);
        const fieldContainer = document.getElementById("inputFields");
        fieldContainer.innerHTML = "";
    //     <input type="text" id="Field_3" class="form-control" />
    //   <label class="form-label" for="Field_3">Field 3</label>
        for(let i = 0; i< tableColumns.length; i++){
            var input = document.createElement('input');
            input.type = "text";
            input.id = "Field_" + i;
            input.className = "form-control";
            input.style.textAlign = "center";
            var label = document.createElement('label');
            label.className = "form-label";
            label.htmlFor = "Field_" +i
            label.innerHTML = tableColumns[i];
            label.style.fontSize = "1.3rem";
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
        }
    }
    else{
        document.getElementById("inputFields").innerHTML = "";
    }
}

const SelectDrink = ["Drink Name", "Restaurant Name"];
const DrinkOrigin = ["Drink Name"];
const BlendLookUP = ["Blend Name"];
const SelectSprocNames = ["Drink" , "DrinkOrigin", "Blend"];
const SelectListOfSproc = [SelectDrink, DrinkOrigin, BlendLookUP];

function switchSelectPageHTML(){
    const sprocName = document.getElementById("searchOptions").value;
    if(sprocName != "Select Category"){
        const Index = SelectSprocNames.indexOf(sprocName);
        const SprocColumns = SelectListOfSproc[Index];
        const fieldContainer = document.getElementById("inputConditions");
        fieldContainer.innerHTML = "";
    //     <input type="text" id="Field_3" class="form-control" />
    //   <label class="form-label" for="Field_3">Field 3</label>
        for(let i = 0; i< SprocColumns.length; i++){
            var input = document.createElement('input');
            input.type = "text";
            input.id = "Field_" + i;
            input.placeholder = "Enter Search Value"
            input.style.textAlign = "center";
            input.className = "form-control";
            //input.className = "form-control";
            var label = document.createElement('label');
            //label.className = "form-label";
            label.htmlFor = "Field_" +i
            label.className = "form-label";
            label.innerHTML = SprocColumns[i];
            label.style.fontSize = "1.3rem";
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
        }
    }
    else{
        document.getElementById("inputFields").innerHTML = "";
    }

}


    class AuthDirector {
    constructor() {
        this.loggedIn = localStorage.getItem('loggedIN') || '';
        this.admin = localStorage.getItem('Admin') || 'no';
    }

    setUser(username){
        fetch(apiURL + '/getUser').then(response => response.json())
        .then(data=>{
            console.log(data)
            for(const row of data){
                var un = row['Username'];
                console.log("username:" + un);
                if(un == username){
                    this.loggedIn = un;
                    this.admin = row['isOwner'];
                    localStorage.setItem('loggedIN', un)
                    localStorage.setItem('Admin', row['isOwner'])
                    if(row['isOwner'] == 'yes'){
                        window.location.href = "/main.html";
                    }
                    else{
                        window.location.href = "/SELECT.html";
                    }
                    return;
                }
            }
        })
    }

    authenticateUser(ID, Password) {
        return new Promise((resolve, reject) => {
        const inputUserID = ID;
        const inputPassword = Password;
        if (inputUserID === "" || inputPassword === "") {
            alert("Username and password can't be empty");
            return;
        } 
        else {
            const tableName = "User";
            fetch(apiURL + '/checkUser',{method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                uname: inputUserID,
                userPassword: inputPassword
            }),})
            .then(response => response.json())
            .then(data => {
                if (data.match) {
                    console.log("login successful");
                    resolve(true);
                    return;
                } else {
                    console.log("wrong creds :(");
                    resolve(false);
                    return;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        });
    }

    signOut(){
        console.log("logout");
        // coffee.authDirector.toggleState(false);
        console.log(localStorage);
         localStorage.setItem('loggedIN', '');
         console.log(this.isLoggedIn);
         //coffee.authDirector.toggleMember(false);
         localStorage.setItem('Admin', 'no');
         console.log(localStorage);
         window.location.href = "/index.html";
         //coffee.login = false;
    }
    // toggleState(bool){
    //     localStorage.setItem('loggedIN',bool);
    // }
    // toggleMember(bool){
    //     localStorage.setItem('Admin', bool);
    // }

    get isLoggedIn() {
        return this.loggedIn;
    }
    get isAdmin() {
        return this.admin;
    }
};



function registerNewUser(ID, password, isOwner){
    const inputID = ID;
    const inputPassword = password;
    const salt = 10;
    var owner = "no";
    if(isOwner){
        owner = "yes";
    }
    if(inputID == "" || inputPassword == ""){
        alert("username and password are required");
        return;
    }

        fetch(apiURL + '/registerNewUser', {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                NewID : inputID, 
                NewPassword : inputPassword,
                salt: salt,
                isOwner: owner
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert(JSON.stringify(data));
        })
        // .then(result => {
        //     alert('Data uploaded successfully!');
        // })
        .catch(error => {
            console.error('Error:'+ error);
            alert('Error uploading data. Please try again.');
        });
    
}

    function checkRedirects(){
    console.log("Check Redirects");
    if(document.querySelector("#loginPage") && coffee.authDirector.isLoggedIn != '' && coffee.authDirector.isAdmin == 'yes'){
        window.location.href = "/main.html";
        }
    else if(document.querySelector("#loginPage") && coffee.authDirector.isLoggedIn != '' && !coffee.authDirector.isAdmin == 'no'){
        window.location.href = "/SELECT.html";
        }
    else if(document.querySelector("#mainPage")  && coffee.authDirector.isLoggedIn == ''){
        window.location.href = "/index.html"
        }
    
    
}

coffee.main = function(){
    console.log("ready");
    //coffee.login = false;
    // coffee.MakeTableColumnPair();
    console.log(localStorage);
    coffee.authDirector = new AuthDirector();
    console.log("userLoggedIn: " + coffee.authDirector.isLoggedIn);
    console.log("isAdmin:" + coffee.authDirector.isAdmin);
    
        checkRedirects();
        coffee.initializePage();
    
    
    
}

coffee.main();


