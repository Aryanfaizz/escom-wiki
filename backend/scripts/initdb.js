//Author: Luis Cabarique - B00882627

//Import nodejs libraries
import fs from 'node:fs';

//Import database configuration file
import db from '../config/config.js';

//Function to send query to database, using promise
function db_query (query, params){

	//Create promise (Query may work or fail)
	return new Promise((resolve, reject)=>{

		//Send query
		db.query(query, params, (error, result)=>{

			//If error on query, return error
			if(error) return reject(error);

			//Return result of query
			return resolve(result);
		});
	});
};

function readFile(file) {

    //Read file content
    var fileContent = undefined;
    try {
        fileContent = fs.readFileSync(file, 'utf8');
    } catch (error) {
        console.error("Read file failed: " + err.message);
        throw error
    }

    //Separate each line of file
    fileContent = fileContent.trim().split("\n");

    var fileLines = "";

    //Remove comments on file
    fileContent.forEach(line => {
        if (!line.startsWith("--")) {
            fileLines = fileLines + " " + line;
        }
    });

    //Split file in commands
    var commands = fileLines.split(";")

    return commands;
}

async function Initialize_database() {

    try {

        //Load setup and data files
        var setupFile = readFile("Transect_MySQL_Setup.sql");
        var dataFile = readFile("Transect_MySQL_Data.sql");

        //Setup database
        for(var i = 0; i < setupFile.length; i++) {
            if (setupFile[i].trim().length != 0) {
                await db_query(setupFile[i], []);
            }
        }
        console.log("Database setup complete.")

        //Initialize demo examples
        for(var i = 0; i < dataFile.length; i++) {
            if (dataFile[i].trim().length != 0) {
                await db_query(dataFile[i], []);
            }
        }
        console.log("Demo users created.")

	} catch (error) {
		console.log("InitDB failed: " + error);
        process.exit(1);
	}

    console.log("InitDB Complete");
    process.exit(0);
}

//Run database initialization
await Initialize_database();