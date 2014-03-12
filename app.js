var express = require('express');
var crypto = require('crypto');
var sqlite3 = require('sqlite3');
var app = express();

// Set a few internal variables
app.configure(function() {
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(app.router);
});

app.configure('development', function() {
    app.enable('debug');
    app.set('db', new sqlite3.Database(__dirname + '/dev.db'));
});

app.configure('production', function() {
    app.disable('debug');
    app.set('db', new sqlite3.Database(__dirname + '/prod.db'));
});

// Set API Security
app.all('/api/*', function(req, res, next) {
    app.get('db').each("SELECT TOKEN AS token FROM USERS WHERE EMAIL='" + req.body.email + "' LIMIT 1;", function(err, row) {
        if (app.enabled('debug')) {
            console.log("*** Auth Attempt ***");
            console.log("** SELECT TOKEN AS token FROM USERS WHERE EMAIL='" + req.body.email + "' LIMIT 1;");
            console.log("* Received token: " + req.body.token + ", Retrieved Token: " + row.token + " Match? " + (req.body.token == row.token).toString());
        }

        // No token set means user is not logged in
        if (!row.token || (req.body.token != row.token)) {
            res.send({ 'status': 'ERROR', 'message': 'Token mismatch: ' + req.body.token });
            return;
        } else {
            next();
        }
    });
});

// Login to system
app.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.send({ 'status': 'ERROR', 'message': 'Invalid parameters.' });
    }

    app.get('db').all("SELECT EMAIL AS email, PASSWORD AS password, SALT AS salt from USERS WHERE EMAIL = '" + req.body.email + "' LIMIT 1;", function(err, rows) {
        if (!rows[0]) {
            res.send({ 'status': 'ERROR', 'message': 'Oops, that user doesn\'t exist yet.' });
            return;
        }

        var row = rows[0];
        var tmpHash = crypto.createHash('sha256').update(req.body.password + "." + row.salt).digest('base64');

        if (app.enabled('debug')) {
            console.log("*** Login Attempt ***");
            console.log("** SELECT EMAIL AS email, PASSWORD AS password, SALT AS salt from USERS WHERE EMAIL = '" + req.body.email + "' LIMIT 1;");
            console.log("* Calculated hash: " + tmpHash + ", DB Hash: " + row.password + ", Match? " + (row.password == tmpHash).toString());
        }
        
        if (row.password == tmpHash) {
            var tmpToken = '';
            crypto.randomBytes(24, function(ex, buf) {
                tmpToken = buf.toString('hex');
                
                app.get('db').run("UPDATE USERS SET TOKEN='" + tmpToken + "' WHERE EMAIL = '" + req.body.email + "';");
                if (app.enabled('debug')) {
                    console.log("** UPDATE USERS SET TOKEN = '" + tmpToken + "' WHERE EMAIL = '" + req.body.email + "';");
                }

                res.send({ 'status': 'SUCCESS', 'token': tmpToken });
            });
        } else {
            res.send({ 'status': 'ERROR', 'message': 'Email and/or password may be incorrect.' });
        }
    });
});

// Logout of system
app.post('/api/logout', function(req, res, next) {
    app.get('db').run("UPDATE USERS SET TOKEN='' WHERE EMAIL = '" + req.body.email + "';");
    if (app.enabled('debug')) {
        console.log("*** Logout Attempt ***");
        console.log("** UPDATE USERS SET TOKEN='' WHERE EMAIL = '" + req.body.email + "';");
    }

    res.send({ 'status': 'SUCCESS' });
});

app.post('/api/changePassword', function(req, res, next) {
    app.get('db')
});

// Register
// TODO: Check for existing user
app.post('/register', function(req, res, next) {
    if (!req.body.type || !req.body.email || !req.body.password || !req.body.postal) {
        res.send({ 'status': 'ERROR', 'message': 'Invalid parameters.' });
    } else {
        crypto.randomBytes(12, function(ex, buf) {
            app.get('db').run("INSERT INTO USERS (TYPE, EMAIL, PASSWORD, SALT, POSTAL, TOKEN) VALUES($type, $email, $password, $salt, $postal, $token)", {
                $type: req.body.type,
                $email: req.body.email,
                $password: crypto.createHash('sha256').update(req.body.password + "." + buf.toString('hex')).digest('base64'),
                $salt: buf.toString('hex'),
                $postal: req.body.postal,
                $token: ''
            });

            if (app.enabled('debug')) {
                console.log("*** Register Attempt ***");
            }

            res.send({ 'status': 'SUCCESS' });
        });
    }
});

// Now, start the server.
var server = app.listen(3000, function() {
    if (app.enabled('debug')) {
        console.log('***** RUNNING IN DEBUG MODE *****');
    } else {
        console.log('***** RUNNING IN PRODUCTION MODE *****');
    }

    console.log('Listening on port %d', server.address().port);
});

