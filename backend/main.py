from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    language: str
    code: str

@app.get("/")
def home():
    return {"message": "Hello World"}

@app.get("/test")
def test():
    return {
        "status": "success",
        "message": "backend connected successfully!"
    }

@app.post("/explain")
def explain_code(request: CodeRequest):
    prompt = f"""
    You are a programming teacher.

    Explain ONLY the code given below.

    Do not generate extra examples.
    Do not repeat the prompt.
    Do not invent new code.

    Language: {request.language}

    Code:
    {request.code}
    """
    result = ollama.chat(
    model="qwen2.5-coder:1.5b",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
    )

    return {
    "explanation": result["message"]["content"].strip()
    }
