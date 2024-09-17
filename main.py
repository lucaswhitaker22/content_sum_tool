
import os
from client import Client
from datetime import date
from generate_lecture import Lecture
import markdown
import os
from client import Client
from datetime import date
from generate_lecture import Lecture
import markdown
import logging
from datetime import date, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

content_args_list = [
    {
        "format": "Lecture",
        "date": date.today()- timedelta(days=7),
        "course":"SYSC 4101",
        "title":"Definitions 1",
        "path":"input/SYSC4101-5105_Definitions_PI.pdf"
    },
    {
        "format": "Lecture",
        "date": date.today()- timedelta(days=4),
        "course":"SYSC 4101",
        "title":"Definitions 2",
        "path":"input/SYSC4101-5105_Definitions_PII.pdf"
    },
    {
        "format": "Lecture",
        "date": date.today(),
        "course":"SYSC 4101",
        "title":"Input Domain",
        "path":"input/SYSC4101-5105_InputDomainTesting_PI.pdf"
    }
]

def generate_lecture(client, content, uploaded_files):
    logger.info(f"Generating lecture for {content['title']}")
    
    # Generate initial metadata
    logger.debug("Generating metadata")
    metadata = Lecture.generate_metadata(client, uploaded_files)
    
    # Add content_args to the metadata without overwriting existing keys
    for key, value in content.items():
        if key not in metadata:
            metadata[key] = value
    
    logger.debug("Generating notes")
    notes = Lecture.generate_notes(client, uploaded_files)
    
    logger.debug("Generating review")
    review = Lecture.generate_review(client, uploaded_files)
    
    logger.debug("Generating keywords")

    keywords = Lecture.generate_keywords(client, uploaded_files)
    
    logger.debug("Generating practice")
    practice = Lecture.generate_practice(client, uploaded_files)
    
    data = {
        "metadata": metadata,
        "notes": notes,
        "review": review,
        "keywords": keywords,
        "practice": practice,
    }
    
    logger.info(f"Lecture generation completed for {content['title']}")
    return data

def gen_html(data):
    logger.info(f"Generating HTML for {data['metadata']['title']}")
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
        </style>
    </head>
    <body>
        <h1>{data['metadata']['title']}</h1>
        <p><strong>Course:</strong> {data['metadata']['course']}</p>
        <p><strong>Date:</strong> {data['metadata']['date']}</p>
        <p><strong>Overview:</strong> {data['metadata']['overview']}</p>

        <button class="collapsible">Lecture Notes</button>
        <div class="content">
            {markdown.markdown(data['notes'])}
        </div>

        <button class="collapsible">Keywords and Definitions</button>
        <div class="content">
            {markdown.markdown(data['keywords'])}
        </div>

        <button class="collapsible">Review Questions</button>
        <div class="content">
    """
    
    if 'review' in data and 'review' in data['review']:
        for qa in data['review']['review']:
            html += f"<h3>Q: {qa['question']}</h3>"
            html += f"<p>A: {qa['answer']}</p>"
    
    html += "</div>"
    
    if 'practice' in data:
        html += """
        <button class="collapsible">Practice Exam</button>
        <div class="content">
        """
        html += markdown.markdown(data['practice'])
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

def output_to_html(data, output_path):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Generate HTML content
    html_content = gen_html(data)
    
    # Write the HTML content to a file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"HTML file created: {output_path}")

def main():
    api_key = "AIzaSyDlgPeD6BZ16dVTn9xiKl_vq41U1gzNENI"
    client = Client(api_key)
    logger.info("Starting lecture generation process")
    for content_args in content_args_list:
        logger.info(f"Processing {content_args['title']}")
        file_path = content_args['path']
        uploaded_file = client.upload_file(file_path)
        client.retrieve_file(uploaded_file)

        match content_args['format']:
            case 'Lecture':
                data = generate_lecture(client, content_args, uploaded_file)
                output_path = f"output/{data['metadata']['course']}/{data['metadata']['format']}/{data['metadata']['title']}.html"
                output_to_html(data, output_path)
                logger.info(f"Saved HTML to {output_path}")

    logger.info("Lecture generation process completed")

if __name__ == "__main__":
    main()