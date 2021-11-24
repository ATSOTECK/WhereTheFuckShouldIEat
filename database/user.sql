USE decidr;

DROP TABLE IF EXISTS UserHistory;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR (64) UNIQUE NOT NULL,
    password VARCHAR (128) NOT NULL,
    firstName VARCHAR (32) NOT NULL,
    lastName VARCHAR (32) NOT NULL,
    birthday DATE NOT NULL,
    
    CONSTRAINT UserConstraint UNIQUE (id),
    PRIMARY KEY (id)
);

ALTER TABLE User AUTO_INCREMENT = 1000;

CREATE TABLE UserHistory (
    userID INT NOT NULL,
    restaurantID INT NOT NULL,
    dateAdded DATE NOT NULL,
    
    CONSTRAINT fkUserID FOREIGN KEY (userID)
        REFERENCES User (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkRestaurantID FOREIGN KEY (restaurantID)
        REFERENCES Restaurant (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);