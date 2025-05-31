
# Import necessary libraries
from flask import Flask, request, jsonify
import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS
import traceback

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes with more permissive configuration for development
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "https://*.lovableproject.com", "http://localhost:*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables")
    print("Please set GEMINI_API_KEY in your .env file")
else:
    print("GEMINI_API_KEY found, configuring Gemini...")
    genai.configure(api_key=api_key)

# Define the model - Updated to use Gemini-2.0-flash
try:
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("Gemini model initialized successfully")
except Exception as e:
    print(f"Error initializing Gemini model: {e}")
    model = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "gemini_configured": api_key is not None,
        "model_ready": model is not None
    })

@app.route('/api/generate-question', methods=['POST'])
def generate_question():
    """
    Generate a question about protein confidence based on the selected cell and game settings
    """
    try:
        # Check if Gemini is configured
        if not api_key or not model:
            raise Exception("Gemini API not configured properly")
            
        # Get data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        confidence_level = data.get('confidence', 'medium')
        difficulty = data.get('difficulty', 'beginner')
        audience = data.get('audience', 'elementary')
        game_mode = data.get('gameMode', 'challenge')
        
        # Get protein information if provided
        protein_name = data.get('proteinName', '')
        protein_function = data.get('proteinFunction', '')
        
        print(f"Generating question for: {protein_name}, confidence: {confidence_level}, difficulty: {difficulty}")
        
        # Create prompt for Gemini based on settings and protein info
        prompt = f"""
        Generate an educational question about protein structure prediction confidence.
        
        Settings:
        - Difficulty level: {difficulty} (beginner, intermediate, or advanced)
        - Target audience: {audience} (elementary, highSchool, or undergraduate)
        - Game mode: {game_mode} (tutorial, challenge, or explore)
        - The confidence level for the selected part is: {confidence_level} (high, medium, or low)
        
        {f"Protein-specific context:" if protein_name else ""}
        {f"- Protein name: {protein_name}" if protein_name else ""}
        {f"- Protein function: {protein_function}" if protein_function else ""}
        
        Guidelines based on difficulty:
        - For beginner: Very simple questions with straightforward answers, focus on basic understanding
        - For intermediate: More nuanced questions, introduce some protein structure concepts
        - For advanced: Complex questions that explore uncertainty in predictions, domain interactions, etc.
        
        Return the response in this JSON format:
        {{
            "question": "The question text here",
            "options": ["option1", "option2", ...],
            "correctAnswer": "The correct option here"
        }}
        
        The options should include the correct answer and 1-3 incorrect answers, depending on difficulty.
        For beginner, limit to 2 options. For intermediate, use 2-3 options. For advanced, use 3-4 options.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Extract and return the JSON response
        response_text = response.text.strip()
        print(f"Raw Gemini response: {response_text}")
        
        # Try to parse JSON from response
        import json
        try:
            # Try direct JSON parsing first
            json_data = json.loads(response_text)
            return jsonify(json_data)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                json_data = json.loads(json_match.group(1))
                return jsonify(json_data)
            
            # Try to find any JSON-like structure
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                json_data = json.loads(json_match.group(0))
                return jsonify(json_data)
            
            raise Exception("Could not parse JSON from response")
    
    except Exception as e:
        print(f"Error generating question: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
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
                "options": ["Very confident", "Not confident"],
                "correctAnswer": "Very confident" if confidence_level == "high" else "Not confident"
            }
        return jsonify(fallback_response)

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    """
    Generate a quiz about a specific protein based on game settings
    """
    try:
        # Check if Gemini is configured
        if not api_key or not model:
            raise Exception("Gemini API not configured properly")
            
        # Get data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        protein_id = data.get('proteinId', '')
        protein_name = data.get('proteinName', '')
        protein_function = data.get('proteinFunction', '')
        species = data.get('species', '')
        difficulty = data.get('difficulty', 'beginner')
        audience = data.get('audience', 'elementary')
        num_questions = data.get('numQuestions', 5)
        
        print(f"Generating quiz for: {protein_name} ({species}), difficulty: {difficulty}, audience: {audience}")
        
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
        - For advanced: Complex questions requiring synthesis of information, technical terminology, 4-5 options per question
        
        Return the response as a JSON array of question objects in this format:
        [
            {{
                "question": "The question text here",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "The correct option here",
                "explanation": "Detailed explanation of why the correct answer is right"
            }},
            ...additional questions...
        ]
        
        Make sure to return valid JSON only, no extra text or markdown formatting.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        print(f"Raw quiz response: {response_text}")
        
        # Parse JSON response
        import json
        try:
            # Try direct JSON parsing first
            json_data = json.loads(response_text)
            return jsonify(json_data)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                json_data = json.loads(json_match.group(1))
                return jsonify(json_data)
            
            # Try to find any JSON array structure
            json_match = re.search(r'\[[\s\S]*\]', response_text)
            if json_match:
                json_data = json.loads(json_match.group(0))
                return jsonify(json_data)
            
            raise Exception("Could not parse JSON from quiz response")
    
    except Exception as e:
        print(f"Error generating protein quiz: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        # Return a fallback response with some generic questions
        fallback_response = [
            {
                "question": f"What is the main function of {protein_name}?",
                "options": [
                    f"{protein_function}",
                    "Energy production",
                    "DNA replication",
                    "Cell signaling"
                ],
                "correctAnswer": f"{protein_function}",
                "explanation": f"The primary function of {protein_name} is {protein_function}."
            },
            {
                "question": f"Which species does {protein_name} come from in our database?",
                "options": [
                    f"{species}",
                    "Homo sapiens",
                    "Escherichia coli",
                    "Saccharomyces cerevisiae"
                ],
                "correctAnswer": f"{species}",
                "explanation": f"{protein_name} in our database is from {species}."
            }
        ]
        return jsonify(fallback_response)

if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"GEMINI_API_KEY configured: {api_key is not None}")
    app.run(debug=True, host='0.0.0.0', port=5001)
