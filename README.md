tutorme-node
============

The tutorme-node repository contains the server side code backend for the mobile app. It is written using NodeJS, Express, and all the other bits and pieces that come with these frameworks.

## API
The backend uses a simple RESTful API to interact with the server.

### Login
`/login`: POST call that expects an `email` and a `password` parameter. In return, the caller will receive a JSON object with a `status` property which will indicate success or failure. In case of a success, a `token` property will also be included, which should be used in every subsequent request sent to the secured API.
