var restify = require('restify');
var fs = require('fs');
var server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.post('/uploadFiles', function(req, resp, next) {
    console.log('starting upload');
    var uploaded_file = req.files.file;
    var oldpath = uploaded_file.path;
    var newpath = 'C:/failai/' + uploaded_file.name;
    fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        resp.write('File uploaded and moved!');
        resp.end();
        console.log('finished upload');
        next();
    });
});
server.listen(8080, function() {
    console.log('Listening on 8080')
});