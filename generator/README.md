# content_sum_tool
POST localhost:3000/api/lectures/generate
BEARER TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmMxNTdjMTJjZWFlZTYzMTk5MGJlMSIsImlhdCI6MTcyODY2MTM1NSwiZXhwIjoxNzI4NzQ3NzU1fQ._ntmmqmhn_7L43NfWL2iHwDVYZFZT8yppOFmaugcksg
{
    "metadata": {
        "format": "Lecture",
        "date": "2024-10-11",
        "course": "66fc560c59419f396fc8a98c",
        "title": "test",
        "path": "http://localhost:3000/api/uploads/pdf-1728661574953-425549621.pdf"
    },
    "config": {
        "metadata_overview_sentences": [4, 6],
        "metadata_key_topics": [5, 7],
        "metadata_topic_description_sentences": [1, 2],
        "notes_word_count_range": [1000, 2000],
        "review_question_count": [5, 7],
        "review_answer_explanation_sentences": [1, 2],
        "practice_multiple_choice_count": 5,
        "practice_multiple_choice_options": 4,
        "practice_short_answer_count": [2, 3],
        "practice_long_answer_count": [1, 2],
        "practice_answer_explanation_sentences": [1, 2],
        "keywords_term_count": [10, 15],
        "keywords_definition_sentences": [1, 2]
    }
}