/**
 * Medium url query parms mongoose model definition
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// create a schema
let urlParamsSchema = new Schema({
    url: { type: ObjectId, ref: 'Url' },
    md5: { type: String, unique: true, required: true },
    meta: {
        href: { type: String }
    },
    params: [{ type: String }],
    values: [{ type: String }],
    created_at: Date,
    updated_at: Date
});

// Before saving doc
urlParamsSchema.pre('save', function(next) {
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
let Params = mongoose.model('params', urlParamsSchema);

// make this available to our mdeium urls in our applications
module.exports = Params;