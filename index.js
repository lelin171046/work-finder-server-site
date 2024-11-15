const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const app = express();

const port = process.env.PORT || 8000;


// app.use(cors({
//   origin: ],
//   
 
// }));
const corsOption = {
  Option :['http://localhost:5173', 'https://work-finder-server-site-3uwf5c7wx-moniruzzaman-lelins-projects.vercel.app'],
  credentials: true,
  optionSuccessStatus:200,
}
app.use(cors(corsOption));
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
///Create json web token
app.post('/jwt', async(req, res)=>{
  const user = req.body;
  console.log(user);
  const token = jwt.sign(user, process.env.S_Key, {expiresIn: '365d'})

  res.send({token})
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
      // if(data.min_price > data)j
      
      console.log(data, 'bid data');
      const result = await bidsCollection.insertOne(data);
      res.send(result)
    })


    //post a job

    app.post('/add-job', async(req, res)=>{
      const postJob = req.body;
      // if(data.min_price > data)
      
      console.log(postJob, 'is here');
      const result = await jobCollection.insertOne(postJob);
      res.send(result)
    })

    //my posted jobs list
    app.get('/jobs/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {'buyer.email': email};
      const result = await jobCollection.find(query).toArray();
      res.send(result)
    })

    //delete job post from db
    app.delete('/jobs/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.deleteOne(query)
      res.send(result)
    })

    //Update jobs
    app.put('/update/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id, 'update id');
      const jobData = req.body;
      // console.log(jobData, 'upppppppppppp');
      const query = {_id: new ObjectId(id)};
      const options = {upsert : true}
      const updateDoc = {
        $set : {
          ...jobData
        }
      }
      const result = await jobCollection.updateOne(query, updateDoc, options);
      res.send(result)

    })


     //my bited  jobs list
     app.get('/my-bids/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {email};
      const result = await bidsCollection.find(query).toArray();
      res.send(result)
    })
    
    //my jobs bids request 

     
     app.get('/bids-requests/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {'buyer_email': email};
      const result = await bidsCollection.find(query).toArray();
      res.send(result)
    })


    ///Update job request status
    app.patch('/bid/:id', async (req, res)=>{
      const id = req.params.id;
      const status = req.body;
      const query = {_id: new ObjectId(id)}
      const upDateDoc = {
        $set: status,
      }
      const result = await bidsCollection.updateOne(query,upDateDoc)
      res.send(result)
      console.log('ok', status);
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