import os
import base64
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
OUT = Path(__file__).parent / "images"
OUT.mkdir(exist_ok=True)

ASSETS = {
    "logo.png": "Kantami wordmark logo, serif italic typography, thin elegant strokes, warm gold gradient (#c8982b to #fbe291), subtle Japanese brush influence, luxury izakaya restaurant branding, transparent background, high resolution",
    "seal.png": "Minimal circular emblem, Japanese kanji-inspired calligraphy, single warm gold brushstroke, luxury izakaya seal, flat vector style, transparent background, square 1024x1024",
    "divider.png": "Thin horizontal ornament, art deco meets Japanese wave motif, warm gold gradient, symmetric, transparent background, wide aspect ratio",
    "signature_badge.png": "Small circular badge that says 'Chef's Signature', gold foil, serif italic text, ornate thin border, transparent background",
    "menu_header.png": "Single sumi-e ink brushstroke in warm gold, abstract horizontal mark, transparent background, elegant minimal",
}

for filename, prompt in ASSETS.items():
    print(f"generating {filename}...")
    resp = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
    )
    for part in resp.candidates[0].content.parts:
        if part.inline_data:
            (OUT / filename).write_bytes(part.inline_data.data)
            print(f"  saved {filename}")
            break
    else:
        print(f"  no image returned for {filename}")
