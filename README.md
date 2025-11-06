# वर्ण - Marathi BPE Tokenizer 🌸

A from-scratch Python implementation of the Byte Pair Encoding (BPE) algorithm, trained on a custom Marathi corpus and demonstrated with a full-stack web application (Python Flask backend + vanilla JavaScript frontend).

This project is an educational deep-dive into the core components of modern Large Language Models (LLMs), from data processing and algorithm implementation to serving a model via an API.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Expected Output](#expected-output)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Future Work](#future-work)
- [Author](#author)

## 🎯 Overview

The journey of AI has largely been English-centric. This project aims to change that narrative for Marathi, one of India's most culturally rich languages, by building a foundational NLP tool from the ground up.

The goal is to create a custom tokenizer for Marathi using a dataset derived from rhythmic and literary texts. By building this from scratch, we explore the inner workings of BPE and create a tool tailored to the nuances of the Devanagari script as it's used in Marathi.

### Goals & Constraints

This project isn't just a demo; it's an exercise in meeting real-world performance metrics. The tokenizer must be trained to satisfy the following statistics:

- **Vocabulary Size**: The final trained vocabulary must be less than 5000 tokens.
- **Compression Ratio**: The tokenizer must achieve a compression ratio of 3.2x or higher on the training corpus.

This tokenizer is a cornerstone for future NLP applications, from creative writing and poetic generation (like Haiku) to chatbots and summarization tools.

## ✨ Features

### Core Functionality

1. **Text Encoding**: Convert Marathi text into token IDs using Byte-Level BPE
2. **Token Decoding**: Convert token IDs back to Marathi text
3. **Real-time Tokenization**: Automatic tokenization as you type (with debouncing)
4. **Dual View Modes**: Toggle between viewing actual tokens and token IDs
5. **Token Visualization**: Color-coded token boxes for easy identification
6. **Verification System**: Automatically decode tokens back to verify encoding accuracy
7. **Statistics Display**: Real-time token count and character count
8. **Copy Functionality**: One-click copy for tokens and token IDs with visual feedback

### User Interface Features

- **Modern Dark Theme**: Beautiful, responsive UI with Marathi language support
- **Encoder/Decoder Tabs**: Separate interfaces for encoding and decoding
- **Sample Text Buttons**: Quick access to pre-loaded Marathi sample texts
- **Interactive Token Boxes**: Click individual tokens to copy them
- **Visual Feedback**: Copy buttons transform to checkmarks when clicked
- **Loading States**: Visual indicators during API calls
- **Error Handling**: User-friendly error messages

### Technical Features

- **Byte-Level BPE**: Works on UTF-8 bytes, making it language-agnostic
- **RESTful API**: Clean API endpoints for encoding and decoding
- **CORS Enabled**: Frontend can communicate with backend seamlessly
- **Health Check Endpoint**: Monitor API server status
- **Model Information**: Access tokenizer statistics via API

## 📁 Project Structure

```
MarathiBPE/
│
├── data/
│   ├── corpus_small.txt      # Small Marathi corpus for training
│   └── corpus_large.txt       # Large Marathi corpus for training
│
├── trainBPE/
│   └── train.py               # BPE training script
│
├── backend/
│   ├── app.py                 # Flask API server
│   ├── merges.json            # Trained tokenizer model (generated)
│   ├── requirements.txt       # Python dependencies
│   └── mrbpe/                 # Virtual environment (optional)
│
├── frontend/
│   ├── index.html             # Web interface
│   ├── style.css              # Styling
│   └── script.js              # Frontend logic
│
├── docs/                      # Project documentation
│
└── README.md                  # This file
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.7+** (Python 3.9+ recommended)
- **pip** (Python package manager)
- **Web Browser** (Chrome, Firefox, Edge, or Safari)
- **Text Editor** or IDE (VS Code, PyCharm, etc.)

## 📦 Installation

### 1. Clone or Download the Repository

```bash
# If using git
git clone <repository-url>
cd MarathiBPE

# Or download and extract the ZIP file
```

### 2. Set Up Python Virtual Environment (Recommended)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv mrbpe

# Activate virtual environment
# On Windows:
mrbpe\Scripts\activate
# On macOS/Linux:
source mrbpe/bin/activate
```

### 3. Install Backend Dependencies

```bash
# Make sure you're in the backend directory with virtual environment activated
pip install -r requirements.txt
```

This will install:
- Flask 3.0.0
- flask-cors 4.0.0

## 🚀 How to Run

### Step 1: Train the Tokenizer (First Time Only)

**Note**: This step is only required once. If `backend/merges.json` already exists, you can skip this step.

```bash
# Navigate to the training directory
cd trainBPE

# Run the training script
python train.py
```

**What happens:**
- The script reads `../data/corpus_small.txt` (or your specified corpus)
- It performs Byte-Level BPE training
- Generates `../backend/merges.json` containing the trained model
- Displays training statistics (vocabulary size, compression ratio)

**Expected Training Output:**
```
Training BPE tokenizer...
Reading corpus from ../data/corpus_small.txt
Corpus size: X characters
Starting BPE training...
...
Training complete!
Vocabulary size: XXXX (< 5000)
Compression ratio: X.XXx (>= 3.2x)
Model saved to ../backend/merges.json
```

### Step 2: Start the Backend Server

Open **Terminal 1**:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if using one)
# On Windows:
mrbpe\Scripts\activate
# On macOS/Linux:
source mrbpe/bin/activate

# Run the Flask server
python app.py
```

**Expected Backend Output:**
```
Loading model from E:\...\backend\merges.json...
Model loaded successfully!
  Vocabulary size: XXXX
  Number of merges: XXXX
  Compression ratio: X.XXx

============================================================
Marathi BPE Tokenizer API Server
============================================================
Server starting on http://localhost:5000
Endpoints:
  POST /encode  - Encode text to tokens
  POST /decode  - Decode tokens to text
  GET  /info    - Get tokenizer information
  GET  /health  - Health check
============================================================

 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://[your-ip]:5000
```

**Keep this terminal open!** The server must remain running.

### Step 3: Start the Frontend Server

Open **Terminal 2** (new terminal window):

```bash
# Navigate to frontend directory
cd frontend

# Start a simple HTTP server
# Option 1: Python HTTP Server
python -m http.server 8000

# Option 2: If you have Node.js installed
npx http-server -p 8000

# Option 3: If you have PHP installed
php -S localhost:8000
```

**Expected Frontend Output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Step 4: Open the Application

Open your web browser and navigate to:

```
http://localhost:8000
```

You should see the **वर्ण (Marathi Tokenizer)** interface!

## 📊 Expected Output

### Encoder Tab

1. **Input**: Enter Marathi text in the left panel
   - Example: `नमस्कार आपले मराठी टोकनायझर या प्रोजेक्ट मध्ये स्वागत आहे.`

2. **Output**: Right panel displays:
   - **Statistics**: Token count and character count
   - **Toggle Buttons**: Switch between "Actual Tokens" and "Token IDs"
   - **Token Visualization**: Color-coded boxes showing tokens or token IDs
   - **Copy Buttons**: Copy all tokens or token IDs with one click
   - **Verification**: Decoded text to verify encoding accuracy

3. **Example Output**:
   ```
   Tokens: 15
   Characters: 65
   
   Actual Tokens: [नमस्कार, आपले, मराठी, टोकनायझर, ...]
   Token IDs: [1234, 567, 890, 123, ...]
   
   Verification (Decoded Back): नमस्कार आपले मराठी टोकनायझर या प्रोजेक्ट मध्ये स्वागत आहे.
   ```

### Decoder Tab

1. **Input**: Enter token IDs (comma-separated or JSON array)
   - Example: `1234, 567, 890, 123, 456`

2. **Output**: Decoded Marathi text
   - Example: `नमस्कार आपले मराठी`

### Visual Features

- **Token Boxes**: Each token is displayed in a colored box
- **Hover Effects**: Interactive hover states on buttons and tokens
- **Copy Feedback**: Copy buttons show a green checkmark when clicked
- **Loading Spinner**: Appears during API calls
- **Error Messages**: Displayed at the top if something goes wrong

## 🔌 API Endpoints

The backend provides the following REST API endpoints:

### POST `/encode`

Encode Marathi text into token IDs.

**Request:**
```json
{
  "text": "नमस्कार आपले मराठी टोकनायझर"
}
```

**Response:**
```json
{
  "tokens": [1234, 567, 890, 123],
  "token_count": 4,
  "original_length": 35
}
```

### POST `/decode`

Decode token IDs back to Marathi text.

**Request:**
```json
{
  "tokens": [1234, 567, 890, 123]
}
```

**Response:**
```json
{
  "text": "नमस्कार आपले मराठी",
  "token_count": 4
}
```

### GET `/info`

Get tokenizer information.

**Response:**
```json
{
  "vocab_size": 4500,
  "compression_ratio": 3.45,
  "algorithm": "Byte-Level BPE",
  "num_merges": 4244
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## 🛠️ Technologies Used

### Backend
- **Python 3.9+**: Core programming language
- **Flask 3.0.0**: Web framework for API server
- **flask-cors 4.0.0**: Cross-Origin Resource Sharing support
- **JSON**: Model storage format

### Frontend
- **HTML5**: Markup structure
- **CSS3**: Styling and animations
- **Vanilla JavaScript**: No frameworks, pure JS for API calls and UI interactions
- **Fetch API**: HTTP requests to backend

### Algorithm
- **Byte-Level BPE**: Custom implementation from scratch
- **UTF-8 Encoding**: Handles all Unicode characters including Devanagari script

## 🎓 How It Works

### The Algorithm

The tokenizer uses **Byte-Level BPE** (Byte Pair Encoding), which works on raw UTF-8 bytes (integers 0-255) rather than complex characters. This approach is:

- **Language-agnostic**: Works with any language, including Marathi
- **Robust**: Handles any character, inflection, or compound word
- **Efficient**: Achieves high compression ratios

### The Training Process

1. **Initialization**: Text is converted to UTF-8 bytes
2. **Iterative Merging**: Most frequent byte pairs are merged iteratively
3. **Vocabulary Building**: Merges are stored as rules
4. **Termination**: Stops when target vocabulary size is reached

### The Encoding Process

1. Convert text to UTF-8 bytes
2. Initialize tokens (each byte = token ID 0-255)
3. Apply merge rules iteratively
4. Return final token IDs

### The Decoding Process

1. Look up token IDs in vocabulary
2. Convert to byte sequence
3. Decode UTF-8 bytes to text
4. Return decoded Marathi text

## 🔮 Future Work

- [ ] Train on a significantly larger and more diverse Marathi corpus
- [ ] Experiment with different vocab_size budgets to optimize compression ratio
- [ ] Integrate this tokenizer into a downstream NLP task (e.g., generative model)
- [ ] Add support for multiple corpus selection (vani-small vs vani-large)
- [ ] Implement token frequency analysis
- [ ] Add export functionality for tokenized datasets
- [ ] Create visualization for BPE merge tree
- [ ] Add batch processing capabilities
- [ ] Implement tokenization for multiple languages simultaneously
- [ ] Build a simple language model using this tokenizer

## 📝 Notes

- The tokenizer is trained specifically on Marathi text but can handle any UTF-8 text
- The model file (`merges.json`) contains the complete trained tokenizer
- Real-time tokenization uses debouncing (500ms delay) to reduce API calls
- The frontend automatically verifies encoding by decoding tokens back

## 👤 Author

**Shivranjan Kolvankar**

---

## 📄 License

This project is created for educational purposes. Feel free to use, modify, and distribute as needed.

---

**Made with ❤️ for Marathi Language Processing**
