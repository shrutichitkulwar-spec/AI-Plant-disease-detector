# AI Plant Disease Detector

An AI-powered web application that detects plant diseases from leaf images using deep learning and provides detailed disease information, treatment suggestions, and preventive measures.

## Features

- Plant disease detection from leaf images
- AI-generated disease explanation using Google Gemini
- Upload or capture leaf images
- Download PDF reports
- Text-to-speech support
- Multi-language support
- Disease confidence score
- Disease severity indicator
- Scan history
- Responsive user interface

## Tech Stack

### Frontend
- React.js
- CSS
- Framer Motion
- jsPDF

### Backend
- FastAPI
- PyTorch
- Torchvision
- Pillow

### AI & Machine Learning
- ResNet18
- PlantVillage Dataset
- Google Gemini API

## Project Structure

```text
AI-Plant-disease-detector/
│
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/shrutichitkulwar-spec/AI-Plant-disease-detector.git
cd AI-Plant-disease-detector
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn app:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## Usage

1. Start the FastAPI backend.
2. Start the React frontend.
3. Upload or capture a leaf image.
4. View the predicted disease, confidence score, AI explanation, treatment, and prevention recommendations.
5. Download the generated PDF report if needed.

## Future Improvements

- Cloud deployment
- User authentication
- Weather-based disease prediction
- Real-time camera detection
- Farmer dashboard
- Mobile application

## Author

**Shruti Chitkulwar**

GitHub: https://github.com/shrutichitkulwar-spec
