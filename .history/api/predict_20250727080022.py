from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import pickle
from api.layers import run_batch  # <- dari layers.py
import io

app = FastAPI()

# Allow all origins (React dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # untuk dev, nanti bisa dibatasi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CNN model yang telah disimpan
with open("model/rice_disease_model.pkl", "rb") as f:
    CNN = pickle.load(f)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (64, 64))  # Sesuai dengan training
    img = img / 255.0
    img = np.expand_dims(img, axis=0)  # batch
    img = img.astype(np.float32)

    # Forward pass
    outputs = run_batch(CNN, img, training=False)
    logits = outputs[-1][0]
    predicted_class = int(np.argmax(logits))

    return {"class": predicted_class}
