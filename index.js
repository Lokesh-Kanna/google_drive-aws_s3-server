import express from "express";
import multer from "multer";
import { MongoClient } from "mongodb";

const app = express();

const PORT = process.env.PORT || 9000;

const MONGO_URL =
  "mongodb+srv://LokeshKanna:book123@cluster0.60x6w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const server_memory = multer({ dest: "server_memory/" });

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB Connected!");
  return client;
}
createConnection();

const client = await createConnection();

app.get("/files/:fileName", (req, res) => {
  // res.send("Hello World!");
});

app.get("/posts", async (req, res) => {
  const storedData = req.file;
  const getData = await client
    .db("L-Drive")
    .collection("data")
    .find(storedData)
    .toArray();
  res.send(getData);
  console.log(getData);
});

app.post("/posts", server_memory.single("file"), async (req, res) => {
  const { filename, path } = req.file;
  const info = { fileName: filename, path: `/files/${filename}` };
  const postData = await client
    .db("L-Drive")
    .collection("data")
    .insertOne(info);
  res.send(info);
});

app.listen(PORT, () => console.log("The server has started in port", PORT));
