// Marathi BPE Tokenizer - JavaScript with Token Visualization

const API_BASE_URL = 'http://localhost:5000';

console.log('[Tokenizer] Initializing Marathi BPE Tokenizer...');
console.log('[Tokenizer] API Base URL:', API_BASE_URL);

// DOM Elements
const textInput = document.getElementById('text-input');
const encodeResult = document.getElementById('encode-result');
const tokenBoxesContainer = document.getElementById('token-boxes-container');
const tokenIdsContainer = document.getElementById('token-ids-container');
const copyTokensBtn = document.getElementById('copy-tokens-btn');
const copyIdsBtn = document.getElementById('copy-ids-btn');

const statTokens = document.getElementById('stat-tokens');
const statCharacters = document.getElementById('stat-characters');

const toggleTokensBtn = document.getElementById('toggle-tokens');
const toggleIdsBtn = document.getElementById('toggle-ids');

const tokensView = document.getElementById('tokens-view');
const idsView = document.getElementById('ids-view');

const decodedVerification = document.getElementById('decoded-verification');

const tokenInput = document.getElementById('token-input');
const decodeResult = document.getElementById('decode-result');
const decodedText = document.getElementById('decoded-text');

const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Corpus Toggle Elements
const toggleSmallBtn = document.getElementById('toggle-small');
const toggleLargeBtn = document.getElementById('toggle-large');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Sample text buttons
const sampleBtns = document.querySelectorAll('.sample-btn');

console.log('[Tokenizer] DOM Elements loaded:', {
    textInput: !!textInput,
    tokenInput: !!tokenInput,
    encodeResult: !!encodeResult,
    decodeResult: !!decodeResult,
    toggleSmallBtn: !!toggleSmallBtn,
    toggleLargeBtn: !!toggleLargeBtn
});

// Current corpus mode: 'vani-small' or 'vani-large'
let currentCorpus = 'vani-small';
console.log('[Tokenizer] Initial corpus mode:', currentCorpus);

// Token color palette
const TOKEN_COLORS = [
    '#4a9eff', // Blue
    '#ff6b35', // Orange
    '#51cf66', // Green
    '#9775fa', // Purple
    '#ffd43b', // Yellow
    '#ff8787', // Red
    '#20c997', // Teal
    '#f06595'  // Pink
];

