# Eventshuffle backend API
This is an exercise project implementation.
The code is not production ready and is meant to be run locally.

## System requirements

### Node version
Node version used is 14.17.6.

### Docker Desktop
Install Docker Desktop: https://www.docker.com/products/docker-desktop

## Run the API
After the following steps the API responds in: `http://localhost:8081/api/v1/event ...`

Start the database with Docker: 
```
docker run --name eventshuffle-postgres -p 5433:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```
Go to the root of the source code and run the API, it will run in port 8081 by default. In case you need to change 
it just override the value PORT in file .env
```
npm install
npm start
```
To run the tests:
```
npm test
```

## Setting up local environment
Get the Docker Desktop and run the database as instructed in chapter Run the API.

### Database operations
Run the migrations:
```
db-migrate up
db-migrate down
```
Create new migration:
```
db-migrate create <migration_name>
```
This will generate one .js file under `/migrations` and two .sql files for up and down operations under `/migrations/sqls`.
You don't need to make changes to .js file.

Migration filenames prefix with a current timestamp and migrations are ran in chronological order. You should not change filenames.

### Run or debug the server
Install and run server:

```
npm install
npm run start-dev
```

Debug server:
Run the server in debugging mode. You can start debugging for example with IntelliJ selecting configuration 
'Attach to Node.js/Chrome'.
No further modifications needed, just use the frontend in browser as normally.
```
npm install
npm run debug
```
