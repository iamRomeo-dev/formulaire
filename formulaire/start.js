require('colors');
const {say} = require('cowsay');

require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

/*Connection à mongoDb grace à mongoose*/
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection
  .on('open', () => {
    console.log('------------------------------'.rainbow);
    console.log('-: Mongoose connection open :-');
    console.log('------------------------------'.rainbow);
  })
  .on('error', (err) => {
    console.log(`-: Connection error: ${err.message} :-`);
  });


/*Connection au server local grace au module express qui se trouve dans app*/
const server = app.listen(process.env.PORT, () => {
      console.log(say({ text: 'Running on port 3000'.bgBrightYellow.gray }));
});
