#!/usr/bin/env python3
"""
BPE Tokenizer Training Script
Trains a Byte-Level BPE tokenizer on Marathi corpus.
"""

import json
import os
from collections import defaultdict
from typing import List, Tuple, Dict


def read_corpus(file_path: str) -> str:
    """Read the corpus file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()


def text_to_bytes(text: str) -> List[int]:
    """Convert text to list of UTF-8 byte values (0-255)."""
    return list(text.encode('utf-8'))


def get_word_frequencies(text: str) -> Dict[Tuple[int, ...], int]:
    """
    Split text into words and count frequencies.
    For BPE, we treat each word as a sequence of bytes.
    """
    words = text.split()
    word_freqs = defaultdict(int)
    
    for word in words:
        if word.strip():  # Skip empty words
            byte_word = tuple(text_to_bytes(word))
            word_freqs[byte_word] += 1
    
    return dict(word_freqs)


def get_stats(vocab: Dict[Tuple[int, ...], int]) -> Dict[Tuple[int, int], int]:
    """Count frequency of adjacent pairs in the vocabulary."""
    pairs = defaultdict(int)
    
    for word, freq in vocab.items():
        for i in range(len(word) - 1):
            pair = (word[i], word[i + 1])
            pairs[pair] += freq
    
    return dict(pairs)


def merge_vocab(pair: Tuple[int, int], vocab: Dict[Tuple[int, ...], int], new_token_id: int) -> Dict[Tuple[int, ...], int]:
    """Merge the most frequent pair in the vocabulary."""
    new_vocab = {}
    bigram = pair[0], pair[1]
    
    for word in vocab:
        new_word = []
        i = 0
        while i < len(word):
            if i < len(word) - 1 and word[i] == bigram[0] and word[i + 1] == bigram[1]:
                # Merge: replace pair with new token ID
                new_word.append(new_token_id)
                i += 2
            else:
                new_word.append(word[i])
                i += 1
        new_vocab[tuple(new_word)] = vocab[word]
    
    return new_vocab


def count_tokens_after_merges(vocab: Dict[Tuple[int, ...], int]) -> int:
    """
    Count total tokens after applying all merges.
    Each element in the word tuple is a token ID.
    """
    total = 0
    
    for word, freq in vocab.items():
        # Count tokens: each element in word is a token ID
        token_count = len(word)
        total += token_count * freq
    
    return total


def train_bpe(
    corpus_path: str,
    target_vocab_size: int = 4999
) -> Tuple[List[Tuple[int, int]], Dict[int, Tuple[int, ...]], int, float]:
    """
    Train BPE tokenizer.
    
    Returns:
        merges: List of merge rules [(byte1, byte2), ...]
        vocab_map: Dictionary mapping token_id to byte sequence
        final_vocab_size: Final vocabulary size
        compression_ratio: Compression ratio achieved
    """
    print("Reading corpus...")
    text = read_corpus(corpus_path)
    original_char_count = len(text)
    print(f"Corpus loaded: {original_char_count:,} characters")
    
    print("Converting text to bytes and computing word frequencies...")
    word_freqs = get_word_frequencies(text)
    print(f"Unique words: {len(word_freqs):,}")
    
    # Initialize vocabulary: each word is a sequence of bytes
    vocab = word_freqs.copy()
    
    # Track merges
    merges = []
    
    # Track vocabulary mapping: token_id -> byte sequence
    # Start with 256 base byte tokens
    vocab_map = {}
    for i in range(256):
        vocab_map[i] = (i,)
    
    token_id = 256  # Next token ID for merged tokens
    
    print(f"\nStarting BPE training...")
    print(f"Target vocabulary size: {target_vocab_size}")
    print(f"Initial vocabulary size: {len(vocab_map)}")
    
    iteration = 0
    
    while len(vocab_map) < target_vocab_size:
        pairs = get_stats(vocab)
        if not pairs:
            print("No more pairs to merge!")
            break
        
        # Find most frequent pair
        best_pair = max(pairs, key=pairs.get)
        best_freq = pairs[best_pair]
        
        if best_freq < 2:  # Stop if no frequent pairs
            break
        
        # Add merge rule
        merges.append(best_pair)
        
        # Add to vocabulary mapping BEFORE merging
        # The merged token is the concatenation of the two tokens
        token1_seq = vocab_map[best_pair[0]]
        token2_seq = vocab_map[best_pair[1]]
        merged_seq = token1_seq + token2_seq
        vocab_map[token_id] = merged_seq
        
        # Merge the pair in vocabulary (replace pair with new token ID)
        vocab = merge_vocab(best_pair, vocab, token_id)
        token_id += 1
        
        iteration += 1
        if iteration % 100 == 0:
            print(f"Iteration {iteration}: Vocabulary size = {len(vocab_map)}, "
                  f"Most frequent pair = {best_pair} (freq: {best_freq:,})")
        
        if len(vocab_map) >= target_vocab_size:
            break
    
    # Count total tokens after encoding
    # Each element in vocab keys is a token ID
    total_tokens = count_tokens_after_merges(vocab)
    
    # Calculate compression ratio
    compression_ratio = original_char_count / total_tokens if total_tokens > 0 else 0
    
    final_vocab_size = len(vocab_map)
    
    print(f"\nTraining completed!")
    print(f"Total iterations: {iteration}")
    print(f"Final vocabulary size: {final_vocab_size}")
    print(f"Total merges: {len(merges)}")
    print(f"Original character count: {original_char_count:,}")
    print(f"Total tokens after encoding: {total_tokens:,}")
    print(f"Compression ratio: {compression_ratio:.2f}x")
    
    return merges, vocab_map, final_vocab_size, compression_ratio


def save_model(
    merges: List[Tuple[int, int]],
    vocab_map: Dict[int, Tuple[int, ...]],
    vocab_size: int,
    compression_ratio: float,
    output_path: str
):
    """Save the trained model to JSON file."""
    # Convert vocab_map to serializable format
    vocab_serializable = {
        str(k): list(v) for k, v in vocab_map.items()
    }
    
    model_data = {
        "merges": merges,
        "vocab": vocab_serializable,
        "vocab_size": vocab_size,
        "compression_ratio": compression_ratio,
        "metadata": {
            "algorithm": "Byte-Level BPE",
            "base_tokens": 256,
            "num_merges": len(merges)
        }
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(model_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nModel saved to: {output_path}")


def main():
    """Main training function."""
    # Paths
    corpus_path = '../data/corpus_small.txt'
    output_path = '../backend/merges.json'
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Check if corpus exists
    if not os.path.exists(corpus_path):
        print(f"Error: Corpus file not found at {corpus_path}")
        return
    
    print("=" * 60)
    print("Marathi BPE Tokenizer Training")
    print("=" * 60)
    
    # Train BPE
    merges, vocab_map, vocab_size, compression_ratio = train_bpe(
        corpus_path=corpus_path,
        target_vocab_size=4999
    )
    
    # Validate constraints
    print("\n" + "=" * 60)
    print("Validation Results:")
    print("=" * 60)
    
    if vocab_size < 5000:
        print(f"✓ Vocabulary size constraint met: {vocab_size} < 5000")
    else:
        print(f"✗ Vocabulary size constraint NOT met: {vocab_size} >= 5000")
    
    if compression_ratio >= 3.2:
        print(f"✓ Compression ratio constraint met: {compression_ratio:.2f}x >= 3.2x")
    else:
        print(f"✗ Compression ratio constraint NOT met: {compression_ratio:.2f}x < 3.2x")
    
    # Save model
    save_model(merges, vocab_map, vocab_size, compression_ratio, output_path)
    
    print("\n" + "=" * 60)
    print("Training completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
