var Promise = require("bluebird")
var _ = require("lodash")
var fs = require("fs")
module.exports = {
    filter: function (req, res) {
        if (req.session.fileName == req.query.fileName) {
            var c = _.filter(req.session.stack, _.matches(req.query.chunk))
            return c
        }
        else {
            req.session.stack = []
            req.session.fileName = req.query.fileName
            return this.filter(req, res)
        }
    },
    resume: function (file, body, req, res) {
        var chunk = _.merge(file, body)
        chunk.md5 = req.session.md5
        var stack = req.session.stack
        stack.push(chunk)
        res.json({err: null})
        if (stack.length == chunk.chunks) {
            this.merge(stack)
        }
    },
    merge: function (stack) {
            var path = process.cwd() + "/public/files/"
            var ws = fs.createWriteStream(path + stack[0].md5 + "." + stack[0].extension)
            function todo(){
                return new Promise(function(resolve,reject){

                        var chunk = stack.shift()
                        var rs = fs.createReadStream(chunk.path)
                        rs.pipe(ws, {end: false})
                        rs.on("end", function () {
                            resolve()
                        })

                }).then(function(){
                        if(stack.length) return todo()
                        else ws.end("Done")
                    })
            }
        todo().then(function(){
           console.log("done")
        })
    }
}
