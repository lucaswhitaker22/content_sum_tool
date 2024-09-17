import google.generativeai as genai
import os

class Client:
    def __init__(self, api_key):
        self.api_key = api_key
        self.configure_genai()

    def configure_genai(self):
        genai.configure(api_key=self.api_key)

    def upload_file(self, file_path):
        filename = os.path.basename(file_path)
        sample_file = genai.upload_file(path=file_path, display_name=filename)
        return sample_file

    def retrieve_file(self, uploaded_file):
        file = genai.get_file(name=uploaded_file.name)
        return file

    def generate_content(self, model, prompt, uploaded_file):
        content_list = [prompt, uploaded_file]
        response = model.generate_content(content_list)
        return response.text