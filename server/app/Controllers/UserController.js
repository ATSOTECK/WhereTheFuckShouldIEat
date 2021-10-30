const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const util = require('util');

const dbQuery = util.promisify(dbConnection.query).bind(dbConnection);

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
        return new Promise((resolve, reject) => {
            if (!(user.username && user.password && user.firstName && user.lastName && user.birthday)) {
                console.log("All information required.");
                ctx.status = 400;
                ctx.body = [];
                return reject("All info needed");
            }
            
            (async () => {
                await dbQuery({
                    sql: `SELECT username FROM User WHERE username = ?`,
                    values: [user.username]
                }, (err, res) => {
                    try {
                        if (err) {
                            console.log('Connection error in UserController::newUser()', error);
                            ctx.body = [];
                            ctx.status = 200;
                            return reject(err);
                        }
                        
                        if (res.length === 0) {
                            console.log(`User ${user.username} does not exist.`);
                        } else {
                            console.log(`User ${user.username} already exists.`);
                            
                            ctx.status = 409;
                            ctx.body = res;
                            resolve(res);
                        }
                    } catch (e) {
                        console.log(`Error: ${e}`);
                    }
                });
            
                console.log(`Adding user ${user.username}`);
                
                const query = `
                    INSERT INTO User
                    (username, password, firstName, lastName, birthday) VALUES
                    (?, ?, ?, ?, ?)
                `;
                
                await dbQuery({
                    sql: query,
                    values: [user.username, user.password, user.firstName, user.lastName, user.birthday]
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
            })()
        });
    }
}

module.exports = UserController;
