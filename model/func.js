var conn = require('./db')

module.exports = {
    postFunc(filds) {
        return new Promise((resolve, reject) => {

            conn.query(`
            INSERT INTO func(cpf, name, salary)
            VALUES(?, ?, ?)
            ;`,
                [
                    filds.cpf,
                    filds.name,
                    filds.salary
                   
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