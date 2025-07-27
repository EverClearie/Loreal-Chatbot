/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial welcome message
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! How can I help you today?</div>`;

// Replace this with your Cloudflare Worker endpoint
const CLOUDFLARE_ENDPOINT = 'https://loreal-chatbot.ncope232001.workers.dev';

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Display user's message in a styled bubble
  chatWindow.innerHTML += `<div class="msg user">${message}</div>`;
  userInput.value = "";

  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Show "typing..." message
  chatWindow.innerHTML += `<div class="msg ai typing">...</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(CLOUDFLARE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for L'Oréal. Only answer questions about L'Oréal products, routines, and beauty care. Politely refuse off-topic questions."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";

    // Remove typing message
    const typingEl = document.querySelector(".typing");
    if (typingEl) typingEl.remove();

    // Show assistant's response
    chatWindow.innerHTML += `<div class="msg ai">${aiMessage}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    console.error("Error:", error);

    const typingEl = document.querySelector(".typing");
    if (typingEl) typingEl.remove();

    chatWindow.innerHTML += `<div class="msg ai error">⚠️ Something went wrong. Please try again.</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
