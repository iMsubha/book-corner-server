const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
   res.send('hello world');
})

//database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.id4k2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("bookStore").collection("products");
  console.log("Database connected successfully!");
  
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
    console.log('insertedCount', result.insertedCount);
    //res.send( result.insertedCount > 0)
    res.redirect('/')
    })
  });
   //load data from database
   app.get('/home', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
 })
   app.get('/products', (req, res) => {
    productCollection.find({email:req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount >0)
    })
  })
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})