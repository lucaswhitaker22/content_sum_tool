import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from client import GeminiClient
from perplexity import PerplexityClient
import json
import logging
import requests
from assets.prompts import generate_prompts

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

prompts = []
class Lecture:
    def __init__(self, client):
        self.client = client
        self.prompts = generate_prompts()

    def generate_metadata(client, uploaded_file):
        logger.info("Generating metadata")
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.85,
            "top_k": 32,
            "max_output_tokens": 8192,
            "response_schema": content.Schema(
                type=content.Type.OBJECT,
                required=["overview", "topics"],
                properties={
                    "overview": content.Schema(type=content.Type.STRING),
                    "topics": content.Schema(
                        type=content.Type.ARRAY,
                        items=content.Schema(type=content.Type.STRING),
                    ),
                },
            ),
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", generation_config=generation_config
        )
        prompt = prompts["metadata"]

        response = client.generate_content(model, prompt, uploaded_file)

        try:
            python_obj = json.loads(response)
            logger.debug("Metadata generated successfully")
            return python_obj
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for metadata")
            return None

    def generate_notes(file_txt):
        logger.info("Generating notes")

        model = PerplexityClient()
        prompt = prompts["notes"]

        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": file_txt},
        ]

        notes = model.generate(messages)
        logger.debug("Notes generated successfully")
        return notes

    def generate_review(client, uploaded_file):
        logger.info("Generating review questions")
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.85,
            "top_k": 32,
            "max_output_tokens": 8192,
            "response_schema": content.Schema(
                type=content.Type.OBJECT,
                required=["review"],
                properties={
                    "review": content.Schema(
                        type=content.Type.ARRAY,
                        items=content.Schema(
                            type=content.Type.OBJECT,
                            required=["question", "answer"],
                            properties={
                                "question": content.Schema(type=content.Type.STRING),
                                "answer": content.Schema(type=content.Type.STRING),
                            },
                        ),
                    ),
                },
            ),
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", generation_config=generation_config
        )
        prompt = prompts["review"]

        response = client.generate_content(model, prompt, uploaded_file)

        try:
            python_obj = json.loads(response)
            logger.debug("Review questions generated successfully")
            return python_obj["review"]
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for review questions")
            return None

    def generate_practice(client, uploaded_file):
        logger.info("Generating practice exam")
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.85,
            "top_k": 32,
            "max_output_tokens": 8192,
            "response_schema": content.Schema(
                type=content.Type.OBJECT,
                required=["short", "long", "multiple"],
                properties={
                    "short": content.Schema(
                        type=content.Type.ARRAY,
                        items=content.Schema(
                            type=content.Type.OBJECT,
                            required=["question", "answer"],
                            properties={
                                "question": content.Schema(type=content.Type.STRING),
                                "answer": content.Schema(type=content.Type.STRING),
                            },
                        ),
                    ),
                    "long": content.Schema(
                        type=content.Type.ARRAY,
                        items=content.Schema(
                            type=content.Type.OBJECT,
                            required=["question", "answer"],
                            properties={
                                "question": content.Schema(type=content.Type.STRING),
                                "answer": content.Schema(type=content.Type.STRING),
                            },
                        ),
                    ),
                    "multiple": content.Schema(
                        type=content.Type.ARRAY,
                        items=content.Schema(
                            type=content.Type.OBJECT,
                            required=["question", "options", "answer", "explanation"],
                            properties={
                                "question": content.Schema(type=content.Type.STRING),
                                "options": content.Schema(
                                    type=content.Type.ARRAY,
                                    items=content.Schema(type=content.Type.STRING),
                                ),
                                "answer": content.Schema(type=content.Type.STRING),
                                "explanation": content.Schema(type=content.Type.STRING),
                            },
                        ),
                    ),
                },
            ),
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", generation_config=generation_config
        )
        prompt = prompts["practice"]

        response = client.generate_content(model, prompt, uploaded_file)

        try:
            python_obj = json.loads(response)
            logger.debug("Practice exam generated successfully")
            return python_obj
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for practice exam")
            return None

    def generate_keywords(client, uploaded_file):
        logger.info("Generating keywords")
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.85,
            "top_k": 32,
            "max_output_tokens": 8192,
            "response_schema": content.Schema(
                type=content.Type.ARRAY,
                items=content.Schema(
                    type=content.Type.OBJECT,
                    required=["term", "definition"],
                    properties={
                        "term": content.Schema(type=content.Type.STRING),
                        "definition": content.Schema(type=content.Type.STRING),
                    },
                ),
            ),
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", generation_config=generation_config
        )
        prompt = prompts["keywords"]

        response = client.generate_content(model, prompt, uploaded_file)

        try:
            python_obj = json.loads(response)
            logger.debug("Keywords generated successfully")
            return python_obj
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for keywords")
            return None
