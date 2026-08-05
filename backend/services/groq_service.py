import os
import json
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"


def get_disease_info(plant, disease):
    prompt = f"""
You are an expert agricultural scientist.

Plant: {plant}
Disease: {disease}

Return ONLY valid JSON.

{{
    "description": "",
    "symptoms": "",
    "treatment": "",
    "prevention": "",
    "immediate_actions": "",
    "recovery_time": "",
    "watering_advice": "",
    "fertilizer_advice": ""
}}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            temperature=0.3,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        text = response.choices[0].message.content.strip()

        text = (
            text.replace("```json", "")
                .replace("```", "")
                .strip()
        )

        return json.loads(text)

    except Exception as e:
        print("GROQ ERROR:", e)

        return {
            "description": "AI information unavailable.",
            "symptoms": "No symptoms available.",
            "treatment": "No treatment available.",
            "prevention": "No prevention available.",
            "immediate_actions": "",
            "recovery_time": "",
            "watering_advice": "",
            "fertilizer_advice": ""
        }