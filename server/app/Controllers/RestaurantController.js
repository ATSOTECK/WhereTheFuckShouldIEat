const dbConnection = require('../../database/mySQLconnect');
const util = require('util');
const { resolve } = require('path');

const dbQuery = util.promisify(dbConnection.query).bind(dbConnection);

class RestaurantController {
    constructor() {
        console.log('RestaurantController constructor.');
    }
    
    async newRestaurant(ctx, restaurant) {
        //console.log(`New restaurant ${restaurant.name}.`);
        
        return new Promise((resolve, reject) => {
            if (!(restaurant.name && restaurant.lat && restaurant.lng)) {
                console.log("All information required.");
                ctx.status = 400;
                ctx.body = [];
                return reject("All info needed.");
            }
            
            //Check if the restaurant exists already.
            dbConnection.query({
                sql: `SELECT place_id FROM Restaurant WHERE place_id = ?`,
                values: [restaurant.place_id]
            }, async (err, res) => {
                try {
                    if (err) {
                        console.log('Connection error in RestaurantController::newRestaurant()', error);
                        ctx.body = [];
                        ctx.status = 200;
                        return reject(err);
                    }
                    
                    if (res.length === 0) {
                        console.log(`Restaurant ${restaurant.name} does not exist.`);
                        console.log(`Adding restaurant ${restaurant.name}`);
                        
                        //Add the restaurant if it doen't exist.
                        const query = `
                            INSERT INTO Restaurant
                            (place_id, name, lat, lng, photoRef, address) VALUES
                            (?, ?, ?, ?, ?, ?)
                        `;
                        
                        dbQuery({
                            sql: query,
                            values: [restaurant.place_id, restaurant.name, restaurant.lat, restaurant.lng, restaurant.photoRef, restaurant.address]
                        }, (err, res) => {
                            try {
                                if (err) {
                                    reject(err);
                                }
                            
                                ctx.status = 200;
                                ctx.body = {
                                    status: "success",
                                };
                                resolve(res);
                            } catch (e) {
                                console.log(`Error: ${e}`);
                            }
                        });
                    } else {
                        console.log(`Restaurant ${restaurant.name} already exists.`);
                        
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
    async getRestaurantID(place_id) {
        console.log(`Getting restaurantID for ${place_id}`);
        return new Promise((resolve, reject) => {
            const query = `SELECT id FROM Restaurant WHERE place_id = ?`;
            
            dbConnection.query({
                sql: query,
                values: [place_id]
            }, (error, tuples) => {
                if (error) {
                    console.log('Connection error in RestaurantController::getRestaurantID()', error);
                    return reject(error);
                }
                
                return resolve(tuples[0].id);
            });
        }).catch((err) => {
            console.log('Database connection error', err);
        });
    }
    
    async getRestaurantByID(rID) {
        console.log(`Getting restaurant for ${rID}`);
        return new Promise((resolve, reject) => {
            const query = `SELECT place_id, name, lat, lng, photoRef, address FROM Restaurant WHERE id = ?`;
            
            dbConnection.query({
                sql: query,
                values: [rID]
            }, (error, tuples) => {
                if (error) {
                    console.log('Connection error in RestaurantController::getRestaurantByID()', error);
                    return reject(error);
                }
                
                return resolve(tuples[0]);
            });
        }).catch((err) => {
            console.log('Database connection error', err);
        });
    }
}

module.exports = RestaurantController;
