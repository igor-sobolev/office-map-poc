## POC for office building plans

## Run locally

1. Run in root folder `npm run install:all`
2. Run server `cd server && npm run dev`
3. Run client `cd client && npm start`

**Note: may be helpful if you get errors installing sharp (server)**
```
apt-get update && apt-get install -y libvips-dev --no-install-recommends
```

## Run in docker

1. Install `docker` and `docker-compose`
2. Run in root folder `docker-compose up`