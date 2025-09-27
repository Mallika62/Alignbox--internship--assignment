
// Elements
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const anonymousToggle = document.getElementById('anonymousToggle');
const anonymousIcon = document.getElementById('anonymousIcon');

// Max number of messages to keep
const MAX_MESSAGES = 50;

// Identify user by page
const currentUser = location.pathname.endsWith('index.html') ? 'Roopa' : 'Mallika';

// Load messages from localStorage and display
function loadMessages() {
    chatMessages.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const latestMessages = messages.slice(-MAX_MESSAGES);
    latestMessages.forEach(msg => {
        const isOwn = msg.sender === currentUser;
        const displayName = isOwn ? '' : (currentUser === 'Roopa' ? 'Mallika' : 'Roopa');

        // If message is sent anonymously, show sender as "Anonymous"
        const senderName = msg.anonymous && !isOwn ? 'Anonymous' : displayName;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'mb-2';
        msgDiv.innerHTML = `
            <div class="d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'}">
                <div class="p-2 rounded ${isOwn ? 'bg-primary text-white' : 'bg-secondary text-white'}" style="max-width:70%;">
                    <small class="d-block">${senderName}</small>
                    ${msg.text}
                </div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a new message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Get existing messages
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

    // Add new message with anonymous flag
    messages.push({
        sender: currentUser,
        text,
        anonymous: anonymousToggle.checked
    });

    // Trim if too many messages
    if (messages.length > MAX_MESSAGES) {
        messages = messages.slice(-MAX_MESSAGES);
    }

    localStorage.setItem('chatMessages', JSON.stringify(messages));
    messageInput.value = '';
    loadMessages();
}

// Update anonymous icon and title based on toggle state
function updateAnonymousIcon(isAnonymous) {
    if (isAnonymous) {
        anonymousIcon.classList.remove('fa-eye');
        anonymousIcon.classList.add('fa-eye-slash');
        anonymousIcon.title = "Anonymous enabled";
    } else {
        anonymousIcon.classList.remove('fa-eye-slash');
        anonymousIcon.classList.add('fa-eye');
        anonymousIcon.title = "Anonymous disabled";
    }
}

// Load anonymous toggle state from localStorage on page load
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

// Listen for localStorage changes from other tabs
window.addEventListener('storage', e => {
    if (e.key === 'chatMessages') loadMessages();
    if (e.key === 'sendAnonymous') {
        loadAnonymousSetting();
    }
});

// Initial load
loadMessages();
loadAnonymousSetting();
