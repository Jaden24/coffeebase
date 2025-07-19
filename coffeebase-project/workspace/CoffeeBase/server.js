const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
const port = 3000;

// SQL Server configuration
const config = {
    server: 'golem.csse.rose-hulman.edu',
    database: 'Coffeebase2',
    user: 'jungh',
    password: 'Unitednations7*',
    encrypt: false,
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

app.post('/checkUser', (req, res) => {
    //connection
    const uname = req.body.uname;
    const userPassword = req.body.userPassword;
    console.log(userPassword);
    sql.connect(config).then(pool => {
        console.log("connected to Coffee database for User Verification2");
        
        // Insert each row into the SQL Server table
        const request = pool.request();
        const getQuery = `SELECT PasswordHash FROM [user] Where Username = '${uname}'`
        request.query(getQuery, (error, results) => {
            if(error){
                console.error('Error executing the query statement ' + getQuery + ' due to ' + error);
                res.status(500).send('Internal server error: ' + error);
                return;
            }
            let Phash = JSON.stringify(results.recordset);
            let hash = Phash.slice(18, -3);

            console.log("results: " + hash);
            console.log("input pass: " + userPassword);
            bcrypt.compare(userPassword, hash, function(err, result) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("comparison result: " + result);  // true if the passwords match, false otherwise
                res.json({ match: result });  // send the result back to the client
            });
            
        })
    })
    .catch (error => {
    console.error('Error:'+ error);
    res.send({
        "error": error,
    });
    res.status(500).json({ error: 'Internal Server Error' });
});
});

app.post('/getTable', (req, res)=>{
    const updateTableName = req.body.tableName;
    sql.connect(config).then(pool =>{
        const request = pool.request();
        const getQuery = "Select * from " + updateTableName;
        request.query(getQuery, (error,  results) =>{
            if(error){
                console.error('Error executing the query statement ' + getQuery + ' due to ' + error);
                res.status(500).send('Internal server error: ' + error);
                return;
            }
            //console.log(results.recordset);
            res.json(results.recordset);
        })

    }).then(result =>{
        
    }).catch (error => {
        console.error('Error:'+ error);
        res.send({
            "error": error,
        });
        res.status(500).json({ error: 'Internal Server Error' });
    });
})



app.get('/getUser', (req, res) => {
        //connection
        sql.connect(config).then(pool => {
            console.log("connected to Coffee database for User Verification");
            
        // Insert each row into the SQL Server table
                const request = pool.request();
                const getQuery = 'SELECT Username, isOwner FROM [user]'
                request.query(getQuery, (error, results) => {
                    if(error){
                        console.error('Error executing the query statement ' + getQuery + ' due to ' + error);
                        res.status(500).send('Internal server error: ' + error);
                        return;
                    }
                    console.log(results.recordset);
                    res.json(results.recordset);
                })
         })
        .catch (error => {
        console.error('Error:'+ error);
        res.send({
            "error": error,
        });
        res.status(500).json({ error: 'Internal Server Error' });
    });
});
app.post('/registerNewUser', (req, res) => {
    const username = req.body.NewID
    const password = req.body.NewPassword;
    const salt = req.body.salt;
    const isOwner = req.body.isOwner;

    console.log("Registering...");
    bcrypt.hash(password, salt, function(err, hash) {
        console.log("Hashed");

        console.log(username, hash);

        //connection
        sql.connect(config).then(pool => {
            console.log("connected to Coffee database for registering a new user");
            if(username == null || password == null){
                res.send({
                    "response": "Invalid username or password"
                });
                sql.close();
                return;
            }
                const request = pool.request();
                const insertQuery = `Exec Register @username = '${username}', @PasswordHash = '${hash}', @IsOwner = '${isOwner}'`;
                request.query(insertQuery, (error, results) => {
                    if(error){
                        console.error('Error executing the query statement ' + insertQuery + ' due to ' + error);
                        res.status(500).send('Internal server error: '+ error);
                        sql.close();
                        return;
                    }
                    console.log ("sucessfully registered " + username);
                    res.json("sucessfully registered " + username);
                })
            })
        .then(result =>{
            //sql.close();
            //console.log ("sucessfully inserted " + numRows + " rows into " + tableName);
            // res.json({ success: true });
        })
        // Close the SQL Server connection at some point
        .catch (error => {
        console.error('Error:'+ error);
        res.send({
            "error": error,
        });
        res.status(500).json({ error: 'Internal Server Error: Server shutting down...' });
        sql.close();
        });
    });
});

