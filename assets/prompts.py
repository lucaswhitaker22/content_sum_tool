prompts = {
    "metadata": """
Analyze the lecture document/presentation and provide:
1. A concise overview (2-3 sentences) capturing the main theme and purpose.
2. List 5-7 key topics in order of appearance, with brief descriptions (1-2 sentences each).
Use specific phrases rather than broad categories for topics. Ensure the overview and topics accurately reflect the lecture's content and structure.
    """,

    "notes": """
Generate comprehensive lecture notes from the document/presentation:
1. Use Markdown formatting with headers (##, ###), lists, and emphasis (**bold**, *italic*).
2. Structure content hierarchically, mirroring the lecture's organization.
3. Include:
   - Key definitions and concepts
   - Relevant examples
   - Formulas or equations (use LaTeX formatting: $$equation$$)
   - Important points or takeaways (highlighted)
5. Create a scannable, easily readable summary suitable for student review.
6. Aim for 1000-1500 words, balancing comprehensiveness with conciseness.
Output in Markdown format.
    """,

    "review": """
Develop a set of review questions based on the lecture content:
1. Create 5-7 questions covering key concepts.
2. Include a mix of question types:
   - Factual recall
   - Conceptual understanding
   - Application of ideas
   - Analysis or comparison
3. For each question, provide:
   - The correct answer
   - A detailed explanation (2-3 sentences)
   - Relevant examples or elaborations from the lecture
4. Progress from simpler to more complex topics.
Format using Markdown, with questions numbered and answers clearly labeled.
    """,

    "practice": """
Design a comprehensive practice exam:
1. Create:
   - 5 multiple-choice questions (4 options each)
   - 3 short-answer questions (requiring 2-3 sentence responses)
   - 2 essay questions (expecting 1-2 paragraph answers)
2. Cover all major lecture topics, varying difficulty levels.
3. For multiple-choice, include plausible distractors.
4. Provide an answer key with:
   - Correct answers for all questions
   - Brief explanations for each answer (1-2 sentences)
Format the exam and answer key in Markdown, clearly separating questions and answers.
    """,

    "keywords": """
Compile a glossary of key terms and concepts:
1. Identify 10-15 important terms or phrases from the lecture.
2. For each entry, provide:
   - A clear, concise definition (1-2 sentences)
   - An example or additional context (where applicable)
3. Organize terms alphabetically.
4. Use Markdown formatting:
   - Bold (**) for terms
   - Italic (*) for emphasis within definitions
Ensure the glossary covers crucial vocabulary and ideas essential for understanding the lecture material.
    """
}