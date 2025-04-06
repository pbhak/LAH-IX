import autopy
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

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
    print(f"({1439.5 - (json['x'] * 2.24921875)}, {(json['y'] * 1.875)})")
    # autopy.mouse.move(1439.5 - (json['x'] * 2.24921875), (json['y'] * 1.875))
    autopy.key.tap(autopy.key.Code.TAB)
    time.sleep(0.5)
    return ''   

@app.post('/click')
def click():
    autopy.mouse.click(autopy.mouse.Button.LEFT)

@app.post('/secclick')
def click():
    autopy.mouse.click(autopy.mouse.Button.RIGHT)