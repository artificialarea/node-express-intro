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
// SUM

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


// ASSIGNMENT 2 ///////////////////////////////////////////////
// Caesar Cipher https://privacycanada.net/classical-encryption/caesar-cipher/

// Hints:

//// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode

//// ASCII (UTF-16) Table: https://asecuritysite.com/coding/asc2 (A:65 -- Z:90)

// 4 Ways to Convert String to Character Array in JavaScript
// https://www.samanthaming.com/tidbits/83-4-ways-to-convert-string-to-character-array/


app.get('/cipher', (req, res) => {

  const plaintext = req.query.text.toUpperCase();
  const shift = parseInt(req.query.shift);

  // const plaintext = process.argv[2].toUpperCase();
  // const shift = parseInt(process.argv[3]);

  // 1. convert plaintext to ascii array
  const asciiArr = [];
  for (var i = 0; i < plaintext.length; i ++) {
    asciiArr.push(plaintext[i].charCodeAt(0));
  }

  // 2. 
  const asciiArrShift = asciiArr.map(char => {
    // conditional to reposition charCode if shift reaches end of alphabet on either side. It's ugly but it works
    if (char + shift > 90) {
      return (char + shift - 91) + 65
    } else if (char + shift < 65) {
      return (char + shift) + 26
    } else {
      return char + shift
    } 
  })

  const ciphertext = String.fromCharCode(...asciiArrShift)

  res.send([
    `plaintext: ${plaintext}`, 
    // shift, 
    // asciiArr, 
    // asciiArrShift, 
    `ciphertext: ${ciphertext}`
  ]);

})


// ^^ ASSIGNMENT //////////////////////////////////////////////


// setting up (express) server to listen to a specific port
app.listen(8000, () => {
  console.log('Express server is listening on port 8000...')
})