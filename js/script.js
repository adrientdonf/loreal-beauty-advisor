// ===== Element references =====
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const currentQuestion = document.getElementById('currentQuestion');
const currentQuestionText = document.getElementById('currentQuestionText');

// ===== Handle form submission =====
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  // Show the user's message as a bubble
  addMessage(question, 'user');

  // Show "You asked: ..." banner above where the response will appear
  showCurrentQuestion(question);

  // Clear the input field
  userInput.value = '';

  // Placeholder bot response (we'll replace this with a real OpenAI call next)
  addMessage('(placeholder response — OpenAI connection comes next)', 'bot');
});

// ===== Helper: add a message bubble to the chat window =====
function addMessage(text, sender) {
  const message = document.createElement('div');
  message.classList.add('message', `message--${sender}`);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.innerHTML = `<p>${text}</p>`;

  message.appendChild(bubble);
  chatWindow.appendChild(message);

  // Auto-scroll to the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ===== Helper: show the current question banner =====
function showCurrentQuestion(question) {
  currentQuestionText.textContent = question;
  currentQuestion.hidden = false;
}