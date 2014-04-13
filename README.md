# nodejs-tutorme

The nodejs-tutorme repository contains the server side code backend for the mobile app. It is written using NodeJS, Express, and all the other bits and pieces that come with these frameworks.

## Instructions

In order to run the server, you need to have `node` and `npm` installed on your system. Refer to the nodejs documentation for instructions on how to install nodejs to your system.

Once you have these packages install, change your working directory to the nodejs-tutorme project. Then, run the following:

```sh
$ npm install
```

This will automatically install all the required dependencies that the server software relies on. Next, configure the server by editing `config.js`. The key areas are the `mode` setting, `ssl` object, and `db` object (both of which are enclosed inside the `environment` object. Refer to the sample `config.json` (called `config.json.sample`) included in the package.

Once you have setup the configuration, the server is ready to run. Now, simply set the executable bit on the `app.js` file and execute like so:

```sh
$ ./app.js
```

Alternatively, you may simply run:

```sh
$ node app.js
```

If you wish to edit the server as it runs and have it immediately reload the new changes, consider using the `nodemon` package:

```sh
$ npm install nodemon
$ nodemon app.js
```

If you have nodejs-tutorme installed system-wide, then use systemd to start the server:

```sh
# systemctl start nodejs-tutorme
```
**Note: The systemd service file is set to run in production mode by default.**

## Generating SSL Certificate

To generate a self-signed certificate to use in conjunction with the server, run the following inside a directory called `ssl` within the project folder (or modify `config.js` to point to the key and certificate).

```sh
$ openssl req -nodes -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```

This will generate a key and certificate, called `key.pem` and `cert.pem`, respectively. The certificate is set to expire after 365 days and no password is required for the key (remove the `-nodes` parameter to change this behavior).

## Useful Links

* [nodejs-tutorme API documentation](https://github.com/kocsenc/zakdost-node/wiki/API)
* [Sequelize API documentation](http://sequelizejs.com/docs/latest/installation)
