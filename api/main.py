from fastapi import FastAPI, APIRouter
from api.managers.message import MessageManager
from api.middlewares.tracing import OpentracingMiddleware
from api.middlewares.debugging import DebuggingMiddleware
from api.routers import root
import logging

logger = logging.getLogger("api")
logger.setLevel(logging.DEBUG)
app = FastAPI()
app.include_router(root.router)

@app.on_event("startup")
async def startup():
    logger.info("Running Startup Initialization")
    #app.add_middleware(OpentracingMiddleware)
    app.add_middleware(DebuggingMiddleware)
