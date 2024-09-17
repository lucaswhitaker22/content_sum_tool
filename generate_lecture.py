
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from client import Client
import json

class Lecture:
    def __init__(self, client):
        self.client= client
    
    def generate_metadata(client, uploaded_files):
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
        You are a given an academic document/presentation
        Generate the following:
        2. Provide a brief overview 
        3. list all key topics covered
        """
        
        response = client.generate_content(model, prompt, uploaded_files)
        # Convert JSON response to Python object
        try:
            python_obj = json.loads(response)
            return python_obj
        except json.JSONDecodeError:
            print("Error: Unable to parse JSON response")
            return None

    def generate_notes(client, uploaded_files):
        generation_config = {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "text/plain"
            }
        
        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        
        prompt = """
        You are a given an academic document/presentation
        Generate detailed notes in MD format.
        """
        
        return client.generate_content(model, prompt, uploaded_files)

    def generate_review(client, uploaded_files):
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_schema": content.Schema(
                    type = content.Type.OBJECT,
                    required = ["review"],
                    properties = {
                    "review": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                        type = content.Type.OBJECT,
                        required = ["question", "answer"],
                        properties = {
                            "question": content.Schema(
                            type = content.Type.STRING,
                            ),
                            "answer": content.Schema(
                            type = content.Type.STRING,
                            ),
                        },
                        ),
                    ),
                    },
                ),
                "response_mime_type": "application/json",
        }
            
        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        
        prompt = """
        You are a given an academic document/presentation
        Generate at least 5 review questions for the content, and provide in detail answers with explanation.
        """
        
        response = client.generate_content(model, prompt, uploaded_files)
    
        # Convert JSON response to Python object
        try:
            python_obj = json.loads(response)
            return python_obj
        except json.JSONDecodeError:
            print("Error: Unable to parse JSON response")
            return None

    def generate_practice(client, uploaded_files):
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
            
        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        
        prompt = """
        You are a given an academic document/presentation
        Generate a practice exam with short, long, and multiple choice questions. Include the answers.
        Format response in MD
        """
        
        return client.generate_content(model, prompt, uploaded_files)
    

    def generate_keywords(client, uploaded_files):
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
            
        model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
        
        prompt = """
        You are a given an academic document/presentation
        Generate a list of terminology/keywords, and give a definition. Format using MD.
        """
        
        return client.generate_content(model, prompt, uploaded_files)