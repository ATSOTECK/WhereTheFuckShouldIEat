const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const util = require('util');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const dbQuery = util.promisify(dbConnection.query).bind(dbConnection);

const RestaurantController = new (require('./RestaurantController.js'))();

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
    
    async getUserByUsername(ctx) {
        console.log(`get user with username ${ctx.params.username}`);
        
        return new Promise((resolve, reject) =>{
            const query = `
                        SELECT 
                            username, firstName, lastName, birthDay
                        FROM
                            User
                        WHERE
                            username = ?
            `;
            
            dbConnection.query({
                sql: query,
                values: [ctx.params.username]
            }, (error, res) => {
               if (error) {
                   console.log('Connection error in UserController::getUserByUsername()', error);
                   ctx.body = [];
                   ctx.status = 200;
                   return reject(error);
               }
               
               if (res.length === 0) {
                   console.log(`could not get user for ${ctx.params.username}`);
                   ctx.body = "not found";
                   ctx.status = 400;
               } else {
                   ctx.body = res;
                   ctx.status = 200;
               }
               return resolve();
            });
        }).catch((err) => {
            console.log('Database connection error', err);
        });
    }
    
    async getUserPassword(user) {
        return new Promise((resolve, reject) =>{
            const query = `
                        SELECT 
                            password
                        FROM
                            User
                        WHERE
                            username = ?
            `;
            
            dbConnection.query({
                sql: query,
                values: [user]
            }, (error, tuples) => {
               if (error) {
                   console.log('Connection error in UserController::getUserPassword()', error);
                   return reject(error);
               }
               
               return resolve(tuples);
            });
        }).catch((err) => {
            console.log('Database connection error', err);
        });
    }
    
    async newUser(ctx, user) {
        return new Promise((resolve, reject) => {
            //Make sure all the boxes were filled out.
            if (!(user.username && user.password && user.firstName && user.lastName && user.birthday)) {
                console.log("All information required.");
                ctx.status = 400;
                ctx.body = [];
                return reject("All info needed");
            }
            
            //Check and see if the user exists already.
            dbConnection.query({
                sql: `SELECT username FROM User WHERE username = ?`,
                values: [user.username]
            }, async (err, res) => {
                try {
                    if (err) {
                        console.log('Connection error in UserController::newUser()', error);
                        ctx.body = [];
                        ctx.status = 200;
                        return reject(err);
                    }
                    
                    if (res.length === 0) {
                        console.log(`User ${user.username} does not exist.`);
                        
                        console.log(`Adding user ${user.username}`);
                        
                        const encryptedPassword = await bcrypt.hash(user.password, 10);
                        //console.log(encryptedPassword);
                        
                        //Add the user if it doen't exist.
                        const query = `
                            INSERT INTO User
                            (username, password, firstName, lastName, birthday) VALUES
                            (?, ?, ?, ?, ?)
                        `;
                        
                        dbQuery({
                            sql: query,
                            values: [user.username, encryptedPassword, user.firstName, user.lastName, user.birthday]
                        }, (err, res) => {
                            try {
                                if (err) {
                                    reject(err);
                                }
                                
                                const token = jwt.sign(
                                    {userID: user.username},
                                    process.env.JWT_KEY,
                                    {expiresIn: "24h"}
                                );
                            
                                ctx.status = 200;
                                ctx.body = {
                                    status: "success",
                                    token: token
                                };
                                resolve(res);
                            } catch (e) {
                                console.log(`Error: ${e}`);
                            }
                        });
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
        });
    }
    
    //Meant to be called internally by the server.
    async getUserID(username) {
        console.log(`Getting userID for ${username}`);
        return new Promise((resolve, reject) => {
            const query = `SELECT id FROM User WHERE username = ?`;
            
            dbConnection.query({
                sql: query,
                values: [username]
            }, (error, tuples) => {
                if (error) {
                    console.log('Connection error in UserController::getUserID()', error);
                    return reject(error);
                }
                
                return resolve(tuples[0].id);
            });
        }).catch((err) => {
            console.log('Database connection error', err);
        });
    }
    
    async checkIfInHistory(uID, rID) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM UserHistory WHERE userID = ? AND restaurantID = ?`;
            
            dbConnection.query({
                sql: query,
                values: [uID, rID]
            }, (error, res) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                
                if (res[0]) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }
    
    async addToHistory(ctx, toAdd) {
        console.log(`Adding ${toAdd.place_id} to ${toAdd.username}'s history.`);
        
        //Assume the user and restaurant exist.
        const uID = await this.getUserID(toAdd.username);
        const rID = await RestaurantController.getRestaurantID(toAdd.place_id);
        
        console.log(`uID ${uID} : rID ${rID}`);
        
        return new Promise(async (resolve, reject) => {
            if (!(uID && rID)) {
                return reject("Can't get uID or rID.");
            }
            
            const exists = await this.checkIfInHistory(uID, rID);
            if (exists === true) {
                console.log("Already in the user history.");
                ctx.status = 409;
                ctx.body = [];
                return resolve("Already in the user history.");
            }
            
            console.log('Adding to user history.');
            const query = `INSERT INTO UserHistory (userID, restaurantID) VALUES (?, ?)`;
            
            dbConnection.query({
                sql: query,
                values: [uID, rID]
            }, async (error, res) => {
                try {
                    if (error) {
                        console.log('Connection error in UserController::addToHistory()', error);
                        return reject(error);
                    }
                    
                    ctx.status = 200;
                    ctx.body = {
                        status: "addToHistory success",
                    };
                    resolve(res);
                } catch (e) {
                    console.log(`Error: ${e}`);
                }
            });
        });
    }
    
    async getFromUserHistory(ctx) {
        console.log(`Getting user history for ${ctx.params.username}`);
        
        const uID = await this.getUserID(ctx.params.username);
        
        return new Promise((resolve, reject) => {
            if (!uID) {
                return reject("Can't get uID.");
            }
            
            const query = `SELECT * FROM UserHistory WHERE userID = ?`;
            dbConnection.query({
                sql: query,
                values: [uID]
            }, async (error, res) => {
                if (error) {
                    console.log('Connection error in UserController::getFromUserHistory()', error);
                    return reject(error);
                }
                
                let restaurants = res.map(async (hist) => {
                    return await RestaurantController.getRestaurantByID(hist.restaurantID);
                });
                
                console.log('restaurants', restaurants);
                resolve(restaurants);
            });
        });
    }
}

module.exports = UserController;
