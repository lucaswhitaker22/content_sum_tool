import google.generativeai as genai
import os
from google.ai.generativelanguage_v1beta.types import content
from client import Client

def generate_metadata(client, uploaded_files):
    generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_schema": content.Schema(
                type=content.Type.OBJECT,
                required=["format", "overview", "topics"],
                properties={
                    "format": content.Schema(type=content.Type.STRING),
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
    1. Document Format (Can be either Lecture, Assingment, or Test)
    2. Provide a brief overview 
    3. list all key topics covered
    """
    
    return client.generate_content(model, prompt, uploaded_files)
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

def main():
    api_key = "AIzaSyDlgPeD6BZ16dVTn9xiKl_vq41U1gzNENI"
    input_directory = "input/"
    
    client = Client(api_key)
    uploaded_files = client.upload_files(input_directory)
    client.retrieve_files(uploaded_files)
    print("\nMetadata: "+generate_metadata(client, uploaded_files))
    print("\nNotes: "+generate_notes(client, uploaded_files))

if __name__ == "__main__":
    main()