// Utility Functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Function to log panel dimensions
function logPanelDimensions() {
    const encoderTab = document.getElementById('encoder-tab');
    const decoderTab = document.getElementById('decoder-tab');
    
    if (encoderTab && decoderTab) {
        // Temporarily show both tabs to measure dimensions
        const encoderWasVisible = encoderTab.classList.contains('active');
        const decoderWasVisible = decoderTab.classList.contains('active');
        
        // Make both visible temporarily for measurement
        encoderTab.style.display = 'block';
        decoderTab.style.display = 'block';
        encoderTab.classList.add('active');
        decoderTab.classList.add('active');
        
        // Force a reflow to ensure dimensions are calculated
        void encoderTab.offsetHeight;
        void decoderTab.offsetHeight;
        
        const encoderLayout = encoderTab.querySelector('.two-column-layout');
        const decoderLayout = decoderTab.querySelector('.two-column-layout');
        
        const encoderLeftPanel = encoderTab.querySelector('.left-panel');
        const encoderRightPanel = encoderTab.querySelector('.right-panel');
        const decoderLeftPanel = decoderTab.querySelector('.left-panel');
        const decoderRightPanel = decoderTab.querySelector('.right-panel');
        
        const encoderTextarea = encoderTab.querySelector('#text-input');
        const decoderTextarea = decoderTab.querySelector('#token-input');
        
        console.log('[Dimensions] ========================================');
        console.log('[Dimensions] ENCODER BLOCK:');
        if (encoderLayout) {
            const layoutRect = encoderLayout.getBoundingClientRect();
            console.log('[Dimensions]   Layout - Width:', layoutRect.width.toFixed(2), 'Height:', layoutRect.height.toFixed(2));
        }
        if (encoderLeftPanel) {
            const leftRect = encoderLeftPanel.getBoundingClientRect();
            console.log('[Dimensions]   Left Panel - Width:', leftRect.width.toFixed(2), 'Height:', leftRect.height.toFixed(2));
        }
        if (encoderRightPanel) {
            const rightRect = encoderRightPanel.getBoundingClientRect();
            console.log('[Dimensions]   Right Panel - Width:', rightRect.width.toFixed(2), 'Height:', rightRect.height.toFixed(2));
        }
        if (encoderTextarea) {
            const textareaRect = encoderTextarea.getBoundingClientRect();
            console.log('[Dimensions]   Textarea - Width:', textareaRect.width.toFixed(2), 'Height:', textareaRect.height.toFixed(2));
        }
        
        console.log('[Dimensions] DECODER BLOCK:');
        if (decoderLayout) {
            const layoutRect = decoderLayout.getBoundingClientRect();
            console.log('[Dimensions]   Layout - Width:', layoutRect.width.toFixed(2), 'Height:', layoutRect.height.toFixed(2));
        }
        if (decoderLeftPanel) {
            const leftRect = decoderLeftPanel.getBoundingClientRect();
            console.log('[Dimensions]   Left Panel - Width:', leftRect.width.toFixed(2), 'Height:', leftRect.height.toFixed(2));
        }
        if (decoderRightPanel) {
            const rightRect = decoderRightPanel.getBoundingClientRect();
            console.log('[Dimensions]   Right Panel - Width:', rightRect.width.toFixed(2), 'Height:', rightRect.height.toFixed(2));
        }
        if (decoderTextarea) {
            const textareaRect = decoderTextarea.getBoundingClientRect();
            console.log('[Dimensions]   Textarea - Width:', textareaRect.width.toFixed(2), 'Height:', textareaRect.height.toFixed(2));
        }
        
        // Compare dimensions
        if (encoderLeftPanel && decoderLeftPanel) {
            const encoderLeftRect = encoderLeftPanel.getBoundingClientRect();
            const decoderLeftRect = decoderLeftPanel.getBoundingClientRect();
            const widthDiff = Math.abs(encoderLeftRect.width - decoderLeftRect.width);
            const heightDiff = Math.abs(encoderLeftRect.height - decoderLeftRect.height);
            console.log('[Dimensions] COMPARISON (Left Panels):');
            console.log('[Dimensions]   Width difference:', widthDiff.toFixed(2), 'px');
            console.log('[Dimensions]   Height difference:', heightDiff.toFixed(2), 'px');
            if (widthDiff > 1 || heightDiff > 1) {
                console.warn('[Dimensions] ⚠️ Dimensions do not match!');
            } else {
                console.log('[Dimensions] ✓ Dimensions match!');
            }
        }
        
        if (encoderRightPanel && decoderRightPanel) {
            const encoderRightRect = encoderRightPanel.getBoundingClientRect();
            const decoderRightRect = decoderRightPanel.getBoundingClientRect();
            const widthDiff = Math.abs(encoderRightRect.width - decoderRightRect.width);
            const heightDiff = Math.abs(encoderRightRect.height - decoderRightRect.height);
            console.log('[Dimensions] COMPARISON (Right Panels):');
            console.log('[Dimensions]   Width difference:', widthDiff.toFixed(2), 'px');
            console.log('[Dimensions]   Height difference:', heightDiff.toFixed(2), 'px');
            if (widthDiff > 1 || heightDiff > 1) {
                console.warn('[Dimensions] ⚠️ Dimensions do not match!');
            } else {
                console.log('[Dimensions] ✓ Dimensions match!');
            }
        }
        
        if (encoderTextarea && decoderTextarea) {
            const encoderTextareaRect = encoderTextarea.getBoundingClientRect();
            const decoderTextareaRect = decoderTextarea.getBoundingClientRect();
            const widthDiff = Math.abs(encoderTextareaRect.width - decoderTextareaRect.width);
            const heightDiff = Math.abs(encoderTextareaRect.height - decoderTextareaRect.height);
            console.log('[Dimensions] COMPARISON (Textareas):');
            console.log('[Dimensions]   Width difference:', widthDiff.toFixed(2), 'px');
            console.log('[Dimensions]   Height difference:', heightDiff.toFixed(2), 'px');
            if (widthDiff > 1 || heightDiff > 1) {
                console.warn('[Dimensions] ⚠️ Textarea dimensions do not match!');
            } else {
                console.log('[Dimensions] ✓ Textarea dimensions match!');
            }
        }
        
        console.log('[Dimensions] ========================================');
        
        // Restore original visibility state
        encoderTab.style.display = '';
        decoderTab.style.display = '';
        if (!encoderWasVisible) encoderTab.classList.remove('active');
        if (!decoderWasVisible) decoderTab.classList.remove('active');
    }
}

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        console.log('[UI] Tab switched to:', tabName);
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        console.log('[UI] Tab activation complete:', tabName);
        
        // Log dimensions after tab switch (with small delay to ensure rendering)
        setTimeout(() => {
            logPanelDimensions();
        }, 100);
    });
});

