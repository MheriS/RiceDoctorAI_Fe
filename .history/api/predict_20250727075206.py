# api/predict.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import pickle
from layers import conv_layer, pool_layer, reshape_layer, weights_layer, ReLU, dropout_layer, run_batch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # atau ganti dengan domain React kamu
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
with open("model/rice_disease_model.pkl", "rb") as f:
    CNN = pickle.load(f)

def preprocess_image(file_bytes):
    np_img = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (128, 128))  # sesuaikan dengan input model kamu
    img = img / 255.0
    return np.expand_dims(img, axis=0)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = preprocess_image(contents)
    output = run_batch(CNN, img, training=False)[-1]
    predicted_class = int(np.argmax(output, axis=1)[0])
    return {"prediction": predicted_class}
