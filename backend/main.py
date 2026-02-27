from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# --------------------
# App initialization
# --------------------
app = FastAPI(title="MoodLens API")

# --------------------
# CORS (needed for React)
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Data model
# --------------------
class MoodInput(BaseModel):
    text: str

# --------------------
# In-memory storage
# --------------------
mood_history = []

# --------------------
# Mood detection logic
# --------------------
def detect_mood(text: str):
    text = text.lower()

    stressed_words = ["tired", "stress", "stressed", "overwhelmed", "pressure"]
    sad_words = ["sad", "lonely", "down", "depressed", "unhappy"]
    happy_words = ["happy", "good", "great", "excited", "fine"]

    if any(word in text for word in stressed_words):
        return "Stressed 😟", "Try a 1-minute deep breathing exercise"
    elif any(word in text for word in sad_words):
        return "Sad 😔", "Write one positive thing about today"
    elif any(word in text for word in happy_words):
        return "Happy 😊", "Keep doing what makes you feel good"
    else:
        return "Neutral 🙂", "Take a short break and hydrate"

# --------------------
# Routes
# --------------------
@app.get("/")
def root():
    return {"message": "MoodLens backend is running"}

@app.post("/analyze")
def analyze_mood(data: MoodInput):
    mood, suggestion = detect_mood(data.text)

    entry = {
        "text": data.text,
        "mood": mood,
        "suggestion": suggestion,
        "time": datetime.now().strftime("%H:%M")
    }

    mood_history.append(entry)

    return entry

@app.get("/history")
def get_history():
    return mood_history