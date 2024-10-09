def generate_prompts(
            metadata_overview_sentences=(4, 6),
            metadata_key_topics=(5, 7),
            metadata_topic_description_sentences=(1, 2),
            notes_word_count_range=(1000, 2000),
            review_question_count=(5, 7),
            review_answer_explanation_sentences=(1, 2),
            practice_multiple_choice_count=5,
            practice_multiple_choice_options=4,
            practice_short_answer_count=(2, 3),
            practice_long_answer_count=(1, 2),
            practice_answer_explanation_sentences=(1, 2),
            keywords_term_count=(10, 15),
            keywords_definition_sentences=(1, 2)
    ):
    prompts = {
        "metadata": f"""
Review the lecture outline or slides to identify the core content and provide:
1. A concise overview of the lecture's main focus and objectives ({metadata_overview_sentences[0]}-{metadata_overview_sentences[1]} sentences).
2. List {metadata_key_topics[0]}-{metadata_key_topics[1]} key topics in order of appearance, with brief descriptions ({metadata_topic_description_sentences[0]}-{metadata_topic_description_sentences[1]} sentences each).
Use specific terminology from the field of study. Ensure the overview and topics accurately reflect the lecture's content and structure.
        """,

        "notes": f"""
Generate comprehensive lecture notes from the PDF:
1. Use Markdown formatting with headers (#, ##, ###) lists, and emphasis (**bold**, *italic*).
2. Structure content hierarchically, following the lecture's organization.
3. Include:
   - Key definitions and concepts
   - Elaborate or add more information when needed
   - Use full sentences/paragraphs/steps when suitable
   - Relevant examples or case studies
   - Formulas, code or equations (use LaTeX formatting: $$equation$$)
   - Include tables when useful
   - Important points or takeaways (highlighted as **Key Takeaway:** )
4. Create a scannable, easily readable summary suitable for student review.
5. Aim for {notes_word_count_range[0]}-{notes_word_count_range[1]} words, balancing detail with conciseness.
Output in Markdown format.
        """,

        "review": f"""
Develop a set of review questions based on the lecture content:
1. Create {review_question_count[0]}-{review_question_count[1]} questions covering key concepts from the lecture.
2. Include a mix of question types:
   - Factual recall
   - Conceptual understanding
   - Application of ideas
   - Analysis or comparison
3. For each question, provide:
   - The question itself
   - The correct answer
   - A brief explanation ({review_answer_explanation_sentences[0]}-{review_answer_explanation_sentences[1]} sentences)
4. Ensure questions progress from fundamental concepts to more advanced topics.
Format as JSON
        """,

        "practice": f"""
Design a practice assessment based on the lecture content:
1. Create:
   - {practice_multiple_choice_count} multiple-choice questions ({practice_multiple_choice_options} options each)
   - {practice_short_answer_count[0]}-{practice_short_answer_count[1]} short-answer questions (requiring brief responses)
   - {practice_long_answer_count[0]}-{practice_long_answer_count[1]} long-answer questions (expecting more detailed responses)
2. Cover all major lecture topics, varying difficulty levels.
3. For multiple-choice, include plausible distractors based on common misconceptions.
4. Provide an answer key with:
   - Correct answers for all questions
   - Brief explanations for each answer ({practice_answer_explanation_sentences[0]}-{practice_answer_explanation_sentences[1]} sentences)
Format as a JSON object with 'multiple', 'short', and 'long' keys, each containing an array of question objects.
        """,

        "keywords": f"""
Compile a glossary of key terms and concepts from the lecture:
1. Identify {keywords_term_count[0]}-{keywords_term_count[1]} important terms or phrases.
2. For each entry, provide:
   - The term itself
   - A clear, concise definition ({keywords_definition_sentences[0]}-{keywords_definition_sentences[1]} sentences)
3. Focus on terms that are crucial for understanding the lecture material.
4. Include any acronyms or specialized vocabulary used in the lecture.
Output as a JSON array, with each object containing 'term' and 'definition' keys.
        """
    }
    
    return prompts

# Example usage:
default_prompts = generate_prompts()

custom_prompts = generate_prompts(
    metadata_overview_sentences=(3, 5),
    notes_word_count_range=(800, 1500),
    review_question_count=(4, 6),
    practice_multiple_choice_count=4,
    keywords_term_count=(8, 12)
)