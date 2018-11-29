var MongoClient = require('mongodb').MongoClient;
var restify = require('restify');
var crypto = require('crypto');
var corsMiddleware = require('restify-cors-middleware');
var mongo = require('mongodb');


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
    values: 'values',
    people: 'people'
};

function connect(callback) {
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("");
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

function put(_id, newObj, collection, callback) {
    connect(function(dbo, client) {
        return dbo.collection(collection).update(
            {"_id": new mongo.ObjectID(_id)},
            newObj,
            function(err, result) {
                if (err) throw err;
                callback();
                client.close();
            }
        );
    });
}
function del(ids, collection, callback) {
    connect(function(dbo, client) {

        dbo.collection("people").deleteOne({_id: new mongo.ObjectID(_id)}, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            callback();
            client.close();
        });
    });
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var cors = corsMiddleware({
    origins: ['*']
});
server.use(cors.actual);
server.opts(/.*/, function(req, res, next) {
    res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.send(200);
    return next();
});


server.get('/api/people', function(req, resp, next) {
    try {
        get(collections.people, function (result) {
            console.log(result);
            resp.send(result);
            next();
        });
    } catch (err) {
        console.log(err);
    }
});
server.post('/api/people', function(req, resp, next) {
    let body = req.body;

    let counter = 0;
    try {
        add(body, collections.people);
        counter++;
    } catch (err) {
        console.log(err);
    }

    resp.end('items added: ' + counter);
    next();
});
server.put('/api/people/:id', function(req, resp, next) {
    let _id = req.params.id;
    let body = JSON.parse(req.body);

    let counter = 0;
    try {
        put(_id, body, collections.people, function() {
            counter++;
            resp.end('items updated: ' + counter);
            next();
        });

    } catch (err) {
        console.log(err);
    }
});
server.del('/api/people', function(req, resp, next) {
    let ids = req.body;

    try {
        del(ids, collections.people, function() {
            resp.send('');
            next();
        });
    } catch (err) {
        console.log(err);
    }

});

server.listen(8080, function() {
    console.log('Listening on 8080');
});