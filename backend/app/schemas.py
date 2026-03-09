from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List, Optional


# ===============================
# Project Schemas
# ===============================
class ProjectBase(BaseModel):
    name: str
    description: str


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
    id: str

    # Pydantic v2 replacement for orm_mode = True
    model_config = ConfigDict(from_attributes=True)


# ===============================
# Prediction Schemas
# ===============================
class PredictSingleRequest(BaseModel):
    features: Dict[str, float]


class PredictSingleResponse(BaseModel):
    project_id: str
    probability_defect: float
    predicted_class: int
    risk_level: str


class PredictionSummary(BaseModel):
    count_defective: int
    avg_probability_defect: float
    percent_defective: float
    risk_buckets: Dict[str, int]


class PredictCSVResponse(BaseModel):
    run_id: str
    project_id: str
    rows: int
    summary: PredictionSummary
    results: List[Dict[str, Any]]  # keeps it flexible for all the columns
