import { MongoClient, type Db, type ClientSession } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const options = {
  tls: true,
  tlsAllowInvalidCertificates: true,
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "production") {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
} else {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  clientPromise = global._mongoClient.connect();
}

async function getClient(): Promise<MongoClient> {
  return clientPromise;
}

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

async function withTransaction<T>(
  fn: (session: ClientSession) => Promise<T>
): Promise<T> {
  const client = await getClient();
  const session = client.startSession();
  try {
    let result!: T;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

export { getDb, getClient, clientPromise, withTransaction };
