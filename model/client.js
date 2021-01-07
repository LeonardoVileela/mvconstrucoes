var conn = require('./db')

module.exports = {
    postClient(filds) {
        return new Promise((resolve, reject) => {

            conn.query(`
            INSERT INTO client(cpf, name, establishment)
            VALUES(?, ?, ?)
            ;`,
                [
                    filds.cpf,
                    filds.name,
                    filds.establishment
                   
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