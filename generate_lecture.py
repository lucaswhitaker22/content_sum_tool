import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from client import Client
import json
import logging
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
class Lecture:
    def __init__(self, client):
        self.client = client

    def generate_metadata(client, uploaded_files):
        logger.info("Generating metadata")
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
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

        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        prompt = """
        Analyze the given lecture document/presentation and provide:
        1. A concise yet comprehensive overview (2-3 sentences)
        2. A list of 5-7 key topics covered, in order of appearance. Give a brief explanation for each topic.
        Ensure the overview captures the main theme and purpose of the lecture. For topics, use clear and specific phrases rather than broad categories.
        """

        response = client.generate_content(model, prompt, uploaded_files)

        try:
            python_obj = json.loads(response)
            logger.debug("Metadata generated successfully")
            return python_obj
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for metadata")
            return None

    def generate_notes(client, uploaded_files):
        logger.info("Generating notes")
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain"
        }

        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        prompt = """
        Create detailed lecture notes from the given academic document/presentation:
        1. Use clear Markdown formatting with appropriate headers, lists, and emphasis
        2. Organize content hierarchically, reflecting the structure of the lecture
        3. Include key definitions, concepts, examples, and any formulas or equations
        4. Highlight important points or takeaways
        5. If applicable, note any areas that may require further research or clarification
        6. Aim for a comprehensive yet concise summary that a student could use for review
        Format the notes to be easily readable and scannable. Output as MD.
        """

        notes = client.generate_content(model, prompt, uploaded_files)
        logger.debug("Notes generated successfully")
        return notes

    def generate_review(client, uploaded_files):
        logger.info("Generating review questions")
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
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

        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        prompt = """
        Create a set of review questions based on the provided lecture document/presentation:
        1. Generate at least 7 questions covering key concepts from the lecture
        2. Include a mix of question types:
        - Factual recall
        - Conceptual understanding
        - Application of ideas
        - Analysis or comparison questions
        3. Provide detailed answers for each question, including:
        - The correct response
        - A thorough explanation of why it's correct
        - Any relevant examples or elaborations from the lecture material
        4. Ensure questions progress from simpler to more complex topics
        Aim to create questions that would effectively test and reinforce understanding of the lecture content.
        """

        response = client.generate_content(model, prompt, uploaded_files)

        try:
            python_obj = json.loads(response)
            logger.debug("Review questions generated successfully")
            return python_obj['review']
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for review questions")
            return None

    def generate_practice(client, uploaded_files):
        logger.info("Generating practice exam")
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
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

        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        prompt = """
        Design a comprehensive practice exam based on the lecture document/presentation:
        1. Create a balanced mix of question types:
        - 5 multiple choice questions
        - 3 short answer questions (2-3 sentences each)
        - 2 long answer/essay questions
        2. Ensure questions cover all major topics from the lecture
        3. Vary the difficulty level, including some challenging questions
        4. For multiple choice, include plausible distractors
        5. Provide a detailed answer key with:
        - Correct answers for all questions
        - Explanations for why each answer is correct
        Format the exam and answer key clearly using Markdown, as if preparing it for students to use.
        """

        response = client.generate_content(model, prompt, uploaded_files)

        try:
            python_obj = json.loads(response)
            logger.debug("Practice exam generated successfully")
            return python_obj
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for practice exam")
            return None

    def generate_keywords(client, uploaded_files):
        logger.info("Generating keywords")
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
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

        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        prompt = """
        Create a glossary of new/advanced key terms and concepts from the lecture document/presentation:
        1. Identify 10-15 important terms, phrases, or concepts
        2. For each entry, provide:
        - The term in bold
        - A clear, concise definition (1-2 sentences)
        - If applicable, an example or additional context
        3. Organize terms alphabetically or by order of appearance in the lecture
        4. Use Markdown formatting for clarity and readability
        Ensure the glossary covers the most crucial vocabulary and ideas a student would need to understand the lecture material.
        """

        response = client.generate_content(model, prompt, uploaded_files)

        try:
            python_obj = json.loads(response)
            logger.debug("Keywords generated successfully")
            return python_obj
        except json.JSONDecodeError:
            logger.error("Error: Unable to parse JSON response for keywords")
            return None