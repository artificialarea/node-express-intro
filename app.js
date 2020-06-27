const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.get('/sum', (req, res) => {

  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if(!a) { 
    return res.status(400).send('Number a is required.')
  }
  if(!b) {
    return res.status(400).send('Number b is required.')
  }

  const c = (a + b).toString();

  const answer = `The sum of ${a} and ${b} is ${c}`;

  res.send(answer);

})

app.get('/cipher', (req, res) => {

  const text = req.query.text.toUpperCase();
  const shift = Math.abs(Number(req.query.shift));

  if (shift > 26) {
    return res.send("Shift must be 26 or less.");
  }
  // const charArray = text.split("");
  const asciiArr = [];

  for(let i=0; i < text.length; i++) {
    asciiArr.push(text[i].charCodeAt(0))
  }

  const shifted = asciiArr.map(i => {
    if(i === 32) {
      return i;
    }

    if((i + shift) > 90) {
      return (i + shift - 91) + 65
    }
    return (i + shift);
  })

  const cipher = String.fromCharCode(...shifted);



  // const asciiArr = charArray.map(i => {
  //   charArray[i].charCodeAt(0);
  // })

  res.send([text, shift, asciiArr, shifted, cipher]);

})

// TEMP PLAYGROUND ////////////////////////

///////////////////////////////////////////

app.get('/video', (req, res) => {
  const video = {
    title: 'Cats falling over',
    description: '15 minutes of hilarious fun as cats fall over',
    length: '15.40'
  }
  res.json(video);
});

///////////////////////////////////////////

app.get('/colors', (req, res) => {
  const colors = [
    {
      name: "red",
      rgb: "FF0000"
    },
    {
      name: "green",
      rgb: "00FF00"
    },
    {
      name: "blue",
      rgb: "0000FF"
    },
  ];
  res.json(colors);

///////////////////////////////////////////

  app.get('/grade', (req, res) => {
    // get the mark from the query
    const { mark } = req.query;

    // do some validation
    if (!mark) {
      // mark is required
      return res
        .status(400)
        .send('Please provide a mark');
    }
    const numericMark = parseFloat(mark);
    if (Number.isNaN(numericMark)) {
      // mark must be a number
      return res
        .status(400)
        .send('Mark must be a numeric value');
    }
    if (numericMark < 0 || numericMark > 100) {
      // mark must be in range 0 to 100
      return res
        .status(400)
        .send('Mark must be in range 0 to 100');
    }
    if (numericMark >= 90) {
      return res.send('A');
    }
    if (numericMark > 80) {
      return res.send('B');
    }
    if (numericMark >= 70) {
      return res.send('C');
    }
    res.send('F');
  });

});


app.listen(8000, () => {
  console.log('Express server is listening to port 8000...')
})