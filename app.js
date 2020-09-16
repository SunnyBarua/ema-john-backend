const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;
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
      .find({ name: "Iphone" })
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

app.post("/addProduct", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
  });
  const product = req.body;
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection.insertOne(product, (err, result) => {
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

app.listen(PORT, () => {
  console.log("app is running on", PORT);
});
