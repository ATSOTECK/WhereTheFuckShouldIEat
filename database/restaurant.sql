DROP TABLE IF EXISTS Restaurant;

CREATE TABLE Restaurant (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (64) NOT NULL,
    category VARCHAR (32) NOT NULL,
    lat FLOAT NOT NULL DEFAULT 0,
    long FLOAT NOT NULL DEFAULT 0,
    updated DATE NOT NULL,
    
    CONSTRAINT RestaurantConstraint UNIQUE (id),
    PRIMARY KEY (id)
);

ALTER TABLE Restaurant AUTO_INCREMENT = 1;