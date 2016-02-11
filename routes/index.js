var express = require('express')
var _ = require("lodash")
var collections = require("../collections")
var fs = require("fs")
var Promise = require("bluebird")
var router = express.Router()
var fn = require("../upload")

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get("/files/chunk", function (req, res) {
    if(req.session.md5) {
      var f =  fn.filter(req, res)
      f.length?res.json({err:"skip"}):res.json({err:null})
    }
    else res.send("error")
})
router.get("/files/md5/:md5",function(req,res){
    var q = req.params
    collections
        .files
        .findOne(q)
        .exec()
        .then(function(cb){
            if(cb) res.json({err:"exit",cb:cb})
            else{
                req.session.md5=q.md5
                res.json({err:null})
            }
        })
})
router.post("/files", function (req, res) {
    var body = req.body
    var file = req.files.file
    if(file&&body) fn.resume(file,body,req,res)
    else res.send("error")
})


module.exports = router;
