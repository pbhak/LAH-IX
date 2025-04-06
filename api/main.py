import autopy
from typing import Union
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/cursor")
async def cursor(request: Request):
    json = await request.json()
    print(json['x'] * 1.125)
    autopy.mouse.move(1439.5 - (json['x'] * 2.24921875), (json['y'] * 1.875))
    return ''
