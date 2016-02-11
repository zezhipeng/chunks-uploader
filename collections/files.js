/**
 * Created by tf on 2016/1/30.
 */
var mongoose = require("mongoose")
var Promise = require("bluebird");
Promise.promisifyAll(mongoose)
var fileSchema = mongoose.Schema({
    md5:String,
    size:Number,
    createTime:{type:String,default:Date.now},
    type:String,
    ext:String,
    path:String
})

var files = mongoose.model("files",fileSchema)


module.exports = files