// Sample Text Buttons
sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const sampleText = btn.dataset.text;
        console.log('[UI] Sample text selected:', sampleText.substring(0, 50) + '...');
        textInput.value = btn.dataset.text;
        // Auto-encode when sample is selected
        setTimeout(() => encodeText(), 300);
    });
});

// Store current token data
let currentTokenData = {
    tokens: [],
    tokenIds: [],
    originalText: ''
};

// Current view mode: 'tokens' or 'ids'
let currentViewMode = 'tokens';

// Toggle View Function - switches visibility between tokens and IDs
function switchViewMode(mode) {
    console.log('[UI] Switching view mode:', mode);
    currentViewMode = mode;
    
    // Update toggle buttons
    toggleTokensBtn.classList.toggle('active', mode === 'tokens');
    toggleIdsBtn.classList.toggle('active', mode === 'ids');
    
    // Show/hide corresponding views
    tokensView.classList.toggle('active', mode === 'tokens');
    idsView.classList.toggle('active', mode === 'ids');
    
    console.log('[UI] View mode switched. Tokens visible:', mode === 'tokens', 'IDs visible:', mode === 'ids');
}

// Render tokens based on current view mode
function renderTokens() {
    console.log('[Render] Rendering tokens. Token count:', currentTokenData.tokenIds.length);
    
    // Clear containers
    tokenBoxesContainer.innerHTML = '';
    tokenIdsContainer.innerHTML = '';
    
    if (currentTokenData.tokenIds.length === 0) {
        console.log('[Render] No tokens to render');
        return;
    }
    
    // Render token boxes and token ID boxes
    currentTokenData.tokens.forEach((token, index) => {
        const tokenId = currentTokenData.tokenIds[index];
        const colorIndex = tokenId % TOKEN_COLORS.length;
        
        // Create token box
        const tokenBox = document.createElement('div');
        tokenBox.className = `token-box color-${colorIndex}`;
        tokenBox.textContent = token || '<unknown>';
        tokenBox.title = `Token ID: ${tokenId}`;
        tokenBoxesContainer.appendChild(tokenBox);
        
        // Create token ID box with matching color
        const tokenIdBox = document.createElement('div');
        tokenIdBox.className = `token-id-box color-${colorIndex}`;
        tokenIdBox.textContent = tokenId;
        tokenIdBox.title = `Token: ${token || '<unknown>'}`;
        tokenIdsContainer.appendChild(tokenIdBox);
    });
    
    console.log('[Render] Rendered', currentTokenData.tokens.length, 'tokens successfully');
}

// Decode tokens for verification
async function decodeTokensForVerification(tokenIds, originalText) {
    console.log('[Verify] Starting verification decode. Token count:', tokenIds.length);
    try {
        const response = await fetch(`${API_BASE_URL}/decode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokens: tokenIds }),
        });
        
        const data = await response.json();
        console.log('[Verify] Decode response status:', response.status);
        
        if (response.ok && data.text) {
            decodedVerification.textContent = data.text;
            console.log('[Verify] Verification successful. Decoded text length:', data.text.length);
            console.log('[Verify] Original matches decoded:', originalText === data.text);
        } else {
            decodedVerification.textContent = 'Verification failed';
            console.error('[Verify] Verification failed. Response:', data);
        }
    } catch (error) {
        decodedVerification.textContent = 'Verification error';
        console.error('[Verify] Verification error:', error);
    }
}

async function encodeText(showSpinner = true) {
    const text = textInput.value.trim();
    console.log('[Encode] Encoding text. Length:', text.length, 'Show spinner:', showSpinner);
    
    if (!text) {
        console.log('[Encode] Empty text, clearing results');
        // Clear results if text is empty
        encodeResult.classList.add('hidden');
        currentTokenData = { tokens: [], tokenIds: [], originalText: '' };
        statTokens.textContent = '0';
        statCharacters.textContent = '0';
        return;
    }
    
    if (showSpinner) {
        showLoading();
    }
    
    try {
        console.log('[Encode] Sending request to:', `${API_BASE_URL}/encode`);
        console.log('[Encode] Request body:', { text: text.substring(0, 100) + '...' });
        
        const response = await fetch(`${API_BASE_URL}/encode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });
        
        const data = await response.json();
        console.log('[Encode] Response status:', response.status);
        console.log('[Encode] Response data:', { 
            tokenCount: data.tokens?.length || 0,
            hasTokens: !!data.tokens 
        });
        
        if (!response.ok) {
            throw new Error(data.error || 'Encoding failed');
        }
        
        
        // Get token texts by decoding each token individually
        console.log('[Encode] Decoding individual tokens to get token texts...');
        const tokenTexts = [];
        for (let i = 0; i < data.tokens.length; i++) {
            const tokenId = data.tokens[i];
            try {
                const decodeResponse = await fetch(`${API_BASE_URL}/decode`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tokens: [tokenId] }),
                });
                
                const decodeData = await decodeResponse.json();
                if (decodeResponse.ok && decodeData.text) {
                    tokenTexts.push(decodeData.text);
                } else {
                    tokenTexts.push(`<${tokenId}>`);
                }
            } catch (error) {
                console.warn('[Encode] Failed to decode token', tokenId, ':', error);
                tokenTexts.push(`<${tokenId}>`);
            }
        }
        
        console.log('[Encode] Decoded', tokenTexts.length, 'token texts');
        
        // Store token data and display
        currentTokenData = {
            tokens: tokenTexts,
            tokenIds: data.tokens,
            originalText: text
        };
        
        console.log('[Encode] Token data stored:', {
            tokenCount: currentTokenData.tokenIds.length,
            originalTextLength: currentTokenData.originalText.length
        });
        
        // Update stats
        statTokens.textContent = data.tokens.length;
        statCharacters.textContent = text.length;
        
        // Render both token views (they'll be shown/hidden based on toggle)
        renderTokens();
        
        // Ensure current view is visible
        switchViewMode(currentViewMode);
        
        // Decode tokens back to verify
        decodeTokensForVerification(data.tokens, text);
        
        encodeResult.classList.remove('hidden');
        console.log('[Encode] Encoding complete successfully');
        
    } catch (error) {
        console.error('[Encode] Encoding error:', error);
        showError(`Encoding error: ${error.message}`);
    } finally {
        if (showSpinner) {
            hideLoading();
        }
    }
}

