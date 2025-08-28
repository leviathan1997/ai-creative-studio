import os
import io
import base64
import google.genai as genai
from google.genai import types
from PIL import Image

def initialize_gemini_client():
    """Initializes the Gemini client. API key is expected from environment variables."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY environment variable not set.")
    print("Gemini client initialized.")
    return genai.Client()

def generate_image_with_gemini(prompt: str) -> tuple[str | None, str | None]:
    """
    Sends a text prompt to the gemini-2.5-flash-image-preview model to generate an image.
    Returns the generated image as a base64 string and any text response.
    """
    try:
        client = initialize_gemini_client()
        model_name = 'gemini-2.5-flash-image-preview'

        # Prompt Engineering: Add 'picture' if not already present to encourage image generation
        processed_prompt = prompt
        keywords = ["picture", "image", "render", "draw", "photo", "illustration", "art"]
        if not any(keyword in prompt.lower() for keyword in keywords):
            processed_prompt = f"{prompt} picture"
            print(f"[Generate] Appended 'picture' to prompt: '{processed_prompt}'")

        print(f"[Generate] Sending prompt to Gemini for image generation: '{processed_prompt}'")
        response = client.models.generate_content(
            model=model_name,
            contents=processed_prompt
        )
        print("[Generate] Received response from Gemini.")

        generated_image_base64 = None
        text_response = []

        if not response.candidates:
            print("[Generate] Model did not return any candidates.")
            return None, "Model did not return any candidates. The request might have failed or the model could not generate a response."

        print(f"[Generate] Number of candidates: {len(response.candidates)}")
        if response.candidates and response.candidates[0].content:
            print(f"[Generate] Processing candidate 0 content with {len(response.candidates[0].content.parts)} parts.")
            for i, part in enumerate(response.candidates[0].content.parts):
                print(f"[Generate] Processing part {i}: Type={type(part)}")
                if part.text:
                    text_response.append(part.text)
                    print(f"[Generate] Part {i} is text: {part.text[:50]}...")
                elif part.inline_data:
                    if part.inline_data.mime_type.startswith('image/'):
                        generated_image_base64 = base64.b64encode(part.inline_data.data).decode('utf-8')
                        print(f"[Generate] Part {i} is image data (MIME: {part.inline_data.mime_type}). Image data encoded to base64.")
                    else:
                        text_response.append(f"Received inline data of type: {part.inline_data.mime_type}")
                        print(f"[Generate] Part {i} is inline data (MIME: {part.inline_data.mime_type}).")
                else:
                    text_response.append("Received an unknown part in the response.")
                    print(f"[Generate] Part {i} is unknown.")
        else:
            print("[Generate] Candidate 0 or its content is empty.")
            if not text_response:
                return None, "Model returned an empty candidate or content."

        return generated_image_base64, " ".join(text_response)
    except Exception as e:
        print(f"[Generate] An error occurred: {e}")
        return None, f"Internal server error during image generation: {e}"

def edit_image_with_gemini(image_bytes: bytes, mime_type: str, prompt: str) -> tuple[str | None, str | None]:
    """
    Sends an image and a text prompt to the gemini-2.5-flash-image-preview model for editing.
    Returns the edited image as a base64 string and any text response.
    """
    try:
        client = initialize_gemini_client()
        model_name = 'gemini-2.5-flash-image-preview'

        print(f"[Edit] Sending image for editing and prompt to Gemini...")
        img_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        contents = [img_part, types.Part.from_text(text=prompt)]
        response = client.models.generate_content(model=model_name, contents=contents)
        print("[Edit] Received response from Gemini.")

        edited_image_base64 = None
        text_response = []

        if not response.candidates:
            print("[Edit] Model did not return any candidates.")
            return None, "Model did not return any candidates. The request might have failed or the model could not generate a response."

        print(f"[Edit] Number of candidates: {len(response.candidates)}")
        if response.candidates and response.candidates[0].content:
            print(f"[Edit] Processing candidate 0 content with {len(response.candidates[0].content.parts)} parts.")
            for i, part in enumerate(response.candidates[0].content.parts):
                print(f"[Edit] Processing part {i}: Type={type(part)}")
                if part.text:
                    text_response.append(part.text)
                    print(f"[Edit] Part {i} is text: {part.text[:50]}...")
                elif part.inline_data:
                    if part.inline_data.mime_type.startswith('image/'):
                        edited_image_base64 = base64.b64encode(part.inline_data.data).decode('utf-8')
                        print(f"[Edit] Part {i} is image data (MIME: {part.inline_data.mime_type}). Image data encoded to base64.")
                    else:
                        text_response.append(f"Received inline data of type: {part.inline_data.mime_type}")
                        print(f"[Edit] Part {i} is inline data (MIME: {part.inline_data.mime_type}).")
                else:
                    text_response.append("Received an unknown part in the response.")
                    print(f"[Edit] Part {i} is unknown.")
        else:
            print("[Edit] Candidate 0 or its content is empty.")
            if not text_response:
                return None, "Model returned an empty candidate or content."

        return edited_image_base64, " ".join(text_response)
    except Exception as e:
        print(f"[Edit] An error occurred: {e}")
        return None, f"Internal server error during image editing: {e}"

def analyze_image_with_gemini(image_bytes: bytes, mime_type: str, prompt: str) -> str | None:
    """
    Sends an image and a text prompt to the gemini-2.5-flash-image-preview model for analysis.
    Returns the text description.
    """
    try:
        client = initialize_gemini_client()
        model_name = 'gemini-2.5-flash-image-preview'

        print(f"[Analyze] Sending image for analysis and prompt to Gemini...")
        img_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        contents = [img_part, types.Part.from_text(text=prompt)]
        response = client.models.generate_content(model=model_name, contents=contents)
        print("[Analyze] Received response from Gemini.")

        text_response = []

        if not response.candidates:
            print("[Analyze] Model did not return any candidates.")
            return "Model did not return any candidates. The request might have failed or the model could not generate a response."

        print(f"[Analyze] Number of candidates: {len(response.candidates)}")
        if response.candidates and response.candidates[0].content:
            print(f"[Analyze] Processing candidate 0 content with {len(response.candidates[0].content.parts)} parts.")
            for i, part in enumerate(response.candidates[0].content.parts):
                print(f"[Analyze] Processing part {i}: Type={type(part)}")
                if part.text:
                    text_response.append(part.text)
                    print(f"[Analyze] Part {i} is text: {part.text[:50]}...")
                elif part.inline_data:
                    text_response.append(f"Received inline data of type: {part.inline_data.mime_type} during analysis.")
                    print(f"[Analyze] Part {i} is inline data (MIME: {part.inline_data.mime_type}).")
                else:
                    text_response.append("Received an unknown part in the response during analysis.")
                    print(f"[Analyze] Part {i} is unknown.")
        else:
            print("[Analyze] Candidate 0 or its content is empty.")
            return "Model returned an empty candidate or content."

        return " ".join(text_response)
    except Exception as e:
        print(f"[Analyze] An error occurred: {e}")
        return f"Internal server error during image analysis: {e}"