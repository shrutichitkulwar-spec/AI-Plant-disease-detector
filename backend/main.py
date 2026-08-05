from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import uuid

from predict import predict


app = FastAPI(
    title="Plant Disease Detector API"
)


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@app.get("/")
def home():

    return {
        "message": "Plant Disease Detector API running"
    }



@app.post("/predict")
async def detect_disease(
    file: UploadFile = File(...)
):

    file_name = (
        str(uuid.uuid4())
        +
        "_"
        +
        file.filename
    )


    file_path = os.path.join(
        UPLOAD_FOLDER,
        file_name
    )


    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    result = predict(
        file_path
    )


    # delete uploaded image after prediction
    os.remove(
        file_path
    )


    return result