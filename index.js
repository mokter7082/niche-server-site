const express = require("express");
const cors = require("cors");
var ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//CALL CORS
app.use(cors());
app.use(express.json());
//BASIC CONNECT WITH DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohgf7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  await client.connect();
  //CONNECT DATABASE WITH MONGO DB
  const database = client.db("mobilezone");
  //CONNECT WITH TABLE
  const mobileCollection = database.collection("mobileInfo");
  const orderCollection = database.collection("placeOrder");
  const reviewCollection = database.collection("review");
  const usersCollection = database.collection("users");

  //POST REQUEST INSRT MOBILE INFORMATION HERE
  app.post("/addMobile", async (req, res) => {
    const mobileInfo = req.body;
    const result = await mobileCollection.insertOne(mobileInfo);
    res.send(result);
  });
  //GET REQUEST GET ALL MOBILE INFORMATION
  app.get("/allMobile", async (req, res) => {
    const cursor = mobileCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  });
  //GET SINGLE MOBILE VALUE
  app.get("/mobile/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await mobileCollection.findOne(query);
    res.send(result);
  });
  ///sdfsdfs
  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === "admin") {
      isAdmin = true;
    }
    res.json({ admin: isAdmin });
  });
  //post
  app.post("/placeOrder", async (req, res) => {
    // console.log(req.body);
    const result = await orderCollection.insertOne(req.body);
    // console.log(result);
    res.send(result);
  });
  //GET REQUEST GET ALL order INFORMATION
  app.get("/palceOrder/:email", async (req, res) => {
    console.log(req.params.email);
    const result = await orderCollection
      .find({
        userEmail: req.params.email,
      })
      .toArray();
    res.send(result);
    // const result = await orderCollection.find({}).toArray();
    // res.send(result);
    // console.log(result);
  });
  app.put("/users/admin", async (req, res) => {
    const user = req.body;
    // console.log("put", user);
    const filter = { email: user.email };
    // console.log(filter);
    const updateDoc = {
      $set: { role: "admin" },
    };
    console.log(updateDoc);
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
  //sdfdsfs
  app.post("/register/user", async (req, res) => {
    const result = await usersCollection.insertOne(req.body);
    // console.log(req.body);
    res.send(result);
  });
  // dfbsjdhfghdsj
  app.get("/allAdmin", async (req, res) => {
    const cursor = usersCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  });
  //GET REQUEST GET ALL order INFORMATION
  app.get("/palceOrder", async (req, res) => {
    const result = await orderCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });
  //delete
  app.delete("/deleteOrder/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
  });
  //delete
  app.delete("/deleteAdmin/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.json(result);
  });
  // review
  app.post("/addReview", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });
  //GET REQUEST GET ALL review INFORMATION
  app.get("/allReview", async (req, res) => {
    const cursor = reviewCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  });

  //UPDATE DATA FROM DATABASE
  app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const upData = req.body;
    const filter = { _id: ObjectId(id) };
    const updateDoc = {
      $set: {
        status: upData.status,
      },
    };
    const result = orderCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
}
run();

app.get("/", (req, res) => {
  res.send("running mobilezone server");
});

app.listen(port, () => {
  console.log("my server is runniung Now", port);
});
