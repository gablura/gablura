import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

let client: MongoClient;
let db: Db;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoDb: Db | undefined;
}

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(uri);
  db = client.db();
} else {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
  if (!global._mongoDb) {
    global._mongoDb = client.db();
  }
  db = global._mongoDb;
}

export { client, db };
