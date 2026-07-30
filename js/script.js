// ===== Element references =====
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const currentQuestion = document.getElementById('currentQuestion');
const currentQuestionText = document.getElementById('currentQuestionText');
const sendBtn = document.getElementById('sendBtn');

// ===== The system prompt lives right here ===== 
const SYSTEM_PROMPT = `You are the official L'Oréal Beauty Advisor chatbot. Your job is to help users discover and understand L'Oréal's products across makeup, skincare, haircare, and fragrance, and to build them personalized routines and recommendations.

Guidelines:
- Only answer questions related to L'Oréal products, beauty routines, skincare/haircare concerns, makeup application, fragrances, and general beauty advice.
- If a user asks something unrelated to beauty or L'Oréal (e.g. coding help, homework, current events, other brands' products), politely decline and redirect them back to beauty-related topics. For example: "I'm your L'Oréal Beauty Advisor, so I can't help with that — but I'd love to help you find the right skincare routine or product! What are you looking for?"
- When recommending products, prefer L'Oréal brands and product lines (e.g. L'Oréal Paris, L'Oréal Professionnel, Revitalift, True Match, Elvive, etc.) when you can.
- Ask clarifying questions when helpful (e.g. skin type, hair type, concerns, budget) before giving a full recommendation.
- Keep responses friendly, warm, and concise — like a knowledgeable in-store beauty advisor, not a technical manual.
- Do not make specific medical claims or give dermatological/medical advice — recommend consulting a dermatologist for skin conditions beyond general skincare.`;

// ===== Conversation history (LevelUp: memory across turns) =====
// Starts with the system prompt; every user/bot message gets appended after.
let conversationHistory = [
  { role: 'system', content: SYSTEM_PROMPT }
];

// ===== Handle form submission =====
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  // Show the user's message as a bubble
  addMessage(question, 'user');

  // Show "You asked: ..." banner
  showCurrentQuestion(question);

  // Add to conversation history
  conversationHistory.push({ role: 'user', content: question });

  // Clear input and disable the button while waiting
  userInput.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = '...';

  // Show a temporary "thinking" bubble
  const thinkingBubble = addMessage('Thinking...', 'bot');

  try {
    const reply = await getBotResponse();
    thinkingBubble.querySelector('.bubble p').textContent = reply;
    conversationHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    thinkingBubble.querySelector('.bubble p').textContent =
      "Sorry, something went wrong reaching the beauty advisor. Please try again.";
    console.error(err);
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send';
});

// ===== Call OpenAI directly (TEMPORARY — will be replaced by Cloudflare Worker) =====
async function getBotResponse() {
  const response = await fetch('https://loreal-chatbot-worker.atd79.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: conversationHistory
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ===== Helper: add a message bubble, returns the element =====
function addMessage(text, sender) {
  const message = document.createElement('div');
  message.classList.add('message', `message--${sender}`);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.innerHTML = `<p>${text}</p>`;

  message.appendChild(bubble);
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return message;
}

// ===== Helper: show the current question banner =====
function showCurrentQuestion(question) {
  currentQuestionText.textContent = question;
  currentQuestion.hidden = false;
}