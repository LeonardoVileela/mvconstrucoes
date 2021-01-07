var conn = require('./db')

module.exports = {
    editClient(cpf, filds) {
        return new Promise((resolve, reject) => {
            conn.query(`
            UPDATE client SET cpf = '`+filds.cpf+`', name = '`+filds.name+`', establishment = '`+filds.establishment+`' WHERE client.cpf = '`+cpf+`'
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