prompts = {
    "metadata": """
Review the lecture outline or slides to identify the core content and provide:
1. A concise overview of the lecture's main focus and objectives (4-6 sentences).
2. List 5-7 key topics in order of appearance, with brief descriptions (1-2 sentences each).
Use specific terminology from the field of study. Ensure the overview and topics accurately reflect the lecture's content and structure.
    """,

    "notes": """
Generate comprehensive lecture notes from the PDF:
1. Use Markdown formatting with headers (#, ##, ###) lists, and emphasis (**bold**, *italic*).
2. Structure content hierarchically, following the lecture's organization.
3. Include:
   - Key definitions and concepts
   - Elaborate or add more information when needed
   - Use full sentences/paragraphs when suitable
   - Relevant examples or case studies
   - Formulas or equations (use LaTeX formatting: $$equation$$)
   - Include tables when useful
   - Important points or takeaways (highlighted as **Key Takeaway:** )
4. Create a scannable, easily readable summary suitable for student review.
5. Aim for 1000-2000 words, balancing detail with conciseness.
Output in Markdown format.
    """,
    "review": """
Develop a set of review questions based on the lecture content:
1. Create 5-7 questions covering key concepts from the lecture.
2. Include a mix of question types:
   - Factual recall
   - Conceptual understanding
   - Application of ideas
   - Analysis or comparison
3. For each question, provide:
   - The question itself
   - The correct answer
   - A brief explanation (1-2 sentences)
4. Ensure questions progress from fundamental concepts to more advanced topics.
Format as JSON
    """,

    "practice": """
Design a practice assessment based on the lecture content:
1. Create:
   - 5 multiple-choice questions (4 options each)
   - 2-3 short-answer questions (requiring brief responses)
   - 1-2 long-answer questions (expecting more detailed responses)
2. Cover all major lecture topics, varying difficulty levels.
3. For multiple-choice, include plausible distractors based on common misconceptions.
4. Provide an answer key with:
   - Correct answers for all questions
   - Brief explanations for each answer (1-2 sentences)
Format as a JSON object with 'multiple', 'short', and 'long' keys, each containing an array of question objects.
    """,

    "keywords": """
Compile a glossary of key terms and concepts from the lecture:
1. Identify 10-15 important terms or phrases.
2. For each entry, provide:
   - The term itself
   - A clear, concise definition (1-2 sentences)
3. Focus on terms that are crucial for understanding the lecture material.
4. Include any acronyms or specialized vocabulary used in the lecture.
Output as a JSON array, with each object containing 'term' and 'definition' keys.
    """
}