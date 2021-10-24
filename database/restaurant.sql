USE decidr;

DROP TABLE IF EXISTS Restaurant;

CREATE TABLE Restaurant (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (64) NOT NULL,
    category VARCHAR (32) NOT NULL,
    lat FLOAT NOT NULL DEFAULT 0,
    lng FLOAT NOT NULL DEFAULT 0,
    updated DATE NOT NULL,
    
    #Maybe not the best way to do it.
    monOpen INT,
    monCLose INT,
    tueOpen INT,
    tueCLose INT,
    wedOpen INT,
    wedCLose INT,
    thuOpen INT,
    thuCLose INT,
    friOpen INT,
    friCLose INT,
    satOpen INT,
    satCLose INT,
    sunOpen INT,
    sunCLose INT,
    
    priceLevel INT,
    rating INT,
    
    phoneNumber VARCHAR (16),
    website VARCHAR (64),
    
    CONSTRAINT RestaurantConstraint UNIQUE (id),
    PRIMARY KEY (id)
);

ALTER TABLE Restaurant AUTO_INCREMENT = 1;