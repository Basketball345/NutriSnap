DROP DATABASE IF EXISTS NutriSnap;
CREATE DATABASE NutriSnap;
USE NutriSnap; 

CREATE TABLE Users (
    --UserId INT NOT NULL AUTO_INCREMENT,
    UserEmail VARCHAR(255),
    PRIMARY KEY(UserEmail)
);

CREATE TABLE Meals (
    UserEmail VARCHAR(255),
    Meal VARCHAR(255),
    Recorded DATETIME
);

CREATE TABLE Day (
    UserEmail VARCHAR(255),
    Calories INT DEFAULT 0,
    Protein INT DEFAULT 0,
    Fat INT DEFAULT 0,
    Carbs INT DEFAULT 0,
    Sugar INT DEFAULT 0,
    Fiber INT DEFAULT 0,
    FOREIGN KEY(UserEmail) REFERENCES Users(UserEmail)
);

CREATE TABLE Week (
    UserEmail VARCHAR(255),
    Calories INT DEFAULT 0,
    Protein INT DEFAULT 0,
    Fat INT DEFAULT 0,
    Carbs INT DEFAULT 0,
    Sugar INT DEFAULT 0,
    Fiber INT DEFAULT 0,
    FOREIGN KEY(UserEmail) REFERENCES Users(UserEmail)
);

CREATE TABLE Month (
    UserEmail VARCHAR(255),
    Calories INT DEFAULT 0,
    Protein INT DEFAULT 0,
    Fat INT DEFAULT 0,
    Carbs INT DEFAULT 0,
    Sugar INT DEFAULT 0,
    Fiber INT DEFAULT 0,
    FOREIGN KEY(UserEmail) REFERENCES Users(UserEmail)
);