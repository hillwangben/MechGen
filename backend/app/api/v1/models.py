"""模型资产管理 API 路由 - Mock 实现."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/models", tags=["models"])


# 请求/响应模型
class SearchRequest(BaseModel):
    query: str
    scene: Optional[str] = None
    scenario: Optional[str] = None


class ModelResponse(BaseModel):
    id: str
    name: str
    description: str
    form: str
    level: str
    detection_phase: str
    version: str
    tags: list[str]
    accuracy: Optional[float] = None
    latency: Optional[int] = None


class SearchResult(BaseModel):
    models: list[ModelResponse]
    matched: bool
    recommendation: Optional[str] = None


# Mock 数据
MOCK_MODELS = [
    {
        "id": "model-001",
        "name": "YOLOv8 目标检测",
        "description": "通用目标检测基础模型，支持 80 类目标识别",
        "form": "basic",
        "level": "L4",
        "detection_phase": "planning",
        "version": "8.0",
        "tags": ["目标检测", "通用"],
        "accuracy": 0.89,
        "latency": 25
    },
    {
        "id": "model-101",
        "name": "同行人识别模型 v2",
        "description": "识别可疑同行人员，基于轨迹和行为特征分析",
        "form": "scene",
        "level": "L3",
        "detection_phase": "assembly",
        "version": "2.0",
        "tags": ["人员集结类", "同行人识别", "城市反无人机"],
        "accuracy": 0.92,
        "latency": 45
    },
    {
        "id": "model-102",
        "name": "频繁通信关联模型 v1",
        "description": "检测人员间异常频繁通信行为",
        "form": "scene",
        "level": "L2",
        "detection_phase": "assembly",
        "version": "1.0",
        "tags": ["人员集结类", "通信关联"],
        "accuracy": 0.85,
        "latency": 30
    },
    {
        "id": "model-103",
        "name": "整机采购识别模型 v1",
        "description": "识别可疑的无人机整机采购行为",
        "form": "scene",
        "level": "L2",
        "detection_phase": "procurement",
        "version": "1.0",
        "tags": ["装备筹措类", "整机采购"],
        "accuracy": 0.78,
        "latency": 60
    },
    {
        "id": "model-201",
        "name": "人员集结综合研判模型",
        "description": "融合同行人识别和通信关联的综合研判",
        "form": "composite",
        "level": "L2",
        "detection_phase": "assembly",
        "version": "1.0",
        "tags": ["人员集结类", "综合研判"],
        "accuracy": 0.88,
        "latency": 80
    }
]


@router.get("", response_model=list[ModelResponse])
async def list_models():
    """获取模型列表."""
    return MOCK_MODELS


@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(model_id: str):
    """获取单个模型."""
    model = next((m for m in MOCK_MODELS if m["id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="模型不存在")
    return model


@router.post("/search", response_model=SearchResult)
async def search_models(request: SearchRequest):
    """搜索模型."""
    filtered = [
        m for m in MOCK_MODELS
        if (not request.query or request.query.lower() in m["name"].lower() or request.query.lower() in m["description"].lower())
        and (not request.scene or request.scene in m["tags"])
    ]

    return SearchResult(
        models=filtered,
        matched=len(filtered) > 0,
        recommendation=f"找到 {len(filtered)} 个匹配模型" if filtered else "未找到匹配模型，建议从基础模型开始训练"
    )
