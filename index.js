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
}
createConnection();

app.get("/posts", (req, res) => {
  // res.send("Hello World!");
});

app.post("/posts", server_memory.single("file"), (req, res) => {
  const { fileName, path } = req.file;
  res.send("Hello Kitty!");
});

app.listen(PORT, () => console.log("The server has started in port", PORT));
