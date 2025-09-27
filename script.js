const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const anonymousToggle = document.getElementById('anonymousToggle');
const anonymousIcon = document.getElementById('anonymousIcon');

const MAX_MESSAGES = 50;

// Determine current user based on filename
const path = location.pathname.toLowerCase();

let currentUser = 'Unknown';
if (path.endsWith('roopa.html')) {
  currentUser = 'Roopa';
} else if (path.endsWith('mallika.html')) {
  currentUser = 'Mallika';
}

// Load messages and render chat
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
  const latestMessages = messages.slice(-MAX_MESSAGES);

  chatMessages.innerHTML = '';

  latestMessages.forEach(msg => {
    const isOwn = msg.sender === currentUser;
    let displayName = '';

    if (!isOwn) {
      displayName = msg.anonymous ? 'Anonymous' : msg.sender;
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = 'mb-2';

    msgDiv.innerHTML = `
      <div class="d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'}">
        <div class="p-2 rounded ${isOwn ? 'bg-primary text-white' : 'bg-secondary text-white'}" style="max-width: 70%;">
          <small class="d-block">${displayName}</small>
          ${escapeHtml(msg.text)}
        </div>
      </div>
    `;

    chatMessages.appendChild(msgDiv);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape text to prevent HTML injection
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Send message handler
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

  messages.push({
    sender: currentUser,
    text,
    anonymous: anonymousToggle.checked
  });

  if (messages.length > MAX_MESSAGES) {
    messages = messages.slice(-MAX_MESSAGES);
  }

  localStorage.setItem('chatMessages', JSON.stringify(messages));

  messageInput.value = '';
  loadMessages();
}

// Update eye icon and tooltip for anonymous toggle
function updateAnonymousIcon(isAnonymous) {
  if (isAnonymous) {
    anonymousIcon.classList.remove('fa-eye');
    anonymousIcon.classList.add('fa-eye-slash');
    anonymousIcon.title = 'Anonymous enabled';
  } else {
    anonymousIcon.classList.remove('fa-eye-slash');
    anonymousIcon.classList.add('fa-eye');
    anonymousIcon.title = 'Anonymous disabled';
  }
}

// Load anonymous toggle state from localStorage
function loadAnonymousSetting() {
  const stored = localStorage.getItem('sendAnonymous');
  const isAnonymous = stored === 'true';
  anonymousToggle.checked = isAnonymous;
  updateAnonymousIcon(isAnonymous);
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

anonymousToggle.addEventListener('change', () => {
  const isAnonymous = anonymousToggle.checked;
  localStorage.setItem('sendAnonymous', isAnonymous);
  updateAnonymousIcon(isAnonymous);
});

// Listen for storage events to sync between tabs
window.addEventListener('storage', e => {
  if (e.key === 'chatMessages') {
    loadMessages();
  }
  if (e.key === 'sendAnonymous') {
    loadAnonymousSetting();
  }
});

// Initial load
loadMessages();
loadAnonymousSetting();
