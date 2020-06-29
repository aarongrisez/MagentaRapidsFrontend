from starlette.middleware.base import BaseHTTPMiddleware

import logging

logger = logging.getLogger("api")

class DebuggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):
        response = await call_next(request)
        return response
