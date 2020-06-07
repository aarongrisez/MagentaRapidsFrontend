from jaeger_client import Config
from functools import lru_cache
from opentracing.scope_managers.asyncio import AsyncioScopeManager

from api.config.settings import get_settings

settings = get_settings()

@lru_cache()
def get_tracer():
    """
    Helper function to setup opentracing with Jaeger client during setup.
    Use during app startup as follows:

    .. code-block:: python

        app = FastAPI()

        @app.on_event('startup')
        async def startup():
            setup_opentracing(app)

    :param app: app object, instance of FastAPI
    :return: None
    """
    config = Config(
        config={
            "local_agent": {
                "reporting_host": settings.jaeger_host,
                "reporting_port": settings.jaeger_port
            },
            "sampler": {
                "type": settings.jaeger_sampler_type,
                "param": settings.jaeger_sampler_rate,
            },
        },
        service_name=settings.service_name,
        validate=True,
        scope_manager=AsyncioScopeManager()
    )

    return config.initialize_tracer()