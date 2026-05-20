from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/")
DB_NAME = "scanify"

client = None
db = None

def connect_db():
    global client, db
    try:
        client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=10000,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        client.admin.command("ping")
        db = client[DB_NAME]
        print("✅ MongoDB connected successfully!")
        return db
    except ConnectionFailure as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise

def get_db():
    global db
    if db is None:
        connect_db()
    return db