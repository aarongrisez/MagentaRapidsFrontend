FROM python:3-buster
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
RUN apt-get update && apt-get install -y git-all libsndfile1
WORKDIR /src
COPY ./pyproject.toml .
COPY ./poetry.lock .
ENV PATH="/root/.poetry/bin:${PATH}"
RUN poetry install
CMD ["poetry", "run", "uvicorn", "api.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]