app.post('/importData', (req, res) => {
    const data = req.body.data
    const insertSprocNames = req.body.sprocNames;
    const insertSprocParam = req.body.sprocParams;

        //connection
        sql.connect(config)
        .then(pool => {
    // Stored procedure name and parameters
        //const storedProcedureName = sproc;
        for(const [tableName, values] of Object.entries(data)){
            var sprocName = insertSprocNames[tableName];
            var sprocParamNames = insertSprocParam[tableName];
            for(let i = 0; i < values.length; i++){
                //const placeHolders = sprocParamNames.map(param => `@${param}`).join(', ');
                const storedProcedureCall = sprocName;//`EXEC ${sprocName} ${placeHolders}`;
                const request = pool.request();
                sprocParamNames.forEach((param, index)=>{
                    request.input(param, sql.NVarChar, values[i][index]);
                    //console.log(values[i])
                })
                request.execute(storedProcedureCall,(error, results) =>{
                    if(error) {
                        console.error("Populate Failed:", error)
                        sql.close();
                        return;
                    }
                    else{
                        //console.log(results)
                        //res.json("successfully populated the database");
                    }

                })
            }
            console.log("successfully populated " + tableName);
        }
        console.log("succesfully populated the Database");
        res.json("sucessfully populated the Database");
    })
  .then(result =>{
            //sql.close();
            //console.log ("sucessfully inserted " + numRows + " rows into " + tableName);
            // res.json({ success: true });
        })
        // Close the SQL Server connection at some point
        .catch (error => {
        console.error('Error:', error);
        res.send({
            "error": error,
        });
        res.status(500).json({ error: 'Internal Server Error: Server shutting down...' });
        sql.close();
    });
});

//input new USER
app.post('/addData', (req, res) => {
    const query = req.body.insertQuery;
    console.log(query);
        //connection
        sql.connect(config).then(pool => {
            console.log("connected to Coffee database for adding data");
        // Insert a row into the SQL Server table
                const request = pool.request();
                request.query(query, (error ,results) => {
                    if(error){
                        console.error('Error executing the query statement ' + query + ", due to " + error);
                        res.status(500).send('Internal server error: '+ error);
                        sql.close();
                        return;
                    }
                    //console.log(row);
                    console.log("Successfully added a row");
                    console.dir("Successfully added a row");
                    res.json("Successfully added a row");
                });
            
        }).then(result =>{
            //sql.close();
            //console.log ("sucessfully inserted " + numRows + " rows into " + tableName);
            //res.json({ success: true });
        })
        // Close the SQL Server connection at some point
        .catch (error => {
        console.error('Error:', error);
        res.send({
            "error": error,
        });
        res.status(500).json({ error: 'Internal Server Error: Server shutting down...' });
        sql.close();
    });
});

app.post('/SelectData', (req, res) =>{
    const parameters = req.body.Param
    const sproc = req.body.StoredProcedure
    const parameterNames = req.body.paramNames;
    const paramAndParameters = [];
    console.dir(sproc);
    console.dir(parameters , sproc);

    sql.connect(config)
        .then(pool => {
    // Stored procedure name and parameters
        const storedProcedureName = sproc;
        for(let i = 0; i < parameters.length; i++){
            var data = {
                paramName : parameterNames[i],
                value : parameters[i],
            }
            if(parameters[i] != ''){
                paramAndParameters.push(data);
            }
        }

        // { name: 'param1', type: sql.Int, value: 123 },
        // { name: 'param2', type: sql.NVarChar, value: 'example' },

    // Create a new Request object
        const request = pool.request();

    // Add parameters to the Request object
        paramAndParameters.forEach(data => {
        request.input(data.paramName, data.value);
        });

    // Execute the stored procedure
        request.execute(storedProcedureName, (error, results) =>{
        if(error){
            console.error('Error executing the query statement due to'+ error);
            res.status(500).send('Internal server error: '+ error);
            sql.close();
            return;
        }
        console.dir(results);
        if(results.recordsets.length == 0){
            res.json(results.recordsets);
        }
        res.json(results.recordset);
    });
  })
//   .then(result => {
//     // Process the result of the stored procedure
//     console.dir(result);
//   })
  .catch(err => {
    // Handle errors
    console.error(err);
  });
})