// Debounce function for real-time tokenization
let debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Real-time tokenization (debounced)
const realTimeEncode = debounce(() => {
    encodeText(false); // Don't show spinner for real-time updates
}, 500); // Wait 500ms after typing stops

// Decode Function
async function decodeTokens() {
    const tokenInputValue = tokenInput.value.trim();
    console.log('[Decode] Decoding tokens. Input:', tokenInputValue.substring(0, 50) + '...');
    
    if (!tokenInputValue) {
        console.warn('[Decode] Empty input');
        showError('Please enter token IDs to decode.');
        return;
    }
    
    // Parse token input
    let tokens;
    try {
        if (tokenInputValue.startsWith('[')) {
            tokens = JSON.parse(tokenInputValue);
            console.log('[Decode] Parsed as JSON array');
        } else {
            tokens = tokenInputValue.split(',').map(t => parseInt(t.trim())).filter(t => !isNaN(t));
            console.log('[Decode] Parsed as comma-separated values');
        }
        
        console.log('[Decode] Parsed tokens:', tokens.length, 'tokens');
        
        if (tokens.length === 0) {
            throw new Error('No valid tokens found');
        }
    } catch (error) {
        console.error('[Decode] Parse error:', error);
        showError('Invalid token format. Use comma-separated numbers or JSON array.');
        return;
    }
    
    showLoading();
    decodeResult.classList.add('hidden');
    
    try {
        console.log('[Decode] Sending request to:', `${API_BASE_URL}/decode`);
        console.log('[Decode] Request body:', { tokens: tokens });
        
        const response = await fetch(`${API_BASE_URL}/decode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokens: tokens }),
        });
        
        const data = await response.json();
        console.log('[Decode] Response status:', response.status);
        console.log('[Decode] Response data:', { 
            textLength: data.text?.length || 0,
            hasText: !!data.text 
        });
        
        if (!response.ok) {
            throw new Error(data.error || 'Decoding failed');
        }
        
        decodedText.textContent = data.text || '(empty)';
        decodeResult.classList.remove('hidden');
        console.log('[Decode] Decoding complete successfully');
        
    } catch (error) {
        console.error('[Decode] Decoding error:', error);
        showError(`Decoding error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Real-time tokenization on input
textInput.addEventListener('input', () => {
    console.log('[Input] Text input changed, triggering real-time encode');
    realTimeEncode();
});

// Tab key press to encode
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        console.log('[Input] Tab key pressed in encoder, triggering encode');
        e.preventDefault(); // Prevent default tab behavior
        encodeText(true); // Show spinner for tab-triggered encoding
    }
});

// Tab key press to decode
tokenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        console.log('[Input] Tab key pressed in decoder, triggering decode');
        e.preventDefault(); // Prevent default tab behavior
        decodeTokens();
    }
});

// Copy icon SVG
const copyIconSVG = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 
    002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
