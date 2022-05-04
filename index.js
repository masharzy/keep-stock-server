const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ome4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const stockCollection = client.db("groceryStock").collection("items");

    // get all items
    app.get("/items", async (req, res) => {
      const find = stockCollection.find({});
      const result = await find.toArray();
      res.send(result);
    });

    // get item by id
    app.get("/item/:id", async (req, res) => {
      const find = stockCollection.findOne({ _id: ObjectId(req.params.id) });
      const result = await find;
      res.send(result);
    });

    // post a new item
    app.post("/items", async (req, res) => {
      const doc = req.body;
      const result = await stockCollection.insertOne(doc);
      res.send(result);
    });

    // update a existing item
    app.put("/item/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await stockCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    console.log("db connected");
  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is a Home Page of server");
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
