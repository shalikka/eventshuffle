## System requirements

### Node version
Node version used is 14.17.6.

### Docker Desktop
Install Docker Desktop: https://www.docker.com/products/docker-desktop

## Run the API
Start the database with Docker: 
```
docker run --name eventshuffle-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres

```

## Setting up local environment
Get the Docker Desktop and run the database.

### Run the migrations
Run the migrations:
```
db-migrate up
db-migrate down
```
