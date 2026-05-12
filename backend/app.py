
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

# Audience language guidelines
AUDIENCE_GUIDELINES = {
    "elementary": (
        "Write like you're explaining to a curious 10-year-old who loves science. "
        "Use simple words, fun comparisons, and emoji where appropriate. "
        "Avoid ALL technical jargon — no words like 'residue', 'domain', 'subunit', 'conformation'. "
        "Instead of 'protein structure', say 'protein shape'. "
        "Instead of 'high confidence prediction', say 'the computer is very sure about this part'. "
        "Make questions feel like a fun game, not an exam."
    ),
    "highSchool": (
        "Write for a high school biology student. "
        "You can use basic scientific terms but always briefly define them. "
        "Use relatable analogies (weather forecasts, GPS accuracy, etc.) to explain confidence concepts. "
        "Questions should feel educational but not intimidating."
    ),
    "undergraduate": (
        "Write for an undergraduate biochemistry student. "
        "You can use proper scientific terminology (PAE, RMSD, alpha helix, etc.). "
        "Questions should test genuine understanding of protein structure and prediction confidence. "
        "Include nuance about uncertainty and structural biology."
    )
}

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
    Generate a question about protein confidence based on the selected cell and game settings.
    Questions are tailored to the audience level with appropriate language.
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
        
        print(f"Generating question for: {protein_name}, confidence: {confidence_level}, difficulty: {difficulty}, audience: {audience}")
        
        # Get audience-appropriate language guidelines
        lang_guide = AUDIENCE_GUIDELINES.get(audience, AUDIENCE_GUIDELINES["elementary"])
        
        # Friendly confidence descriptions per audience
        confidence_desc = {
            "elementary": {
                "high": "the computer is VERY sure about this part (green square)",
                "medium": "the computer is KINDA sure about this part (yellow square)",
                "low": "the computer is mostly GUESSING about this part (red square)"
            },
            "highSchool": {
                "high": "high confidence — the AI is quite certain about this region's structure",
                "medium": "medium confidence — there's some uncertainty in this prediction",
                "low": "low confidence — the AI is not very sure about this region"
            },
            "undergraduate": {
                "high": "low PAE values indicating high prediction confidence",
                "medium": "moderate PAE values suggesting some structural uncertainty",
                "low": "high PAE values indicating low prediction confidence"
            }
        }
        
        conf_desc = confidence_desc.get(audience, confidence_desc["elementary"]).get(confidence_level, "")
        
        # Create prompt for Gemini based on settings and protein info
        prompt = f"""
        Generate ONE educational question about protein structure prediction confidence.
        
        CRITICAL LANGUAGE GUIDELINES:
        {lang_guide}
        
        Context:
        - The user clicked on a square that shows: {conf_desc}
        - Difficulty level: {difficulty}
        - Game mode: {game_mode}
        
        {f"Protein context:" if protein_name else ""}
        {f"- Protein name: {protein_name}" if protein_name else ""}
        {f"- What it does: {protein_function}" if protein_function else ""}
        
        Question guidelines based on difficulty:
        - Beginner: Frame as a fun curiosity. Use the colors (green/yellow/red) as anchors. Only 2 options.
        - Intermediate: Ask about what confidence means for the protein. Use 2-3 options.
        - Advanced: Explore structural implications of confidence levels. Use 3-4 options.
        
        Return ONLY valid JSON in this format (no markdown, no extra text):
        {{
            "question": "Your friendly question here",
            "options": ["option1", "option2"],
            "correctAnswer": "The correct option (must exactly match one of the options)"
        }}
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
        
        # Friendly fallback responses based on audience and difficulty
        if audience == 'elementary':
            if confidence_level == "high":
                fallback_response = {
                    "question": f"You clicked a green square! What does green mean for the computer's guess about {protein_name or 'this protein'}?",
                    "options": ["The computer is very sure! ✅", "The computer is just guessing 🤷"],
                    "correctAnswer": "The computer is very sure! ✅"
                }
            elif confidence_level == "medium":
                fallback_response = {
                    "question": f"You clicked a yellow square! How sure is the computer about this part of {protein_name or 'the protein'}?",
                    "options": ["Kinda sure — not perfect 🤔", "Totally sure! 💯"],
                    "correctAnswer": "Kinda sure — not perfect 🤔"
                }
            else:
                fallback_response = {
                    "question": f"Uh oh, you found a red square! What does that mean for {protein_name or 'this protein'}?",
                    "options": ["The computer is mostly guessing! 🎲", "The computer is super confident! 💪"],
                    "correctAnswer": "The computer is mostly guessing! 🎲"
                }
        elif difficulty == 'advanced':
            fallback_response = {
                "question": f"What structural inference can we draw from this {confidence_level} confidence region of {protein_name or 'the protein'}?",
                "options": [
                    "This region is likely well-structured and correctly predicted", 
                    "This region may contain prediction errors or structural flexibility", 
                    "This region is likely intrinsically disordered"
                ],
                "correctAnswer": "This region is likely well-structured and correctly predicted" if confidence_level == "high" else 
                                "This region may contain prediction errors or structural flexibility"
            }
        else:
            fallback_response = {
                "question": f"The AI gave this part of {protein_name or 'the protein'} a {confidence_level} confidence score. What does that tell us?",
                "options": [
                    "The AI is very confident about this prediction",
                    "The AI has some uncertainty here",
                    "The AI is not very confident about this prediction"
                ],
                "correctAnswer": "The AI is very confident about this prediction" if confidence_level == "high" else 
                                "The AI has some uncertainty here" if confidence_level == "medium" else 
                                "The AI is not very confident about this prediction"
            }
        return jsonify(fallback_response)

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    """
    Generate a quiz about a specific protein based on game settings.
    Questions use audience-appropriate language.
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
        
        # Get audience-appropriate language guidelines
        lang_guide = AUDIENCE_GUIDELINES.get(audience, AUDIENCE_GUIDELINES["elementary"])
        
        # Create prompt for Gemini based on protein info and settings
        prompt = f"""
        Generate a fun, educational quiz about the protein {protein_name} from {species}.
        
        CRITICAL LANGUAGE GUIDELINES:
        {lang_guide}
        
        Protein Context:
        - Name: {protein_name}
        - From: {species}
        - What it does: {protein_function}
        
        Settings:
        - Difficulty: {difficulty}
        - Number of questions: {num_questions}
        
        Question guidelines:
        - Beginner: Fun, curiosity-driven questions. Use analogies. 3 options per question.
        - Intermediate: Educational questions with some science vocabulary. 4 options per question.  
        - Advanced: Challenging questions requiring synthesis. 4-5 options per question.
        
        IMPORTANT: Make questions feel like a fun exploration, NOT a medical school exam.
        Frame questions around "why should I care about this protein?" and "what's cool about it?"
        
        Return ONLY a valid JSON array (no markdown, no extra text):
        [
            {{
                "question": "Your engaging question here",
                "options": ["option1", "option2", "option3"],
                "correctAnswer": "Must exactly match one option",
                "explanation": "A friendly, clear explanation of why this is the answer"
            }}
        ]
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
        
        # Friendly fallback questions
        fallback_response = [
            {
                "question": f"What's the main job of {protein_name} in our body?" if species == "Homo sapiens" else f"What does {protein_name} do?",
                "options": [
                    f"{protein_function}",
                    "Making energy from sunlight",
                    "Copying DNA",
                    "Sending messages between cells"
                ],
                "correctAnswer": f"{protein_function}",
                "explanation": f"{protein_name}'s main job is: {protein_function}. Pretty cool, right?"
            },
            {
                "question": f"Where does {protein_name} come from?",
                "options": [
                    f"{species}",
                    "Homo sapiens",
                    "Escherichia coli",
                    "Saccharomyces cerevisiae"
                ],
                "correctAnswer": f"{species}",
                "explanation": f"The version of {protein_name} we're looking at comes from {species}."
            }
        ]
        return jsonify(fallback_response)

if __name__ == '__main__':
    print("Starting Confidence Quest backend server...")
    print(f"GEMINI_API_KEY configured: {api_key is not None}")
    app.run(debug=True, host='0.0.0.0', port=5001)
