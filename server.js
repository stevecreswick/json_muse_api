const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || '3000';
const API_URL = '/api/v1';

// ------------------------
// Middleware
// ------------------------

// Logging
app.use( morgan( 'dev' ) );

// Parse application/json
app.use( bodyParser.json() );

// Parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( cors() );

// ------------------------
// Controllers
// ------------------------

const User = require('./app/models/user.js')

app.post('/signup', User.signup)

// const controller = express.Router();
//
// controller.get(
//   '/',
//   async ( req, res ) => {
//     try {
//       // const rocks = await getRocks();
//       // const serializer = new Serializer( { resource: rocks } );
//       // res.send( serializer.serialize );
//     }
//     catch ( err ) {
//       // console.log( err );
//       // const error = new ToErr( { statusCode: 400 } );
//       // res.send( error.reason );
//     }
//   }
// );

// ------------------------
// Start Server
// ------------------------
app.listen( port, () => {
  console.log( `Application listening on port ${ port }.` );
} );
