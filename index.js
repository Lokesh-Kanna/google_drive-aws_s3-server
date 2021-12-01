import express from "express";
import multer from "multer";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

const PORT = process.env.PORT || 9000;

dotenv.config();

app.use(express.json());

app.use(cors());

const MONGO_URL = process.env.MONGO_URL;

const server_memory = multer({ dest: "server_memory/" });

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB Connected!");
  return client;
}
createConnection();

const client = await createConnection();

app.get("/files/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const getData = await client
    .db("L-Drive")
    .collection("data")
    .findOne({ fileName: fileName });
  res.send(getData);
});

app.get("/files", async (req, res) => {
  const storedData = req.file;
  const getData = await client
    .db("L-Drive")
    .collection("data")
    .find(storedData)
    .toArray();
  res.send(getData);
});

app.post("/files", server_memory.single("file"), async (req, res) => {
  const { filename, path } = req.file;
  const info = { fileName: filename, path: `/files/${filename}` };
  const postData = await client
    .db("L-Drive")
    .collection("data")
    .insertOne(info);
  res.send(info);
});

async function genPass(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
}

async function createUser(data) {
  const result = await client.db("L-Drive").collection("users").insertOne(data);
  return result;
}

async function getUser(email) {
  return await client
    .db("L-Drive")
    .collection("users")
    .findOne({ email: email });
}

app.post("/users/signup", async (req, res) => {
  const { email, password } = req.body;

  const isUserExist = await getUser(email);

  if (isUserExist) {
    res.send({ message: "User name already exists" });
  }

  if (password.length < 8) {
    res.send({ message: "Please provide a longer password" });
  }

  if (
    !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!%#&]).{8,}$/g.test(password)
  ) {
    res.send({ message: "Please provide a stronger password" });
    return;
  }

  const hashedPassword = await genPass(password);

  const result = await createUser({
    email: email,
    password: hashedPassword,
  });

  const getData = await getUser(email);

  res.send(getData);
});

app.listen(PORT, () => console.log("The server has started in port", PORT));
