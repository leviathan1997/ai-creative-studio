from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import base64
from gemini_service import generate_image_with_gemini, edit_image_with_gemini, analyze_image_with_gemini

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend default port
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the AI Creative Studio Backend!"}

@app.post("/generate-image")
async def generate_image(request: PromptRequest):
    try:
        generated_image_base64, text_response = generate_image_with_gemini(request.prompt)
        if generated_image_base64:
            return {"image": generated_image_base64, "text": text_response}
        else:
            raise HTTPException(status_code=500, detail=text_response or "Failed to generate image.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/edit-image")
async def edit_image(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        image_bytes = await file.read()
        mime_type = file.content_type
        edited_image_base64, text_response = edit_image_with_gemini(image_bytes, mime_type, prompt)
        if edited_image_base64:
            return {"image": edited_image_base64, "text": text_response}
        else:
            raise HTTPException(status_code=500, detail=text_response or "Failed to edit image.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        image_bytes = await file.read()
        mime_type = file.content_type
        text_response = analyze_image_with_gemini(image_bytes, mime_type, prompt)
        if text_response:
            return {"text": text_response}
        else:
            raise HTTPException(status_code=500, detail="Failed to analyze image.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
