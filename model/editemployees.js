var conn = require('./db')

module.exports = {
    editEmployees(cpf, filds) {
        return new Promise((resolve, reject) => {
            conn.query(`
            UPDATE func SET cpf = '`+filds.cpf+`', name = '`+filds.name+`', salary = '`+filds.salary+`' WHERE func.cpf = '`+cpf+`'
            ;`, (err, results) => {

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