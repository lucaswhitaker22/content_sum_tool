
import os
from client import Client
from datetime import date
from generate_lecture import Lecture
import markdown
content_args = {
    "format": "Lecture",
    "date": date.today(),
    "course":"SYSC 4101",
    "title":"Validation Context"
}

def generate_lecture(client, uploaded_files):
    # Generate initial metadata
    metadata = Lecture.generate_metadata(client, uploaded_files)
    
    # Add content_args to the metadata without overwriting existing keys
    for key, value in content_args.items():
        if key not in metadata:
            metadata[key] = value
    
    notes = Lecture.generate_notes(client, uploaded_files)
    review = Lecture.generate_review(client, uploaded_files)
    keywords = Lecture.generate_keywords(client, uploaded_files)
    practice = Lecture.generate_practice(client, uploaded_files)

    data = {

        "metadata": metadata,
        "notes":notes,
        "review":review,
        "keywords":keywords,
        "practice":practice,
  
    }
    return data

def gen_html(data):
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
    input_directory = "input/"

    client = Client(api_key)
    uploaded_files = client.upload_files(input_directory)
    client.retrieve_files(uploaded_files)

    match content_args['format']:
        case 'Lecture':
            data = generate_lecture(client, uploaded_files)
            output_path = f"output/{data['metadata']['course']}/{data['metadata']['format']}/{data['metadata']['title']}.html"
            output_to_html(data, output_path)

if __name__ == "__main__":
    main()