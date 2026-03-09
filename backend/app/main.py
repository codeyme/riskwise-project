from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import joblib
import json

from app.routes import projects
from app.database import engine
from app import models


# -----------------------------
# Database Setup
# -----------------------------
models.Base.metadata.create_all(bind=engine)


# -----------------------------
# App Initialization
# -----------------------------
app = FastAPI()


# -----------------------------
# Correct Model Paths
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "rf_defect_model.joblib"
FEATURES_PATH = BASE_DIR / "ml" / "features.json"

app.state.model = joblib.load(str(MODEL_PATH))
app.state.features = json.loads(FEATURES_PATH.read_text())
app.state.threshold = 0.175


# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Routers
# -----------------------------
app.include_router(
    projects.router,
    prefix="/projects",
    tags=["Projects"]
)


# -----------------------------
# Health Endpoints
# -----------------------------
@app.get("/")
def read_root():
    return {"message": "RiskWise Backend Running 🚀"}


@app.get("/health")
def health_check():
    return {"status": "OK"}