var MongoClient = require('mongodb').MongoClient;
var restify = require('restify');
var crypto = require('crypto');

/**
 * Calculates the MD5 hash of a string.
 *
 * @param  {String} string - The string (or buffer).
 * @return {String}        - The MD5 hash.
 */
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

var url = 'mongodb://localhost:27017';

var collections = {
    values: {
        id: 'values'
    },
    people: {
        id: 'people',
        name: 'name',
        weight: '',
        height: '',
        bmi: '',
    }
};

function connect(callback) {
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("juodrastis");
        callback(dbo, client);
    });
}

function add(obj, collection) {
   connect(function(dbo, client) {
       dbo.collection(collection).insertOne(obj, function(err, res) {
           if (err) throw err;
           console.log("1 document inserted");
           client.close();
       });
   });
}

function get(collection, callback) {
    connect(function(dbo, client) {
        dbo.collection(collection).find({}).toArray(function(err, result) {
            if (err) throw err;
            client.close();
            callback(result);
        });
    });
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.get('/values', function(req, resp, next) {
    get(collections.values.id, function(data) {
        resp.send(data);
        next();
    });

});

server.post('/values', function(req, resp, next) {
    let body = req.body;
    let counter = 0;
    try {
        for (let i = 0; i < body.length; i++) {
            add(body[i], collections.values.id);
            counter++;
        }
    } catch (err) {
        console.log(err);
    }

    resp.end('Items inserted: ' + counter);
    next();
});





server.listen(8080, function() {
    console.log('Listening on 8080');
});



