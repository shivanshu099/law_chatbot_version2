from fastapi import FastAPI, Request, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import whisper
from gtts import gTTS
import os, uuid

# local imports
from llm import law_chatbot
from db import SessionLocal
import models, schemas
from auth_utils import hash_password, verify_password, create_access_token
from db import engine, Base
import models

app = FastAPI()
model = whisper.load_model("tiny")


# 👇 This will create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryInput(BaseModel):
    question: str

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- AUTH ----------------

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="username already exists")

    new_user = models.User(username=user.username, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/logout")
def logout():
    return {"message": "Logout successful (delete token on client side)"}


# ---------------- CHATBOT ----------------

@app.get("/")
def home():
    return {"message": "Law Chatbot API is running."}


@app.post("/ask")
def ask_text(input: QueryInput):
    try:
        answer = law_chatbot(input.question)
        return answer
    except Exception as e:
        return {"error": str(e)}


@app.post("/speak-ask")
async def ask_audio(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    try:
        temp_filename = f"temp_{uuid.uuid4()}.mp3"
        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())

        transcription = model.transcribe(temp_filename)
        text = transcription["text"]
        answer = law_chatbot(text)

        output_audio = f"reply_{uuid.uuid4()}.mp3"
        tts = gTTS(answer, slow=False)
        tts.save(output_audio)

        os.remove(temp_filename)

        if background_tasks:
            background_tasks.add_task(os.remove, output_audio)

        return FileResponse(output_audio, media_type="audio/mpeg", filename="response.mp3")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, log_level="info")






