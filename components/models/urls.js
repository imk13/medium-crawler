/**
 * Medium urls mongoose model definition
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// create a schema
let UrlsSchema = new Schema({
    url: { type: String, required: true },
    md5: { type: String, index: true, required: true, unique: true },
    meta: {},
    created_at: Date,
    updated_at: Date
});

// Before saving doc
UrlsSchema.pre('save', function(next) {
    var currentDate = new Date();
    //console.log(this);
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});
// the schema is useless so far
// we need to create a model using it
let Urls = mongoose.model('Urls', UrlsSchema);

// make this available to our mdeium urls in our applications
module.exports = Urls;