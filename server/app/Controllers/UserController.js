const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class UserController {
    constructor() {
        console.log('UserController constructor.');
    }
    
    async getUserByID(ctx) {
        console.log(`get user with ID ${ctx.params.uid}`);
        
        return new Promise((resolve, reject) =>{
            const query = `
                        SELECT 
                            username, firstName, lastName, birthDay
                        FROM
                            User
                        WHERE
                            id = ?
            `;
            
            dbConnection.query({
                sql: query,
                values: [ctx.params.uid]
            }, (error, tuples) => {
               if (error) {
                   console.log('Connection error in UserController::getUserByID()', error);
                   ctx.body = [];
                   ctx.status = 200;
                   return reject(error);
               }
               
               ctx.body = tuples;
               ctx.status = 200;
               return resolve();
            });
        }).catch((err) => {
            console.log('Database connection error', err);
        });
    }
    
    async newUser(ctx, user) {
        console.log(`Adding user ${user.username}`);
        
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO User
                (id, username, password, firstName, lastName, birthday) VALUES
                (?, ?, ?, ?, ?, ?)
            `;
            
            dbConnection.query({
                sql: query,
                values: [user.id, user.username, user.password, user.firstName, user.lastName, user.birthday]
            }, (err, res) => {
                try {
                    if (err) {
                        reject(err);
                    }
                
                    ctx.status = 200;
                    ctx.body = res;
                    resolve(res);
                } catch (e) {
                    console.log(`Error: ${e}`);
                }
            });
        });
    }
}

module.exports = UserController;
