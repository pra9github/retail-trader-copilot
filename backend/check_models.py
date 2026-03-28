from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

try:
    models = client.models.list()
    print("Available Groq Models:")
    print("=" * 50)
    for model in models.data:
        print(f"  • {model.id}")
except Exception as e:
    print(f"Error: {e}")
