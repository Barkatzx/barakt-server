const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env. PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8fg5tj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    //   await client.connect();
    const blogsCollection = client.db('BarkatDB').collection('blogs');
    const projectCollection = client.db('BarkatDB').collection('project')

    app.get('/blogs', async (req, res) => {
      const cursor = blogsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.get('/blogs/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await blogsCollection.findOne(query);
      res.send(result);
  })

  app.post('/blogs', async (req, res) => {
      const newBlogs = req.body;
      console.log(newBlogs);
      const result = await blogsCollection.insertOne(newBlogs);
      res.send(result);
  })

  // Project Details

  
  app.get('/project', async (req, res) => {
    const cursor = projectCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  app.get('/project/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await projectCollection.findOne(query);
    res.send(result);
  })

  app.post('/project', async (req, res) => {
    const newProject = req.body;
    console.log(newProject);
    const result = await projectCollection.insertOne(newProject);
    res.send(result);
  })
    // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) => {
    res.send('Barkat Ullah Server is Running');
  });
  
  app.listen(port, () => {
    console.log(`Barkat Ullah Server Running on port ${port}`);
  });