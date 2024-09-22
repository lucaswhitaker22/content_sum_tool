import google.generativeai as genai
import os
import logging
import requests
import json


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PerplexityClient:
    def __init__(self):

        logger = logging.getLogger(__name__)



    '''[
        {
            "role": "system",
            "content": "Be precise and concise."
        },
        {
            "role": "user",
            "content": "How many stars are there in our galaxy?"
        }
    ]'''
    def generate(self,messages):
        
        url = "https://api.perplexity.ai/chat/completions"
        
        payload = {
            "model": "llama-3.1-sonar-large-128k-chat",
            "messages": messages,
            "temperature": 0.2,
            "top_p": 0.9,
            "return_related_questions": False,
            "top_k": 0,
            "stream": False,
            "presence_penalty": 0,
            "frequency_penalty": 1
        }
        headers = {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        }

        response = requests.request("POST", url, json=payload, headers=headers)
        
        content = json.loads(response.text)['choices'][0]['message']['content']
        return content

        
        