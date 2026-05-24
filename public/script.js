const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Keep track of the conversation history for the API
const conversationHistory = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Add user message to chat box UI
  appendMessage('user', userMessage);

  // 2. Add to conversation history (with role 'user')
  conversationHistory.push({ role: 'user', text: userMessage });

  // Clear input
  input.value = '';

  // 3. Add temporary "Thinking..." bot message to UI
  const thinkingMessageElement = appendMessage('bot', 'Thinking...');

  // Disable inputs during request to prevent duplicate submissions or race conditions
  input.disabled = true;
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  try {
    // 4. Send conversation history to backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation: conversationHistory })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 5. Replace "Thinking..." with the actual response or error messages
    if (data && data.result) {
      renderMarkdown(thinkingMessageElement, data.result);
      // Add model's response to conversation history (with role 'model')
      conversationHistory.push({ role: 'model', text: data.result });
    } else {
      thinkingMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error contacting chatbot API:', error);
    thinkingMessageElement.textContent = 'Failed to get response from server.';
  } finally {
    // Re-enable inputs
    input.disabled = false;
    if (submitButton) submitButton.disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// Helper to safely parse markdown to HTML and sanitize it to prevent XSS
function renderMarkdown(element, text) {
  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
    const rawHtml = marked.parse(text);
    element.innerHTML = DOMPurify.sanitize(rawHtml);
  } else {
    // Fallback if CDN libraries failed to load
    element.textContent = text;
  }
}

function appendMessage(sender, text) {
  // Hide empty state greeting if it exists
  const emptyState = document.getElementById('empty-state');
  if (emptyState) {
    emptyState.style.display = 'none';
  }

  // Create chat row container
  const row = document.createElement('div');
  row.classList.add('chat-row', sender);

  // Create avatar element
  const avatar = document.createElement('div');
  avatar.classList.add('avatar', `${sender}-avatar`);

  if (sender === 'user') {
    // User initial "R" (from Rizki) or profile icon
    avatar.textContent = 'R';
  } else {
    // Bot sparkle star SVG with premium Gemini gradient fill
    avatar.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" class="gemini-star-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4285f4" />
            <stop offset="50%" stop-color="#9b72cb" />
            <stop offset="100%" stop-color="#d96570" />
          </linearGradient>
        </defs>
        <path fill="url(#geminiGrad)" d="M12 3C12 7.97 7.97 12 3 12 C7.97 12 12 16.03 12 21 C12 16.03 16.03 12 21 12 C16.03 12 12 7.97 12 3 Z" />
      </svg>
    `;
  }

  // Create message content element
  const content = document.createElement('div');
  content.classList.add('message-content');
  renderMarkdown(content, text);

  // Assemble and append
  row.appendChild(avatar);
  row.appendChild(content);
  chatBox.appendChild(row);

  chatBox.scrollTop = chatBox.scrollHeight;
  return content;
}


