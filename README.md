
# Confidence Challenge Game

An educational game for entry level researcher or student to understand protein structure prediction confidence concepts.

## Project Overview

This game helps newcomers understand PAE (Predicted Aligned Error) Viewer concepts for protein structure prediction confidence through interactive challenges.

Features:
- 5x5 grid representing a simplified PAE map with color-coded confidence levels
- Simplified 3D protein representation
- Interactive connection between the PAE map and protein visualization
- Question/challenge area with dynamic questions about protein confidence
- Scoring system
- Integration with Gemini AI for question generation

## Setup Instructions

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env.local` file with your Gemini API Key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_BACKEND_URL=http://localhost:5000
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```
   python app.py
   ```

## How to Play

1. View the PAE map grid and protein visualization
2. Click on a cell in the PAE map to select it
3. Answer the generated question about protein confidence
4. Track your score and try to improve your knowledge

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Flask backend
- Gemini AI API for question generation

