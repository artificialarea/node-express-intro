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


// ASSIGNMENTS ////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
// ASSIGNMENT 1 ///////////////////////////////////////////////
// SUM          ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////

app.get('/sum', (req, res) => {

  const a = Number(req.query.a);
  const b = Number(req.query.b);
  
  if(!a) {
    return res.status(400).send('Number a is undefined');
  }
  if(!b) {
    return res.status(400).send('Number b is undefined');
  }

  const c = (a + b).toString();
  const answer = `The sum of ${a} and ${b} is ${c}`;
  res.send(answer);
})

///////////////////////////////////////////////////////////////
// ASSIGNMENT 2 ///////////////////////////////////////////////
// CIPHER TEXT  ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// GUIDES:

// Caesar Cipher: 
// https://privacycanada.net/classical-encryption/caesar-cipher/

// See MDN for: 
// String.fromCharCode()
// String.prototype.charCodeAt()

// ASCII (UTF-16) Table: 
// https://asecuritysite.com/coding/asc2 (A:65 -- Z:90)

// 4 Ways to Convert String to Character Array in JavaScript:
// https://www.samanthaming.com/tidbits/83-4-ways-to-convert-string-to-character-array/


app.get('/cipher', (req, res) => {

  // 00. client request: query parameters / arguments
  const plaintext = req.query.text;
  const shift = Number(req.query.shift);

  // args for debugging...
  // const plaintext = process.argv[2].toUpperCase();
  // const shift = parseInt(process.argv[3]);

  // 01. Validation: Existence, Type, Range.
  if(!plaintext) {
    return res.status(400).send('Text is undefined');
  }
  if(!shift) {
    return res.status(400).send('Cipher Shift is undefined');
  }

  // 02. convert plaintext to ascii array
  const asciiArr = [];
  for (var i = 0; i < plaintext.length; i ++) {
    asciiArr.push((plaintext[i]).toUpperCase().charCodeAt(0));
  }

  // 03. perform shift of ascii charcodes
  const asciiArrShift = asciiArr.map(char => {
    // if encounters a '%20' [space]
    if (char === 32) { 
      return 32
    } 
    // conditional to reposition charCode if shift reaches end of alphabet on either side. It's ugly but it works
    if (char + shift > 90) {
      return (char + shift - 91) + 65
    } 
    if (char + shift < 65) {
      return (char + shift) + 26
    } 
    return char + shift
  })

  // 04. convert (shifted) asciicode array back into string
  const ciphertext = String.fromCharCode(...asciiArrShift)

  // 05. http response
  res.send(`plaintext: "${plaintext}" converted to ciphertext: "${ciphertext}".`);

  // res.send([
  //   plaintext, 
  //   shift, 
  //   asciiArr, 
  //   asciiArrShift, 
  //   ciphertext
  // ]);

})

///////////////////////////////////////////////////////////////
// ASSIGNMENT 3 ///////////////////////////////////////////////
// LOTTO  /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

app.get('/lotto', (req, res) => {

  const numbers = req.query.arr;
  // const numbers = Number(req.query.arr); 
  // ^^^^ doesn't work, ergo
  // convert array items in numbers
  // from strings to numbers
  const numbersAsNums = numbers.map(Number);


  // 01 VALIDATION
  if (!numbers || numbers.length !== 6) {
    return res.status(400).send('Sorry, but you need to submit six numbers to play lotto!');
  }

  function checkNum(num) {
    return (num <= 20 && num != 0);
  }
  if (!numbers.every(checkNum)) {
    return res.status(400).send('Sorry, but your numbers need to be between 1 and 20.');
  }


  // 02 GENERATE RANDOM SET OF LOTTO NUMBERS
  function randomRange(myMin, myMax, num) {
    const lotto = [];
    for (let i = 1; i <= num; i++) {
      lotto.push(Math.floor(Math.random() * (myMax - myMin + 1) + myMin));
    }
    return lotto;
  }

  const lotto = randomRange(1, 20, 6)


  // 03 COMPARE USER NUMBERS WITH LOTTO NUMBERS 
  // FOR NUMBER OF (NON-SEQUENTIAL) MATCHES

  const matches = lotto.filter(value => {
    return numbersAsNums.includes(value);
  })

  const response = (matches) => {
    if (matches.length === 0) {
      return `Sorry, you lose. No matched numbers.`;
    }
    if (matches.length < 4) {
      return `Sorry, you lose. You only matched ${matches.length} numbers.`;
    } else if (matches.length === 4) {
      return "Congratulations, you matched 4 numbers and win a free ticket!"
    } else if (matches.length === 5) {
      return "Congratulations, you matched 5 numbers and win $100!"
    } else {
      return "Oh. My. Gawd. Unbelieveable! You matched all 6 numbers and win mega millions!"
    }
  }

  res.send(`
    ${response(matches)} 
    \n Lotto: ${lotto}
    \n You: ${numbers}
  `);
  // res.send([response(matches), matches, lotto, numbersAsNums, numbers])
})

// ^^ ASSIGNMENTS //////////////////////////////////////////////


// setting up (express) server to listen to a specific port
app.listen(8000, () => {
  console.log('Express server is listening on port 8000...')
})