import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate('../auth/grupuri-boboci.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

with open("../../files/specialization.json", "r", encoding="utf8") as s:
    specializations = json.load(s)

for specialization in specializations:
    db.collection("licee").document(specialization["l"]).collection("specializari").document(specialization["sp"]).set(specialization)