app.post('/UpdateData', (req, res) =>{
    const parameters = req.body.Param
    const sproc = req.body.StoredProcedure
    const parameterNames = req.body.paramNames;
    const paramAndParameters = [];
    console.log('Received parameters:', parameters);
    console.log('Received stored procedure:', sproc);
    console.log('Received parameter names:', parameterNames);

    // Check if parameters and parameterNames are defined
    if (!parameters || !parameterNames || parameters.length !== parameterNames.length) {
        console.error('Invalid parameters received.');
        res.status(400).send('Invalid parameters received.');
        return;
    }
    
    console.dir(sproc);
    console.dir(parameters , sproc);

    sql.connect(config)
        .then(pool => {
    // Stored procedure name and parameters
        const storedProcedureName = sproc;
        for(let i = 0; i < parameters.length; i++){
            var data = {
                paramName : parameterNames[i],
                value : parameters[i],
            }
            if(parameters[i] != ''){
                paramAndParameters.push(data);
            }
        }

        // { name: 'param1', type: sql.Int, value: 123 },
        // { name: 'param2', type: sql.NVarChar, value: 'example' },

    // Create a new Request object
        const request = pool.request();

    // Add parameters to the Request object
        paramAndParameters.forEach(data => {
        request.input(data.paramName, data.value);
        });

    // Execute the stored procedure
        request.execute(storedProcedureName, (error, results) =>{
        if(error){
            console.error('Error executing the query statement due to'+ error);
            res.status(500).send('Internal server error: '+ error);
            sql.close();
            return;
        }
        console.dir(results);
        res.json({Message: "Update Successful"});
    });
  })
//   .then(result => {
//     // Process the result of the stored procedure
//     console.dir(result);
//   })
  .catch(err => {
    // Handle errors
    console.error(err);
  });
})


app.post('/DeleteData', (req, res) =>{
    const parameters = req.body.Param
    const sproc = req.body.StoredProcedure
    const parameterNames = req.body.paramNames;
    const paramAndParameters = [];
    console.log('Received parameters:', parameters);
    console.log('Received stored procedure:', sproc);
    console.log('Received parameter names:', parameterNames);

    // Check if parameters and parameterNames are defined
    if (!parameters || !parameterNames || parameters.length !== parameterNames.length) {
        console.error('Invalid parameters received.');
        res.status(400).send('Invalid parameters received.');
        return;
    }
    
    console.dir(sproc);
    console.dir(parameters , sproc);

    sql.connect(config)
        .then(pool => {
    // Stored procedure name and parameters
        const storedProcedureName = sproc;
        for(let i = 0; i < parameters.length; i++){
            var data = {
                paramName : parameterNames[i],
                value : parameters[i],
            }
            if(parameters[i] != ''){
                paramAndParameters.push(data);
            }
        }

        // { name: 'param1', type: sql.Int, value: 123 },
        // { name: 'param2', type: sql.NVarChar, value: 'example' },

    // Create a new Request object
        const request = pool.request();

    // Add parameters to the Request object
        paramAndParameters.forEach(data => {
        request.input(data.paramName, data.value);
        });

    // Execute the stored procedure
        request.execute(storedProcedureName, (error, results) =>{
        if(error){
            console.error('Error executing the query statement due to'+ error);
            res.status(500).send('Internal server error: '+ error);
            sql.close();
            return;
        }
        console.dir(results);
        res.json("Delete Successful");
    });
  })
//   .then(result => {
//     // Process the result of the stored procedure
//     console.dir(result);
//   })
  .catch(err => {
    // Handle errors
    console.error(err);
  });
})



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});