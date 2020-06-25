const express = require('express');
const morgan = require('morgan');

// calling this function creates an Express app and gives us access to express objects (Application, Request, Response, Router) and their various methods like .use(), .get(), etc.
const app = express();

// Morgan is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));

// this is the final (express) request handler
app.get('/', (req, res) => {
  res.send(`Hello Express! \n src: 06-25_node-express-intro`);
})

// setting up (express) server to listen to a specific port, in this case 8000
app.listen(8000, () => {
  console.log('Express server is listening on port 8000...')
})