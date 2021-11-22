const dbConnection = require('../../database/mySQLconnect');
const util = require('util');

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
                            (place_id, name, lat, lng) VALUES
                            (?, ?, ?, ?)
                        `;
                        
                        dbQuery({
                            sql: query,
                            values: [restaurant.place_id, restaurant.name, restaurant.lat, restaurant.lng]
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
}

module.exports = RestaurantController;
