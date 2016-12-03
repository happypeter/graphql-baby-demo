const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/graphql-baby');
const User = require('./models/user');
mongoose.Promise = global.Promise;


const db = mongoose.connection;
db.once('open', function() {
  const user = new User({name: 'graphql', email: 'xx@xx.com'});
  user.save(function(err){
    if(err) console.log(err);
    console.log('success!');
  })
});


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  pretty: true
}));

app.listen('3000', function() {
  console.log('Your server is running on port 3000');
});
