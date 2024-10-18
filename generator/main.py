import os
import sys
from client import GeminiClient
from generate_lecture import Lecture
import markdown
import requests
import json
import logging
from datetime import date, timedelta, datetime
import tempfile
from urllib.parse import urlparse
import fitz  # PyMuPDF
from assets.prompts import generate_prompts

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


"""
    {
        "format": "Lecture",
        "date": datetime.strptime("09/12/24","%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Definitions 1",
        "path":"input/SYSC4101-5105_Definitions_PI.pdf"
    },
    {
        "format": "Lecture",
        "date": datetime.strptime("09/17/24", "%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Definitions 2",
        "path":"input/SYSC4101-5105_Definitions_PII.pdf"
    },
    {
        "format": "Lecture",
        "date": datetime.strptime("09/19/24", "%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Input Domain",
        "path":"input/SYSC4101-5105_InputDomainTesting_PI.pdf"
    }
"""
content_args_list = [
    {
        "format": "Lecture",
        "date": datetime.strptime("09/10/24", "%m/%d/%y"),
        "course": "SYSC 4101",
        "title": "Context",
        "path": "generator/input/SYSC4101-5105_Context.pdf",
    },
    {
        "format": "Lecture",
        "date": datetime.strptime("09/12/24","%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Definitions 1",
        "path":"generator/input/SYSC4101-5105_Definitions_PI.pdf"
    },
        {
        "format": "Lecture",
        "date": datetime.strptime("09/17/24", "%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Definitions 2",
        "path":"input/SYSC4101-5105_Definitions_PII.pdf"
    },
    {
        "format": "Lecture",
        "date": datetime.strptime("09/19/24", "%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Input Domain",
        "path":"input/SYSC4101-5105_InputDomainTesting_PI.pdf"
    }
]


def generate_lecture(content):
    logger.info("Starting generate_lecture function")
    api_key = "AIzaSyBI-cBe8ClKDTUrJuQ8x2i94OGen6XFbvs"
    client = GeminiClient(api_key)
    
    logger.debug(f"Received content: {content}")
    
    # Check if content is a string (JSON) and parse it
    if isinstance(content, str):
        try:
            content = json.loads(content)
            logger.debug("Successfully parsed JSON content")
        except json.JSONDecodeError:
            logger.error("Failed to parse JSON content")
            return json.dumps({"error": "Invalid JSON input"})

    # Ensure metadata exists
    if 'metadata' not in content:
        logger.error("Missing metadata in content")
        return json.dumps({"error": "Missing metadata"})

    metadata = content['metadata']
    config = content['config']
    logger.info(config)
    
    prompts = generate_prompts(config)

    logger.debug(f"Metadata: {metadata}")
    logger.debug(f"Config: {config}")
    
    # Check for required fields
    required_fields = ['title', 'path', 'course', 'date']
    for field in required_fields:
        if field not in metadata:
            logger.error(f"Missing required field: {field}")
            return json.dumps({"error": f"Missing required field: {field}"})

    logger.info(f"Generating lecture for {metadata['title']}")
    file_path = metadata['path']
    temp_file = None
    
    try:
        # Check if the path is a URL
        if urlparse(file_path).scheme in ['http', 'https']:
            logger.info(f"Downloading PDF from URL: {file_path}")
            # Download the PDF file
            response = requests.get(file_path)
            if response.status_code == 200:
                # Create a temporary file to store the downloaded PDF
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
                temp_file.write(response.content)
                temp_file.close()
                file_path = temp_file.name
                logger.info(f"PDF downloaded and saved to temporary file: {file_path}")
            else:
                logger.error(f"Failed to download PDF from URL: {file_path}")
                raise Exception(f"Failed to download PDF from URL: {file_path}")
        
        # Ensure the file exists
        if not os.path.exists(file_path):
            logger.error(f"PDF file not found: {file_path}")
            raise FileNotFoundError(f"PDF file not found: {file_path}")
        
        logger.info("Extracting text from PDF")
        file_content = extract_text_from_pdf(file_path)
        logger.debug(f"Extracted text length: {len(file_content)} characters")

        logger.info("Uploading file to client")
        uploaded_file = client.upload_file(file_path)
        logger.info("Retrieving file from client")
        client.retrieve_file(uploaded_file)


        # Generate initial metadata
        logger.info("Generating metadata")
        metadata = Lecture.generate_metadata(client, uploaded_file, prompts)
        logger.debug(f"Generated metadata: {metadata}")

        # Add content_args to the metadata without overwriting existing keys
        for key, value in content.items():
            if key not in metadata:
                metadata[key] = value
        logger.debug(f"Updated metadata: {metadata}")

        logger.info("Generating notes")
        notes = Lecture.generate_notes(file_content,prompts)
        logger.debug(f"Generated notes length: {len(notes)} characters")

        logger.info("Generating review")
        review = Lecture.generate_review(client, uploaded_file,prompts)
        logger.debug(f"Generated review: {review}")

        logger.info("Generating keywords")
        keywords = Lecture.generate_keywords(client, uploaded_file,prompts)
        logger.debug(f"Generated keywords: {keywords}")

        logger.info("Generating practice")
        practice = Lecture.generate_practice(client, uploaded_file,prompts)
        logger.debug(f"Generated practice: {practice}")

        data = {
            "metadata": metadata,
            "notes": notes,
            "review": review,
            "keywords": keywords,
            "practice": practice,
        }
        logger.info("Successfully generated all lecture components")
        return json.dumps(data)

    except Exception as e:
        logger.exception(f"Error generating lecture: {str(e)}")
        raise

    finally:
        # Clean up the temporary file if it was created
        if temp_file and os.path.exists(temp_file.name):
            logger.info(f"Cleaning up temporary file: {temp_file.name}")
            os.unlink(temp_file.name)

    logger.info("Finished generate_lecture function")
             
def extract_text_from_pdf(file_path):
    text = ""
    try:
        # Open the PDF file
        doc = fitz.open(file_path)
        
        # Iterate through each page
        for page in doc:
            # Extract text from the page
            text += page.get_text()
        
        # Close the document
        doc.close()
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
    
    return text

def output_to_html_and_json(data, output_path):
    # Ensure the output directory exists for JSON
    json_output_path = output_path.replace(".html", ".json").replace(
        "/output/", "/output/json/"
    )
    os.makedirs(os.path.dirname(json_output_path), exist_ok=True)

    # Prepare data for JSON serialization
    json_data = {
        "metadata": {
            "overview": data["metadata"]["overview"],
            "topics": data["metadata"]["topics"],
            "format": data["metadata"]["format"],
            "date": data["metadata"]["date"].isoformat(),
            "course": data["metadata"]["course"],
            "title": data["metadata"]["title"],
            "path": data["metadata"]["path"],
        },
        "notes": data["notes"],
        "review": data["review"],
        "keywords": data["keywords"],
        "practice": data["practice"],
    }

    # Write the data to a JSON file (overwriting if it exists)
    with open(json_output_path, "w", encoding="utf-8") as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)

    print(f"JSON file created/updated: {json_output_path}")
    print(f"HTML file created: {output_path}")

def generate_from_input():
    api_key = "AIzaSyBI-cBe8ClKDTUrJuQ8x2i94OGen6XFbvs"
    client = GeminiClient(api_key)
    logger.info("Starting lecture generation process")
    for content_args in content_args_list:
        logger.info(f"Processing {content_args['title']}")
        file_path = content_args["path"]
        match content_args["format"]:
            case "Lecture":
                data = generate_lecture(
                    file_path, content_args
                )
                output_path = f"generator/output/{data['metadata']['course']}/{data['metadata']['format']}/{data['metadata']['title']}.html"
                output_to_html_and_json(data, output_path)
                logger.info(f"Saved HTML and JSON files")

    logger.info("Lecture generation process completed")

def main():
    #generate_from_input()
    content = {
        "format": "Lecture",
        "date": datetime.strptime("09/19/24", "%m/%d/%y"),
        "course":"SYSC 4101",
        "title":"Input Domain",
        "path":"generator/input/SYSC4101-5105_InputDomainTesting_PI.pdf"
    }
    generate_lecture(content)

default_config = {
    'metadata_overview_sentences': (4, 6),
    'metadata_key_topics': (5, 7),
    'metadata_topic_description_sentences': (1, 2),
    'notes_word_count_range': (1000, 2000),
    'review_question_count': (5, 7),
    'review_answer_explanation_sentences': (1, 2),
    'practice_multiple_choice_count': 5,
    'practice_multiple_choice_options': 4,
    'practice_short_answer_count': (2, 3),
    'practice_long_answer_count': (1, 2),
    'practice_answer_explanation_sentences': (1, 2),
    'keywords_term_count': (10, 15),
    'keywords_definition_sentences': (1, 2)
}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python main.py '<content_json>'", file=sys.stderr)
        sys.exit(1)

    try:
        content_json = sys.argv[1]
        content = json.loads(content_json)
        result = generate_lecture(content)
        print(result)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)