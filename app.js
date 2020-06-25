const express = require('express'); // https://expressjs.com/en/4x/api.html
const morgan = require('morgan');   // https://www.npmjs.com/package/morgan

// calling this function creates an Express app and gives us access to express objects (Application, Request, Response, Router) and their various methods like .use(), .get(), etc. 
const app = express();

// Morgan is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));

// this is the final (express) request handler
app.get('/', (req, res) => {
  res.send(`Hello Express! \n src: 06-25_node-express-intro`);
})


// ASSIGNMENT /////////////////////////////////////////////////

// ASSIGNMENT 1 ///////////////////////////////////////////////
app.get('/sum', (req, res) => {

  const a = req.query.a;
  const b = req.query.b;
  const c = (parseInt(a) + parseInt(b)).toString();

  if(!a) {
    return res.status(400).send('Number a is undefined')
  }
  if(!b) {
    return res.status(400).send('Number b is undefined')
  }

  const answer = `The sum of ${a} and ${b} is ${c}`
  res.send(answer)
})

// ^^ ASSIGNMENT //////////////////////////////////////////////


// setting up (express) server to listen to a specific port
app.listen(8000, () => {
  console.log('Express server is listening on port 8000...')
})