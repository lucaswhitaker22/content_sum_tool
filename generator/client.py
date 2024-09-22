import google.generativeai as genai
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
class Client:
    # Configure logging
    def __init__(self, api_key):
        self.api_key = api_key
        self.configure_genai()
        logger = logging.getLogger(__name__)

    def configure_genai(self):
        genai.configure(api_key=self.api_key)
        logger.info("GenAI configured with API key")

    def upload_file(self, file_path):
        filename = os.path.basename(file_path)
        logger.info(f"Uploading file: {filename}")
        sample_file = genai.upload_file(path=file_path, display_name=filename)
        logger.debug(f"File uploaded successfully: {filename}")
        return sample_file

    def retrieve_file(self, uploaded_file):
        logger.info(f"Retrieving file: {uploaded_file.name}")
        file = genai.get_file(name=uploaded_file.name)
        logger.debug(f"File retrieved successfully: {uploaded_file.name}")
        return file

    def generate_content(self, model, prompt, uploaded_file):
        logger.info("Generating content")
        content_list = [prompt, uploaded_file]
        response = model.generate_content(content_list)
        logger.debug("Content generated successfully")
        return response.text