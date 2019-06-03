const HOST = process.env.MONGO_HOST;
const prod = {
    MONGO: {
        HOST: 'mongodb+srv://user1:orion123@orion-qm5y7.mongodb.net/medium-urls?retryWrites=true&w=majority',
    }
};
module.exports = prod;