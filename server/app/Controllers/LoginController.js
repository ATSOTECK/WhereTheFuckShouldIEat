const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');
const UserController = new (require('./UserController.js'))();
const bcrypt = require('bcryptjs');
const util = require('util');
const jwt = require("jsonwebtoken");

require('dotenv').config();

class LoginController {
    async login(ctx, user) {
        return new Promise((resolve, reject) => {
            console.log(`Login request for ${user.username}`);
            if (!(user.username && user.password)) {
                console.log("All information required.");
                ctx.status = 400;
                ctx.body = [];
                return reject("All info needed");
            }
            
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
                        
                        ctx.status = 409;
                        ctx.body = res;
                        resolve(res);
                    } else {
                        console.log(`User ${user.username} already exists.`);
                        
                        const row = await UserController.getUserPassword(user.username);
                        const password = row[0].password;
                        console.log(password);
                        
                        if (await bcrypt.compare(user.password, password)) {
                            console.log("Success login.");
                            
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
                        } else {
                            console.log("Fail login.");
                        }
                    }
                } catch (e) {
                    console.log(`Error: ${e}`);
                }
            });
        });
    }
}

module.exports = LoginController;
