import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import {
  addDbItem,
  getAllDbItems,
  getDbItemById,
  DbItem,
  updateDbItemById,
  deleteDbItemById,
} from "./db";
import filePath from "./filePath";

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  console.log(process.env.DATABASE_URL);
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /items
app.get("/items", async (req, res) => {
  try {
    const allSignatures = await getAllDbItems();
    res.status(200).json(allSignatures);
  } catch (err) {
    console.error({ message: (err as Error).message });
  }
});

// POST /items
app.post<{}, {}, DbItem>("/items", async (req, res) => {
  // to be rigorous, ought to handle non-conforming request bodies
  // ... but omitting this as a simplification
  try {
    const postData = req.body;
    const createdSignature = await addDbItem(postData);
    res.status(201).json(createdSignature);
  } catch (err) {
    console.error({ message: (err as Error).message });
  }
});

// GET /items/:id
app.get<{ id: string }>("/items/:id", async (req, res) => {
  try {
    const matchingSignature = await getDbItemById(parseInt(req.params.id));
    if (matchingSignature === "not found") {
      res.status(404).json(matchingSignature);
    } else {
      res.status(200).json(matchingSignature);
    }
  } catch (err) {
    console.error({ message: (err as Error).message });
  }
});

// DELETE /items/:id
app.delete<{ id: string }>("/items/:id", async (req, res) => {
  try {
    const matchingSignature = await deleteDbItemById(parseInt(req.params.id));
    if (matchingSignature === "not found") {
      res.status(404).json(matchingSignature);
    } else {
      res.status(200).json(matchingSignature);
    }
  } catch (err) {
    console.error({ message: (err as Error).message });
  }
});

// PATCH /items/:id
app.patch<{ id: string }, {}, Partial<DbItem>>(
  "/items/:id",
  async (req, res) => {
    try {
      const matchingSignature = await updateDbItemById(
        parseInt(req.params.id),
        req.body
      );
      if (matchingSignature === "not found") {
        res.status(404).json(matchingSignature);
      } else {
        res.status(200).json(matchingSignature);
      }
    } catch (err) {
      console.error({ message: (err as Error).message });
    }
  }
);

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
