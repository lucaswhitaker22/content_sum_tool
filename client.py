import google.generativeai as genai
import os
from google.ai.generativelanguage_v1beta.types import content
class Client:
    def __init__(self, api_key):
        self.api_key = api_key
        self.configure_genai()

    def configure_genai(self):
        genai.configure(api_key=self.api_key)

    def upload_files(self, input_directory):
        uploaded_files = []
        for filename in os.listdir(input_directory):
            if filename.lower().endswith('.pdf'):
                file_path = os.path.join(input_directory, filename)
                sample_file = genai.upload_file(path=file_path, display_name=filename)
                print(f"Uploaded file '{sample_file.display_name}' as: {sample_file.uri}")
                uploaded_files.append(sample_file)
        return uploaded_files

    def retrieve_files(self, uploaded_files):
        for sample_file in uploaded_files:
            file = genai.get_file(name=sample_file.name)
            print(f"Retrieved file '{file.display_name}' as: {sample_file.uri}")

    def generate_content(self, model, prompt, uploaded_files):
        content_list = [prompt] + uploaded_files
        print("Generating content...")
        response = model.generate_content(content_list)
        return response.text