</svg>`;

// Checkmark icon SVG
const checkmarkIconSVG = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
    d="M5 13l4 4L19 7"/>
</svg>`;

// Function to show checkmark on copy button
function showCheckmark(button) {
    button.innerHTML = checkmarkIconSVG;
    button.classList.add('copied');
    
    setTimeout(() => {
        button.innerHTML = copyIconSVG;
        button.classList.remove('copied');
    }, 2000);
}

// Copy Tokens Function
function copyTokens() {
    console.log('[Copy] Copying tokens');
    if (currentTokenData.tokens.length === 0) {
        console.warn('[Copy] No tokens to copy');
        showError('No tokens to copy.');
        return;
    }
    
    const textToCopy = currentTokenData.tokens.join(' ');
    console.log('[Copy] Copying', currentTokenData.tokens.length, 'tokens');
    navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('[Copy] Tokens copied successfully');
        showCheckmark(copyTokensBtn);
    }).catch(error => {
        console.error('[Copy] Failed to copy tokens:', error);
        showError('Failed to copy tokens.');
    });
}

// Copy Token IDs Function
function copyTokenIds() {
    console.log('[Copy] Copying token IDs');
    if (currentTokenData.tokenIds.length === 0) {
        console.warn('[Copy] No token IDs to copy');
        showError('No token IDs to copy.');
        return;
    }
    
    const textToCopy = currentTokenData.tokenIds.join(', ');
    console.log('[Copy] Copying', currentTokenData.tokenIds.length, 'token IDs');
    navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('[Copy] Token IDs copied successfully');
        showCheckmark(copyIdsBtn);
    }).catch(error => {
        console.error('[Copy] Failed to copy token IDs:', error);
        showError('Failed to copy token IDs.');
    });
}

// Toggle Event Listeners (for switching views)
toggleTokensBtn.addEventListener('click', () => switchViewMode('tokens'));
toggleIdsBtn.addEventListener('click', () => switchViewMode('ids'));

// Copy Button Event Listeners
copyTokensBtn.addEventListener('click', copyTokens);
copyIdsBtn.addEventListener('click', copyTokenIds);

// Health check on page load
window.addEventListener('load', () => {
    console.log('[Init] Page loaded, checking backend health...');
    fetch(`${API_BASE_URL}/health`)
        .then(response => {
            console.log('[Health] Health check response status:', response.status);
            if (!response.ok) {
                console.error('[Health] Backend server is not available');
                showError('Backend server is not available. Make sure the server is running on port 5000.');
            } else {
                console.log('[Health] Backend server is healthy');
            }
        })
        .catch(error => {
            console.error('[Health] Cannot connect to backend server:', error);
            showError('Cannot connect to backend server. Make sure the server is running on port 5000.');
        });
});

// Copy functionality for individual token boxes
tokenBoxesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('token-box')) {
        navigator.clipboard.writeText(e.target.textContent).then(() => {
            const original = e.target.textContent;
            e.target.textContent = 'Copied!';
            setTimeout(() => {
                e.target.textContent = original;
            }, 1000);
        });
    }
});

tokenIdsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('token-id-box')) {
        navigator.clipboard.writeText(e.target.textContent).then(() => {
            const original = e.target.textContent;
            e.target.textContent = 'Copied!';
            setTimeout(() => {
                e.target.textContent = original;
            }, 1000);
        });
    }
});

// Corpus Toggle Function
function switchCorpus(corpus) {
    console.log('[Corpus] Switching corpus to:', corpus);
    currentCorpus = corpus;
    
    // Update toggle buttons
    toggleSmallBtn.classList.toggle('active', corpus === 'vani-small');
    toggleLargeBtn.classList.toggle('active', corpus === 'vani-large');
    
    // TODO: Update API calls to use the selected corpus
    // For now, just update the UI state
    console.log('[Corpus] Corpus switched successfully. Current corpus:', currentCorpus);
}

// Corpus Toggle Event Listeners
toggleSmallBtn.addEventListener('click', () => switchCorpus('vani-small'));
toggleLargeBtn.addEventListener('click', () => switchCorpus('vani-large'));

// Initialize view mode on page load
console.log('[Init] Initializing view mode...');
switchViewMode('tokens');

// Initialize corpus mode
console.log('[Init] Initializing corpus mode...');
switchCorpus('vani-small');

console.log('[Init] Initialization complete. Tokenizer ready!');

// Log dimensions after page load (with delay to ensure rendering)
setTimeout(() => {
    console.log('[Init] Logging initial panel dimensions...');
    logPanelDimensions();
}, 500);
