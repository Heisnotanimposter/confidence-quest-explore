
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
    Generate a question about protein confidence based on the selected cell
    """
    try:
        # Get data from request
        data = request.get_json()
        confidence_level = data.get('confidence', 'medium')
        row = data.get('row', 0)
        col = data.get('col', 0)
        
        # Create prompt for Gemini
        prompt = f"""
        Generate a simple educational question about protein structure prediction confidence.
        The question should be suitable for elementary school children.
        
        The confidence level for the selected part is: {confidence_level} (high, medium, or low).
        This corresponds to position [{row}, {col}] in the PAE map.
        
        Return the response in this JSON format:
        {{
            "question": "The question text here",
            "options": ["option1", "option2", ...],
            "correctAnswer": "The correct option here"
        }}
        
        Keep the questions simple and educational. The options should include the correct answer
        and 1-2 incorrect answers. The question should relate to protein confidence in a way
        children can understand.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Extract and return the JSON response
        return response.text
    
    except Exception as e:
        print(f"Error: {str(e)}")
        # Fallback response
        fallback_response = {
            "question": f"How confident are we about this part of the protein?",
            "options": ["Very confident", "Somewhat confident", "Not confident"],
            "correctAnswer": "Very confident" if confidence_level == "high" else 
                            "Somewhat confident" if confidence_level == "medium" else 
                            "Not confident"
        }
        return jsonify(fallback_response)

if __name__ == '__main__':
    app.run(debug=True)
