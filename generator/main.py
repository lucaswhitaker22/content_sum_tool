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
    api_key = "AIzaSyBI-cBe8ClKDTUrJuQ8x2i94OGen6XFbvs"
    client = GeminiClient(api_key)
    
    # Check if content is a string (JSON) and parse it
    if isinstance(content, str):
        try:
            content = json.loads(content)
        except json.JSONDecodeError:
            return json.dumps({"error": "Invalid JSON input"})

    # Ensure metadata exists
    if 'metadata' not in content:
        return json.dumps({"error": "Missing metadata"})

    metadata = content['metadata']
    config = content['config']
    
    # Check for required fields
    required_fields = ['title', 'path', 'course', 'date']
    for field in required_fields:
        if field not in metadata:
            return json.dumps({"error": f"Missing required field: {field}"})

    logger.info(f"Generating lecture for {metadata['title']}")
    file_path = metadata['path']
    temp_file = None
    
    try:
        # Check if the path is a URL
        if urlparse(file_path).scheme in ['http', 'https']:
            # Download the PDF file
            response = requests.get(file_path)
            if response.status_code == 200:
                # Create a temporary file to store the downloaded PDF
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
                temp_file.write(response.content)
                temp_file.close()
                file_path = temp_file.name
            else:
                raise Exception(f"Failed to download PDF from URL: {file_path}")
        
        # Ensure the file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found: {file_path}")
        
        file_content = extract_text_from_pdf(file_path)
        uploaded_file = client.upload_file(file_path)
        client.retrieve_file(uploaded_file)

        # Generate initial metadata
        logger.debug("Generating metadata")
        metadata = Lecture.generate_metadata(client, uploaded_file)

        # Add content_args to the metadata without overwriting existing keys
        for key, value in content.items():
            if key not in metadata:
                metadata[key] = value

        logger.debug("Generating notes")
        notes = Lecture.generate_notes(file_content)

        logger.debug("Generating review")
        review = Lecture.generate_review(client, uploaded_file)

        logger.debug("Generating keywords")
        keywords = Lecture.generate_keywords(client, uploaded_file)

        logger.debug("Generating practice")
        practice = Lecture.generate_practice(client, uploaded_file)

        data = {
            "metadata": metadata,
            "notes": notes,
            "review": review,
            "keywords": keywords,
            "practice": practice,
        }
        return json.dumps(data)

    except Exception as e:
        logger.error(f"Error generating lecture: {str(e)}")
        raise

    finally:
        # Clean up the temporary file if it was created
        if temp_file and os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
             
def gen_html(data):
    logger.info(f"Generating HTML for {data['metadata']['title']}")

    # Generate HTML for topics
    topics_html = ""
    if isinstance(data["metadata"]["topics"], list):
        topics_html = (
            "<ul>"
            + "".join(f"<li>{topic}</li>" for topic in data["metadata"]["topics"])
            + "</ul>"
        )
    else:
        topics_html = str(
            data["metadata"]["topics"]
        )  # fallback to string representation

    # Generate HTML for keywords
    keywords_html = "<dl>"
    for keyword in data["keywords"]:
        keywords_html += f"<dt><strong>{keyword['term']}</strong></dt>"
        keywords_html += f"<dd>{keyword['definition']}</dd>"
    keywords_html += "</dl>"

    html = f"""
    <html>
    <head>
        <title>{data['metadata']['title']}</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                padding: 20px; 
                background-color: #f9f9f9; 
                color: #333; 
            }}
            h1 {{ 
                text-align: center; 
                color: #4CAF50; 
            }}
            h2, h3 {{ 
                color: #333; 
                margin-top: 20px; 
            }}
            p {{ 
                margin: 10px 0; 
            }}
            .collapsible {{ 
                background-color: #4CAF50; 
                color: white; 
                cursor: pointer; 
                padding: 15px; 
                width: 100%; 
                border: none; 
                text-align: left; 
                outline: none; 
                font-size: 16px; 
                border-radius: 5px;
                transition: background-color 0.3s;
            }}
            .collapsible:hover {{ 
                background-color: #45a049; 
            }}
            .collapsible:after {{
                content: '\\002B';
                color: white;
                font-weight: bold;
                float: right;
                margin-left: 5px;
            }}
            .active:after {{
                content: "\\2212";
            }}
            .content {{
                padding: 0 15px;
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.2s ease-out;
                background-color: #e7f3fe;
                border-left: 5px solid #4CAF50;
                margin-bottom: 20px;
                border-radius: 5px;
            }}
            dl {{
                margin-left: 20px;
            }}
            dt {{
                font-weight: bold;
                margin-top: 10px;
            }}
            dd {{
                margin-left: 20px;
                margin-bottom: 10px;
            }}
        </style>
    </head>
    <body>
        <h1>{data['metadata']['title']}</h1>
        <p><strong>Course:</strong> {data['metadata']['course']}</p>
        <p><strong>Date:</strong> {data['metadata']['date']}</p>
        <p><strong>Overview:</strong> {data['metadata']['overview']}</p>
        <p><strong>Topics:</strong></p>
        {topics_html}
        <button class="collapsible">Lecture Notes</button>
        <div class="content">
            {markdown.markdown(data['notes'])}
        </div>

        <button class="collapsible">Keywords and Definitions</button>
        <div class="content">
            {keywords_html}
        </div>

        <button class="collapsible">Review Questions</button>
        <div class="content">
    """

    if "review" in data:
        for qa in data["review"]:
            html += f"<h3>Q: {qa['question']}</h3>"
            html += f"<p>A: {qa['answer']}</p>"

    html += "</div>"

    if "practice" in data:
        html += """
        <button class="collapsible">Practice Exam</button>
        <div class="content">
        """

        if "short" in data["practice"]:
            html += "<h2>Short Answer Questions</h2>"
            for item in data["practice"]["short"]:
                html += f"<h3>Q: {item['question']}</h3>"
                html += f"<p>A: {item['answer']}</p>"

        if "long" in data["practice"]:
            html += "<h2>Long Answer Questions</h2>"
            for item in data["practice"]["long"]:
                html += f"<h3>Q: {item['question']}</h3>"
                html += f"<p>A: {item['answer']}</p>"

        if "multiple" in data["practice"]:
            html += "<h2>Multiple Choice Questions</h2>"
            for item in data["practice"]["multiple"]:
                html += f"<h3>Q: {item['question']}</h3>"
                html += "<ul>"
                for option in item["options"]:
                    html += f"<li>{option}</li>"
                html += "</ul>"
                html += f"<p>Correct Answer: {item['answer']}</p>"
                html += f"<p>Explanation: {item['explanation']}</p>"

        html += "</div>"

    html += """
        <script>
        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                } 
            });
        }
        </script>
    </body>
    </html>
    """

    logger.info(f"HTML generation completed for {data['metadata']['title']}")
    return html

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

    # Generate HTML content
    html_content = gen_html(data)

    # Write the HTML content to a file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)

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