# nodejs-tutorme

The nodejs-tutorme repository contains the server side code backend for the mobile app. It is written using NodeJS, Express, and all the other bits and pieces that come with these frameworks.

## Instructions

In order to run the server, you need to have `node` and `npm` installed on your system. Refer to the nodejs documentation for instructions on how to install nodejs to your system.

Once you have these packages install, change your working directory to the nodejs-tutorme project. Then, run the following:

```sh
$ npm install
```

This will automatically install all the required dependencies that the server software relies on. Once this finished, the server is ready to run. To do so, simply set the executable bit on the `app.js` file and execute like so:

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


## Useful Links

* [nodejs-tutorme API documentation](https://github.com/kocsenc/zakdost-node/wiki/API)
* [node-sqlite3 API documentation](https://github.com/mapbox/node-sqlite3/wiki/API)
