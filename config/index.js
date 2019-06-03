const NODE_ENV = process.env.NODE_ENV || 'dev';
const envConfig = require('./' + NODE_ENV + '.js');
let config = {
    env: NODE_ENV
};

// export extended config
module.exports = Object.assign(config, envConfig);