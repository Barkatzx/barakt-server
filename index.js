const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const basicAuth = require('basic-auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8fg5tj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Auth credentials from .env
const allowedUser = process.env.AUTHORISED_USER;
const allowedPass = process.env.AUTHORISED_PASS;

// Basic Auth middleware
function validateBasicAuth(req, res, next) {
  const credentials = basicAuth(req);
  if (!credentials || credentials.name !== allowedUser || credentials.pass !== allowedPass) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

async function run() {
  try {
    const projectCollection = client.db('BarkatDB').collection('project');

    // GET all projects
    app.get('/project', async (req, res) => {
      const cursor = projectCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET a project by ID
    app.get('/project/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectCollection.findOne(query);
      res.send(result);
    });

    // POST a new project with Basic Auth
    app.post('/project', validateBasicAuth, async (req, res) => {
      const newProject = req.body;

      if (newProject.user !== allowedUser) {
        return res.status(403).json({ error: 'You are not authorized to post this project.' });
      }

      const result = await projectCollection.insertOne(newProject);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Error:", err);
  }
}
run().catch(console.dir);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Barkat Ullah Project Server is Running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
