import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate('grupuri-boboci.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

with open("../candidate.json", "r", encoding="utf8") as s:
    candidates = json.load(s)

for candidate in candidates:
    db.collection("elevi").document(candidate["n"]).set(candidate)
