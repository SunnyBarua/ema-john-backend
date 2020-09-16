const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const uri = process.env.DB_PATH;

let client = new MongoClient(uri, {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
  });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection
      .find()
      .limit(10)
      .toArray((err, documents) => {
        console.log("successfully inserted", documents);
        if (err) {
          console.log(err);

          res.status(500).send({ message: err.message });
        } else {
          res.send(documents);
        }
      });

    console.log("Database connected ...");
    client.close();
  });
});

app.get("/product/:id", (req, res) => {
  const id = req.params.id;
  const name = users[id];
  res.send({ id, name });
});

app.post("/addProduct", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
  });
  const product = req.body;
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection.insert(product, (err, result) => {
      console.log("successfully inserted", result);
      if (err) {
        console.log(err);

        res.status(500).send({ message: err.message });
      } else {
        res.send(result.ops[0]);
      }
    });

    console.log("Database connected ...");
    client.close();
  });
});

app.post("/placeOrder", (req, res) => {
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("orders");
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

app.listen(PORT, () => {
  console.log("app is running on", PORT);
});
