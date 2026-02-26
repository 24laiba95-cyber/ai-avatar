document.addEventListener("DOMContentLoaded", function () {

const OPENAI_API_KEY = "YOUR_KEY_HERE";
  const container = document.getElementById("ai-avatar");

  container.innerHTML = `
    <div style="position:fixed;bottom:20px;right:120px;width:260px;z-index:9999;cursor:pointer;text-align:center;">
      <video id="avatar-video" muted loop autoplay playsinline 
        style="width:100%;border-radius:15px;transition:transform 0.3s ease;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <source src="https://assets.cdn.filesafe.space/1YLyTJHGfc98hfoM9Hsz/media/69a0762c9185ffca0c4c6587.mp4" type="video/mp4">
      </video>
      <div id="ai-label" style="margin-top:6px;font-weight:bold;">Click to Talk</div>
    </div>
  `;

  const avatar = container.querySelector("div");
  const video = document.getElementById("avatar-video");
  const label = document.getElementById("ai-label");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  avatar.addEventListener("click", () => {
    label.innerText = "Listening...";
    recognition.start();
  });

  recognition.onresult = async function(event) {

    const userText = event.results[0][0].transcript;
    label.innerText = "Thinking...";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful business AI assistant." },
            { role: "user", content: userText }
          ]
        })
      });

      const data = await response.json();

      if (!data.choices) {
        console.log(data);
        label.innerText = "Error. Check API key.";
        return;
      }

      const botReply = data.choices[0].message.content;

      const msg = new SpeechSynthesisUtterance(botReply);
      video.style.transform = "scale(1.05)";
      speechSynthesis.speak(msg);

      msg.onend = function() {
        video.style.transform = "scale(1)";
        label.innerText = "Click to Talk";
      };

    } catch (error) {
      console.error(error);
      label.innerText = "Error occurred";
    }

  };

});
