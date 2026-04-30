"""任务管理 API 路由 - Mock 实现."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])


# 请求/响应模型
class TaskContext(BaseModel):
    scene: str
    scenario_category: str
    constraints: dict = {}


class CreateTaskRequest(BaseModel):
    name: str
    context: TaskContext


class TaskResponse(BaseModel):
    id: str
    name: str
    status: str
    current_phase: str
    context: TaskContext
    created_at: str
    updated_at: str


# Mock 数据
MOCK_TASKS = [
    {
        "id": "TASK-2024-001",
        "name": "城市反无人机场景分析",
        "status": "allocating",
        "current_phase": "allocation",
        "context": {
            "scene": "同行人识别",
            "scenario_category": "人员集结类",
            "constraints": {"latency": "<100ms", "accuracy": ">90%"}
        },
        "created_at": "2024-03-21T10:00:00Z",
        "updated_at": "2024-03-21T10:00:00Z"
    },
    {
        "id": "TASK-2024-002",
        "name": "装备筹措行为检测",
        "status": "optimizing",
        "current_phase": "optimization",
        "context": {
            "scene": "整机采购识别",
            "scenario_category": "装备筹措类",
            "constraints": {}
        },
        "created_at": "2024-03-20T14:30:00Z",
        "updated_at": "2024-03-21T09:00:00Z"
    },
    {
        "id": "TASK-2024-003",
        "name": "物流运输风险评估",
        "status": "completed",
        "current_phase": "completed",
        "context": {
            "scene": "无人机寄递",
            "scenario_category": "物流运输类",
            "constraints": {}
        },
        "created_at": "2024-03-19T08:00:00Z",
        "updated_at": "2024-03-19T12:00:00Z"
    }
]


@router.get("", response_model=list[TaskResponse])
async def list_tasks():
    """获取任务列表."""
    return MOCK_TASKS


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """获取单个任务."""
    task = next((t for t in MOCK_TASKS if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    return task


@router.post("", response_model=TaskResponse)
async def create_task(request: CreateTaskRequest):
    """创建任务."""
    now = datetime.utcnow().isoformat() + "Z"
    task = {
        "id": f"TASK-{int(datetime.utcnow().timestamp())}",
        "name": request.name,
        "status": "draft",
        "current_phase": "created",
        "context": request.context.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, request: CreateTaskRequest):
    """更新任务."""
    task = next((t for t in MOCK_TASKS if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    now = datetime.utcnow().isoformat() + "Z"
    updated_task = {
        **task,
        "name": request.name,
        "context": request.context.model_dump(),
        "updated_at": now
    }
    return updated_task


@router.delete("/{task_id}")
async def delete_task(task_id: str):
    """删除任务."""
    task = next((t for t in MOCK_TASKS if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    return {"message": "删除成功"}
