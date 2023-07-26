import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate('../grupuri-boboci.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

with open("grupuri-boboci-scraper/files/highschool.json", "r", encoding="utf8") as s:
    highschools = json.load(s)

for highschool in highschools:
    db.collection("licee").document(highschool["l"]).collection("despre").document("Contact").set(highschool)
