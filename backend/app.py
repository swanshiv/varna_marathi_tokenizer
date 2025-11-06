#!/usr/bin/env python3
"""
Marathi BPE Tokenizer Backend API Server
Flask server that loads the trained tokenizer and serves encode/decode endpoints.
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Global variables to store the tokenizer model
merges = []
vocab = {}
vocab_size = 0
compression_ratio = 0.0


def load_model():
    """Load the trained tokenizer model from merges.json."""
    global merges, vocab, vocab_size, compression_ratio
    
    model_path = os.path.join(os.path.dirname(__file__), 'merges.json')
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    print(f"Loading model from {model_path}...")
    with open(model_path, 'r', encoding='utf-8') as f:
        model_data = json.load(f)
    
    merges = [tuple(merge) for merge in model_data['merges']]
    vocab = {int(k): tuple(v) for k, v in model_data['vocab'].items()}
    vocab_size = model_data.get('vocab_size', len(vocab))
    compression_ratio = model_data.get('compression_ratio', 0.0)
    
    print(f"Model loaded successfully!")
    print(f"  Vocabulary size: {vocab_size}")
    print(f"  Number of merges: {len(merges)}")
    print(f"  Compression ratio: {compression_ratio:.2f}x")


def encode(text: str) -> list:
    """
    Encode text into token IDs using BPE.
    
    Args:
        text: Input text string
        
    Returns:
        List of token IDs
    """
    if not text:
        return []
    
    # Convert text to UTF-8 bytes
    byte_sequence = list(text.encode('utf-8'))
    
    # Initialize tokens: each byte becomes a token ID (0-255)
    tokens = byte_sequence.copy()
    
    # Apply merges iteratively
    # For each merge rule (token_a, token_b), replace adjacent pairs with new token ID
    for merge_idx, (token_a, token_b) in enumerate(merges):
        new_token_id = 256 + merge_idx
        new_tokens = []
        i = 0
        
        while i < len(tokens):
            if i < len(tokens) - 1 and tokens[i] == token_a and tokens[i + 1] == token_b:
                # Replace pair with merged token ID
                new_tokens.append(new_token_id)
                i += 2
            else:
                new_tokens.append(tokens[i])
                i += 1
        
        tokens = new_tokens
    
    return tokens


def decode(token_ids: list) -> str:
    """
    Decode token IDs back to text using BPE vocabulary.
    
    Args:
        token_ids: List of token IDs
        
    Returns:
        Decoded text string
    """
    if not token_ids:
        return ""
    
    # Convert token IDs to byte sequence
    byte_sequence = []
    
    for token_id in token_ids:
        if token_id in vocab:
            byte_sequence.extend(vocab[token_id])
        else:
            # Unknown token ID - handle gracefully
            # For now, skip it (could also raise an error)
            print(f"Warning: Unknown token ID {token_id}")
    
    # Convert byte sequence to UTF-8 string
    try:
        text = bytes(byte_sequence).decode('utf-8')
        return text
    except UnicodeDecodeError as e:
        raise ValueError(f"Failed to decode byte sequence: {e}")


@app.route('/encode', methods=['POST'])
def encode_endpoint():
    """API endpoint for encoding text to tokens."""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Invalid request. Expected JSON with "text" field.'
            }), 400
        
        text = data['text']
        
        if not isinstance(text, str):
            return jsonify({
                'error': 'Invalid input. "text" must be a string.'
            }), 400
        
        # Encode text
        tokens = encode(text)
        
        return jsonify({
            'tokens': tokens,
            'token_count': len(tokens),
            'original_length': len(text)
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Encoding failed: {str(e)}'
        }), 500


@app.route('/decode', methods=['POST'])
def decode_endpoint():
    """API endpoint for decoding tokens to text."""
    try:
        data = request.get_json()
        
        if not data or 'tokens' not in data:
            return jsonify({
                'error': 'Invalid request. Expected JSON with "tokens" field.'
            }), 400
        
        token_ids = data['tokens']
        
        if not isinstance(token_ids, list):
            return jsonify({
                'error': 'Invalid input. "tokens" must be a list of integers.'
            }), 400
        
        # Validate token IDs are integers
        try:
            token_ids = [int(t) for t in token_ids]
        except (ValueError, TypeError):
            return jsonify({
                'error': 'Invalid input. All token IDs must be integers.'
            }), 400
        
        # Decode tokens
        text = decode(token_ids)
        
        return jsonify({
            'text': text,
            'token_count': len(token_ids)
        }), 200
        
    except ValueError as e:
        return jsonify({
            'error': f'Decoding failed: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Decoding failed: {str(e)}'
        }), 500


@app.route('/info', methods=['GET'])
def info_endpoint():
    """API endpoint for tokenizer information."""
    return jsonify({
        'vocab_size': vocab_size,
        'compression_ratio': compression_ratio,
        'algorithm': 'Byte-Level BPE',
        'num_merges': len(merges)
    }), 200


@app.route('/health', methods=['GET'])
def health_endpoint():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': len(vocab) > 0
    }), 200


if __name__ == '__main__':
    # Load model on startup
    try:
        load_model()
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Server will start but encode/decode endpoints will fail.")
    
    # Run Flask server
    print("\n" + "=" * 60)
    print("Marathi BPE Tokenizer API Server")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("Endpoints:")
    print("  POST /encode  - Encode text to tokens")
    print("  POST /decode  - Decode tokens to text")
    print("  GET  /info    - Get tokenizer information")
    print("  GET  /health  - Health check")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)


