
---

# Product-service

A simple REST API Server for managing perishable inventory.

## Features

- A lot of an item can be added.
- A quantity of an can be sold and the inventory reduced on the DB.
- The Non-expired quantity of a specific item can be viewed.
- The system handles concurrency scenarios relating to selling an item.
- The system periodically (every one hour) removes expired product from the DB.



## Getting Started

To get a copy of this project up and running on your local machine for testing and development, you would need to have a minimum of the underlisted prerequisities installed on your local machine. 

### Prerequisites

You must have

1. [Node.js](https://nodejs.org/) (_v8.12.0 or higher_) and npm (_6.4.1 or higher_) installed on your local machine. Run `node -v` and `npm -v` in your terminal to confirm that you have them installed

2. GIT bash

### Installing

To get started, clone this repository on your local machine using the following steps:

Open your terminal and navigate to the folder you want the project to be and enter the the following commands:

```
$ cd products
$ npm install
```

Create a `.env` file and add the environment variables described in the .env.sample file. Below are the relevant environment variables worth adding:

- `DATABASE_LOGGING` - Can be true, yes or false. It determine whether the DB queries would be visible on the log.
- `PORT` - This is the port that the server would be available to accept requests.
- `NODE_ENV` - The environment or mode the server is running (test, development or production).
- `PGDATABASE` - The name of the database.
- `PGPORT` - The port of the database.
- `PGUSER` - The user name for accessing the database.
- `PGPASSWORD` - The password of the database user.
- `LOG_LEVEL` - The application log level, it determines what shows up on the logs. The default level if not set is debug.
- `LOG_TO_FILE` - Can be true or false. It determines whether the application log would be written to a file. It is false by default.

* Please note that with the exception of `PORT`, `NODE_ENV` and `LOG_TO_FILE` all the above environment variables most be prefixed with `TEST_` and `DEV_` in test and development mode for the application to work properly. Have a look at the `.env-sample` file for more details.

## Starting the dev server

```bash
npm run start:dev
```

## Running the tests locally

```bash
npm test
```

## Test the endpoints

The application can be tested locally through localhost on port 3000 or through the live [url](https://products-v1.herokuapp.com/) using postman or insomnia


### API Endpoints


Method        | Endpoint      | Enable a user to: |
------------- | ------------- | ---------------
POST  | /:item/add  | Add a lot of :item to the system  |
POST  | /:item/sell  | sell a quantity of an item and reduce its inventory from the database. |
GET  | /:item/quantity  | get non-expired quantity of the item from the system |


## Technologies

- Node JS
- Express
- Postgres
- Mocha & Chai
- ESLint
- Typescript
- Webpack

## API

The API is currently in version 1 (v1) and it is hosted on heroku at [Base URL](https://products-v1.herokuapp.com/)

## API Documentation

You can find the documentation here [API DOCS]https://products-v1.herokuapp.com/api-docs)
For best results, I recommend testing via the API DOCS

## Author

- **Oloruntobi Awoderu**
