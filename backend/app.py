
# Import necessary libraries
from flask import Flask, request, jsonify
import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=api_key)

# Define the model
model = genai.GenerativeModel('gemini-1.5-pro')

@app.route('/api/generate-question', methods=['POST'])
def generate_question():
    """
    Generate a question about protein confidence based on the selected cell and game settings
    """
    try:
        # Get data from request
        data = request.get_json()
        confidence_level = data.get('confidence', 'medium')
        row = data.get('row', 0)
        col = data.get('col', 0)
        difficulty = data.get('difficulty', 'beginner')
        audience = data.get('audience', 'elementary')
        game_mode = data.get('gameMode', 'challenge')
        
        # Get protein information if provided
        protein_name = data.get('proteinName', '')
        protein_function = data.get('proteinFunction', '')
        map_type = data.get('mapType', 'full')
        
        # Create prompt for Gemini based on settings and protein info
        prompt = f"""
        Generate an educational question about protein structure prediction confidence.
        
        Settings:
        - Difficulty level: {difficulty} (beginner, intermediate, or advanced)
        - Target audience: {audience} (elementary, highSchool, or undergraduate)
        - Game mode: {game_mode} (tutorial, challenge, or explore)
        - The confidence level for the selected part is: {confidence_level} (high, medium, or low)
        - This corresponds to position [{row}, {col}] in the PAE map
        
        {f"Protein-specific context:" if protein_name else ""}
        {f"- Protein name: {protein_name}" if protein_name else ""}
        {f"- Protein function: {protein_function}" if protein_function else ""}
        {f"- PAE map type: {map_type} (full protein, domain-specific, or subunit interface)" if map_type else ""}
        
        Guidelines based on difficulty:
        - For beginner: Very simple questions with straightforward answers, focus on basic understanding
        - For intermediate: More nuanced questions, introduce some protein structure concepts
        - For advanced: Complex questions that explore uncertainty in predictions, domain interactions, etc.
        
        Guidelines based on audience:
        - For elementary: Use simple language, avoid technical terms, focus on intuitive understanding
        - For highSchool: Can use some technical terms with explanations
        - For undergraduate: Can use appropriate technical language for biology/biochemistry students
        
        Guidelines based on game mode:
        - For tutorial: Include some educational content in the question itself
        - For challenge: Focus on testing knowledge
        - For explore: Focus on interesting facts and insights about protein structure prediction
        
        Return the response in this JSON format:
        {{
            "question": "The question text here",
            "options": ["option1", "option2", ...],
            "correctAnswer": "The correct option here"
        }}
        
        The options should include the correct answer and 1-3 incorrect answers, depending on difficulty.
        For beginner, limit to 2 options. For intermediate, use 2-3 options. For advanced, use 3-4 options.
        
        If this is a real protein (e.g., {protein_name}), include that context in the question and make it
        relevant to the protein's structure and function when appropriate.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Extract and return the JSON response
        return response.text
    
    except Exception as e:
        print(f"Error: {str(e)}")
        # Fallback response based on difficulty
        if difficulty == 'advanced':
            fallback_response = {
                "question": f"What can we infer about the protein structure based on this {confidence_level} confidence region?",
                "options": ["This region is likely well-structured and correctly predicted", 
                           "This region may contain prediction errors", 
                           "This region is likely disordered"],
                "correctAnswer": "This region is likely well-structured and correctly predicted" if confidence_level == "high" else 
                                "This region may have some flexibility" if confidence_level == "medium" else 
                                "This region may contain prediction errors"
            }
        elif difficulty == 'intermediate':
            fallback_response = {
                "question": f"What does this {confidence_level} confidence value tell us?",
                "options": ["High certainty in the prediction", 
                           "Medium certainty in the prediction", 
                           "Low certainty in the prediction"],
                "correctAnswer": "High certainty in the prediction" if confidence_level == "high" else 
                                "Medium certainty in the prediction" if confidence_level == "medium" else 
                                "Low certainty in the prediction"
            }
        else:  # beginner
            fallback_response = {
                "question": f"How confident are we about this part of the protein?",
                "options": ["Very confident", "Somewhat confident", "Not confident"],
                "correctAnswer": "Very confident" if confidence_level == "high" else 
                                "Somewhat confident" if confidence_level == "medium" else 
                                "Not confident"
            }
        return jsonify(fallback_response)

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    """
    Generate a quiz about a specific protein based on game settings
    """
    try:
        # Get data from request
        data = request.get_json()
        protein_id = data.get('proteinId', '')
        protein_name = data.get('proteinName', '')
        protein_function = data.get('proteinFunction', '')
        species = data.get('species', '')
        difficulty = data.get('difficulty', 'beginner')
        audience = data.get('audience', 'elementary')
        num_questions = data.get('numQuestions', 5)
        
        # Create prompt for Gemini based on protein info and settings
        prompt = f"""
        Generate an educational quiz about the protein {protein_name} from {species}.
        
        Protein Context:
        - Name: {protein_name}
        - Species: {species}
        - Function: {protein_function}
        
        Settings:
        - Difficulty level: {difficulty} (beginner, intermediate, or advanced)
        - Target audience: {audience} (elementary, highSchool, or undergraduate)
        - Number of questions: {num_questions}
        
        Guidelines based on difficulty:
        - For beginner: Simple questions with clear answers, basic terminology, 3-4 options per question
        - For intermediate: More specific questions requiring deeper understanding, 4 options per question
        - For advanced: Complex questions requiring synthesis of information, technical terminology, 5 options per question
        
        Guidelines based on audience:
        - For elementary: Simple language, visual concepts, focus on basic functions
        - For highSchool: Some scientific terminology with explanations, link to biology curriculum concepts
        - For undergraduate: Appropriate scientific and biochemical terminology, deeper mechanisms
        
        For each question:
        1. The question should test understanding of the protein's structure, function, or biological role
        2. Include one correct answer and several plausible but incorrect answers
        3. Provide a clear explanation for why the correct answer is right and why the other options are wrong
        
        Return the response as a JSON array of question objects in this format:
        [
            {{
                "question": "The question text here",
                "options": ["option1", "option2", "option3", "option4", "option5"],
                "correctAnswer": "The correct option here",
                "explanation": "Detailed explanation of why the correct answer is right and why other options are wrong"
            }},
            ...additional questions...
        ]
        
        Make the questions engaging, educational, and appropriate for the target audience.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Extract and return the JSON response
        return response.text
    
    except Exception as e:
        print(f"Error: {str(e)}")
        # Return a fallback response with some generic questions
        fallback_response = [
            {
                "question": f"What is the main function of {protein_name}?",
                "options": [
                    f"{protein_function}",
                    "Energy production",
                    "DNA replication",
                    "Cell signaling",
                    "Immune defense"
                ],
                "correctAnswer": f"{protein_function}",
                "explanation": f"The primary function of {protein_name} is {protein_function}. The other options describe different functions performed by other proteins."
            },
            {
                "question": f"Which of these is NOT true about {protein_name}?",
                "options": [
                    f"{protein_name} is involved in quantum tunneling",
                    f"{protein_name} is found in {species}",
                    f"{protein_name} has a specific 3D structure",
                    f"{protein_name} is made up of amino acids",
                    f"{protein_name} has a biological function"
                ],
                "correctAnswer": f"{protein_name} is involved in quantum tunneling",
                "explanation": f"While {protein_name} is found in {species}, has a specific 3D structure, is made of amino acids, and has biological functions, it is not involved in quantum tunneling, which is a physics concept not typically associated with protein function."
            }
        ]
        return jsonify(fallback_response)

if __name__ == '__main__':
    app.run(debug=True)
