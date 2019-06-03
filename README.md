# medium-crawler
Crawl medium.com urls recursively.

Local setup
* make sure node version is > 8.x. To install node version nvm `nvm install 8.x`
* install mongodb | follow this link  https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
* `npm start` to start app in dev env


Dev Setup
* make sure `docker` and `docker-compose` is installed. If now, follow link https://docs.docker.com/install/
* make sure `mongod` service is running `sudo service mongod status` (for ubunutu)
* `npm run app:test` to run
  
Prod setup
* `npm run app:build:up` to build & run node app in prod env
* `npm run app:build`  to build node app image in prod env
* `npm run app:prod` to run node app in prod env 

* NOTE: https://stackoverflow.com/questions/48957195/how-to-fix-docker-got-permission-denied-issue 