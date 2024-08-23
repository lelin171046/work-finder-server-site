const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 8000;


app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200

}))

app.use(express.json());




const uri = `mongodb+srv://workFinder:${process.env.DB_PASS}@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const jobCollection = client.db('workFinder').collection('jobs');
    const bidsCollection = client.db('workFinder').collection('bids');
    app.get('/jobs', async(req, res)=>{
      const result = await jobCollection.find().toArray();
      res.send(result)
    })

    //job by id
    app.get('/job/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.findOne(query) ;
      // console.log(result);
      res.send(result) 
    })

    //bid data story

    app.post('/bid', async(req, res)=>{
      const data = req.body;
      // if(data.min_price > data)
      
      console.log(data);
      const result = await bidsCollection.insertOne(data);
      res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('ok')
})
app.listen(port, ()=> console.log(`port is running on: ${port}`))