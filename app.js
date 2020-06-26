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

// per thinkful solution/approach
// src: https://github.com/Thinkful-Ed/express_drills/blob/master/app.js


///////////////////////////////////////////////////////////////
// ASSIGNMENT 1 ///////////////////////////////////////////////
// SUM          ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////

app.get('/sum', (req, res) => {

  const { a, b } = req.query;
  
  // VALIDATE: EXISTENCE
  if(!a) {
    return res.status(400).send('a is required');
  }
  if(!b) {
    return res.status(400).send('b is required');
  }

  // VALIDATE: TYPE
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if(Number.isNaN(numA)) {
    return res.status(400).send('a must be a number');
  }
  if(Number.isNaN(numB)) {
    return res.status(400).send('b must be a number');
  }

  // validation passed so perform task
  const c = numA + numB;
  const answer = `The sum of ${a} and ${b} is ${c}`;

  res.status(200).send(answer);
});

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
  const { text, shift } = req.query;

  // 01. VALIDATION: Existence, Type, (and Range?)
  if(!text) {
    return res.status(400).send('text is required');
  }
  if(!shift) {
    return res.status(400).send('cipher shift is required');
  }
  
  const numShift = parseFloat(Math.abs(shift));
  if (Number.isNaN(numShift)) {
    return res.status(400).send('cipher shift must be a number')
  }

  // all valid, perform the task...

  // Make the text uppercase for convenience.
  // The question did not say what to do with punctuation marks and numbers so we will ignore them and only convert letters.
  // Also just the 26 letters of the english alphabet.
  // Also didn't specify if can shift DOWN the alphabet, so for convenience will disregard and convert any downward shift (negative) numbers to absolute numbers, so the decipher will always be shifting UP the alphabet.
  // Create a loop over the characters, for each letter, convert using the shift

  const base = 'A'.charCodeAt(0); // get char code: 65

  // schweet method chaining!!
  const cipher = text
    .toUpperCase()
    .split('') 
    .map(char => {
      const code = char.charCodeAt(0); // get char code

      // if it is not one of the 26 letters, ignore it
      // A:65, ... , Z:90
      if(code < base || code > (base + 25)) { 
        return char;
      }

      // otherwise convet it 
      // to get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past char code for Z (90),
      // cycle back to the beginning with per the modulo/modulus operator (ingenious, that!)
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(''); // construct a String from the array

  res
    .status(200)
    .send(cipher);
});

///////////////////////////////////////////////////////////////
// ASSIGNMENT 3 ///////////////////////////////////////////////
// LOTTO  /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// completely different approach to mine in 'pre-pair' branch

app.get('/lotto', (req, res) => {

  // const { numbers } = req.query; // note: doesn't specific query object by name 'req.query.arr' (?) presumably because that is the only type of query being done (?) ... all that said, doesn't even work?!?!
  // ergo
  const numbers = req.query.arr;


  // VALIDATION: 
  // 1. EXISTENCE: the numbers array must exist
  // 2. TYPE: must be an array 
  // 3. RANGE: must be 6 numbers
  // 4. RANGE: numbers must be between 1 and 20

  if(!numbers) {
    return res
      .status(400)
      .send('Numbers are required');
  }

  if(!Array.isArray(numbers)) {
    return res
      .status(400)
      .send('numbers must be an array');
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >- 1 && n <=20));

  if(guesses.length != 6) {
    return res  
      .status(400)
      .send('numbers must contain 6 integers between 1 and 20');
  }
  // ^^^ diff from my if(!numbers.every(checkNum)) approach
  // no sure which approach I prefer

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
  // ^^ NOTE use of unusual .fill() method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
  
  // randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  // compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  // with switch instead of if statements! (much more elegant)
  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:   
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';  
  }

  // uncomment below to see how the results ran

  res.json({
    guesses,
    stockNumbers,
    winningNumbers,
    diff,
    responseText
  });

  res.send(responseText);

});

// ^^ ASSIGNMENTS //////////////////////////////////////////////


// setting up (express) server to listen to a specific port
app.listen(8000, () => {
  console.log('Express server is listening on port 8000...')
});