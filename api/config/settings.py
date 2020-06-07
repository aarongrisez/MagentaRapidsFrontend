from functools import lru_cache
from pydantic import BaseSettings
from semver import VersionInfo

class Settings(BaseSettings):
    service_name: str = "Magenta Rapids API"
    version: VersionInfo = VersionInfo.parse("1.0.0")
    admin_email: str = "aaron@aarongrisez.com"
    jaeger_host: str = "jaeger"
    jaeger_port: int = 6831
    jaeger_sampler_type: str = "const"
    jaeger_sampler_rate: int = 1

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()