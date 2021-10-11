DROP TABLE IF EXISTS Restaurant;

CREATE TABLE Restaurant (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (64) NOT NULL,
    category VARCHAR (32) NOT NULL,
    lat FLOAT NOT NULL DEFAULT 0,
    lng FLOAT NOT NULL DEFAULT 0,
    updated DATE NOT NULL,
    
    --Maybe not the best way to do it.
    monOpen INT NOT,
    monCLose INT NOT,
    tueOpen INT NOT,
    tueCLose INT NOT,
    wedOpen INT NOT,
    wedCLose INT NOT,
    thuOpen INT NOT,
    thuCLose INT NOT,
    friOpen INT NOT,
    friCLose INT NOT,
    satOpen INT NOT,
    satCLose INT NOT,
    sunOpen INT NOT,
    sunCLose INT NOT,
    
    priceLevel INT,
    rating INT,
    
    phoneNumber VARCHAR (16),
    website VARCHAR (64),
    
    CONSTRAINT RestaurantConstraint UNIQUE (id),
    PRIMARY KEY (id)
);

ALTER TABLE Restaurant AUTO_INCREMENT = 1;