from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from predict import predict
import shutil
import os

app = FastAPI(
    title="Plant Disease Detection API",
    version="1.0.0",
    description="AI Powered Plant Disease Detection"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "🌿 Plant Disease Detection API is Running"
    }


@app.post("/predict")
async def predict_leaf(file: UploadFile = File(...)):

    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
        raise HTTPException(
            status_code=400,
            detail="Upload JPG or PNG image only."
        )

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = predict(filepath)

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

    return result