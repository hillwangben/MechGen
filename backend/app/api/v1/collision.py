"""模型碰撞检测 API 路由 - Mock 实现."""

from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/collision", tags=["collision"])


# 请求/响应模型
class CollisionRequest(BaseModel):
    model_ids: list[str]
    scenario: str
    constraints: dict = {}


class CollisionFinding(BaseModel):
    id: str
    description: str
    confidence: float
    related_models: list[str]
    evidence: list[str]


class CollisionResult(BaseModel):
    id: str
    request_id: str
    status: str
    findings: list[CollisionFinding]
    rules: list[dict]
    created_at: str


class CollisionRule(BaseModel):
    id: str
    name: str
    description: str
    conditions: list[str]
    conclusion: str
    confidence: float
    trigger_conditions: list[str]
    suggested_action: str
    related_models: list[str]


# Mock 碰撞规则
MOCK_RULES = [
    {
        "id": "rule-001",
        "name": "同行+通信→高危",
        "description": "同行人出现且存在频繁通信行为，判定为高危",
        "conditions": ["同行人识别阳性", "频繁通信关联阳性"],
        "conclusion": "高危人员集结",
        "confidence": 0.85,
        "trigger_conditions": ["同行人数 >= 2", "通信频率 > 阈值"],
        "suggested_action": "重点监控，上报指挥中心",
        "related_models": ["model-101", "model-102"]
    },
    {
        "id": "rule-002",
        "name": "背包+遥控→准备",
        "description": "检测到携带背包且手持遥控器，判定为临期准备",
        "conditions": ["携带无人机背包阳性", "手持遥控器阳性"],
        "conclusion": "临期准备阶段",
        "confidence": 0.78,
        "trigger_conditions": ["背包检测置信度 > 0.7", "遥控器检测置信度 > 0.7"],
        "suggested_action": "持续跟踪，准备拦截",
        "related_models": ["model-105"]
    },
    {
        "id": "rule-003",
        "name": "多车驻留→集结",
        "description": "多辆车辆在重点区域异常驻留，判定为人员集结",
        "conditions": ["车辆驻留时间 > 阈值", "驻留车辆数量 >= 3"],
        "conclusion": "可疑人员集结",
        "confidence": 0.72,
        "trigger_conditions": ["驻留时长 > 30分钟", "车辆间距 < 50米"],
        "suggested_action": "派遣人员现场核实",
        "related_models": []
    }
]


@router.get("/rules", response_model=list[CollisionRule])
async def list_rules():
    """获取碰撞规则列表."""
    return MOCK_RULES


@router.post("/run", response_model=CollisionResult)
async def run_collision(request: CollisionRequest):
    """执行模型碰撞."""
    now = datetime.utcnow().isoformat() + "Z"
    result_id = f"COL-{int(datetime.utcnow().timestamp())}"

    # 查找相关规则
    related_rules = [
        r for r in MOCK_RULES
        if any(m in request.model_ids for m in r["related_models"])
    ]

    return CollisionResult(
        id=result_id,
        request_id=f"REQ-{int(datetime.utcnow().timestamp())}",
        status="completed",
        findings=[
            CollisionFinding(
                id=f"F-{result_id}-1",
                description="发现潜在关联模式",
                confidence=0.85,
                related_models=request.model_ids,
                evidence=["模型输出存在时间相关性", "空间分布呈现聚集特征"]
            ),
            CollisionFinding(
                id=f"F-{result_id}-2",
                description="检测到异常行为序列",
                confidence=0.72,
                related_models=request.model_ids[:2],
                evidence=["行为序列符合预设模式"]
            )
        ],
        rules=related_rules,
        created_at=now
    )
