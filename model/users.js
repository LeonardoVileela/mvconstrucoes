var conn = require('./db')

module.exports = {

    login(email, password){
        return new Promise((resolve, reject) => {

            conn.query(`
            SELECT * FROM users WHERE email = ?
            ;`,
                [
                   email
                ], (err, results) => {

                    if (err) {
                        reject(err)
                    } else {
                        if(!results.length > 0){
                            reject('Usuário ou senha incorretos')
                        }
                        let row = results[0]
                        if(row.password != password){
                            reject('Usuário ou senha incorretos')
                        }else{
                            resolve(row);
                        }
                    }
                }
            )
        })
    }
}