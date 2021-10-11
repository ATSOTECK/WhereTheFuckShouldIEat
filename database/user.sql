DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS UserHistory;

CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR (16) NOT NULL,
    password VARCHAR (32) NOT NULL,
    birthday DATE NOT NULL,
    
    CONSTRAINT UserConstraint UNIQUE (id),
    PRIMARY KEY (id)
);

ALTER TABLE User AUTO_INCREMENT = 1000;

CREATE TABLE UserHistory (
    userID INT NOT NULL,
    restaurantID INT NOT NULL,
    
    CONSTRAINT fkUserID FOREIGN KEY (userID)
        REFERENCES User (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkRestaurantID FOREIGN KEY (restaurantID)
        REFERENCES Restaurant (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);