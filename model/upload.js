var conn = require('./db')

module.exports = {
    uploadArchive(file, cpf) {
        return new Promise((resolve, reject) => {

            conn.query(`
            INSERT INTO files(file, cpf)
            VALUES(?, ?)
            ;`,
                [
                    file,
                    cpf
                   
                ], (err, results) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                }
            )
        })
    }
}