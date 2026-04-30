"""事件总线 — 智能体间异步通信."""

from __future__ import annotations

import asyncio
from collections import defaultdict
from collections.abc import Callable, Coroutine
from typing import Any

EventHandler = Callable[[dict[str, Any]], Coroutine[None, None, None]]


class EventBus:
    """轻量级内存事件总线，支持发布/订阅模式."""

    def __init__(self):
        self._handlers: dict[str, list[EventHandler]] = defaultdict(list)

    def subscribe(self, event_type: str, handler: EventHandler):
        """注册事件处理器."""
        self._handlers[event_type].append(handler)

    def unsubscribe(self, event_type: str, handler: EventHandler):
        """移除事件处理器."""
        self._handlers[event_type].remove(handler)

    async def publish(self, event_type: str, data: dict[str, Any]):
        """发布事件，异步通知所有订阅者."""
        for handler in self._handlers.get(event_type, []):
            asyncio.create_task(handler(data))


event_bus = EventBus()
