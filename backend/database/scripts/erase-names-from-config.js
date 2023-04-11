/*
    Script for removing first and last names of subjects of configuration entries from experiment table
    Names were assigned to description and title of configuration.
    Configuration is a stringified JSON object.
*/ 

const sqlite3 = require("sqlite3").verbose()

let db = new sqlite3.Database("database.db")

const see_configuration = () => {
    db.all("SELECT * FROM experiment", (err, rows) => {
        for(const row of rows){
            const configuration = JSON.parse(row.configuration)
            console.log(configuration.description)
            console.log(configuration.title)
        }
    })
}

const erase_names = () => {
    db.each("select * from experiment", (err, row) => {
        const configuration = JSON.parse(row.configuration)
        console.log(row.id)
        console.log(configuration.description)
        console.log(configuration.title)
        
        configuration.description = ""
        configuration.title = ""

        // update experiment table
        //const stmt = db.prepare("UPDATE experiment SET configuration=(?) WHERE id=(?)")
        
        
        db.run(`UPDATE experiment SET configuration=$configuration WHERE id=$id`, {
            $configuration: JSON.stringify(configuration),
            $id: row.id
        })
    })
}

//erase_names()
see_configuration()