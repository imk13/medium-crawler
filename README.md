# medium-carwler
Crawl medium.com urls recursively.

Local Setup
* make sure node version is > 8.x. To install node version nvm `nvm install 8.x`
* install mongodb | follow this link  https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
* make sure `mongod` service is running `sudo service mongod status` (for ubunutu)
* `npm install` to install node packages
* `npm start` to run node app in dev env
  
Prod setup
* Export mongodb host `export MONGO_HOST=mongodb+srv://<user>:<password>@<domain>/medium-urls` to connect to prod mongodb;
* `npm run app:prod` to run node app in prod env 