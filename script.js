/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial welcome message
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! How can I help you today?</div>`;

// Your Cloudflare Worker endpoint
const CLOUDFLARE_ENDPOINT = 'https://loreal-chatbot.ncope232001.workers.dev';

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Display user's message
  chatWindow.innerHTML += `<div class="msg user">${message}</div>`;
  userInput.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Show "typing..." message
  const typingEl = document.createElement("div");
  typingEl.className = "msg ai typing";
  typingEl.textContent = "...";
  chatWindow.appendChild(typingEl);
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
              "You are a helpful assistant for L'Oréal. Only answer questions about L'Oréal products, skincare, haircare, fragrances, and routines. Politely decline anything off-topic."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const aiMessage = data.reply || "Sorry, I couldn’t generate a response.";

    // Remove typing placeholder
    typingEl.remove();

    // Display AI response
    chatWindow.innerHTML += `<div class="msg ai">${aiMessage}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (error) {
    console.error("Error:", error);

    typingEl.remove();
    chatWindow.innerHTML += `<div class="msg ai error">⚠️ Something went wrong. Please try again.</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
