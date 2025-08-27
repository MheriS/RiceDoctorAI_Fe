
import numpy as np
import cv2
import pickle
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
from PIL import Image

# Load model
with open("model/rice_disease_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI()

# Allow CORS (akses dari React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # bisa disesuaikan nanti
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(BytesIO(contents)).convert("RGB")
    img = img.resize((150, 150))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_label = np.argmax(prediction)

    return {"prediction": int(predicted_label)}
