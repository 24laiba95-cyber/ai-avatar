document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("ai-avatar");

  container.innerHTML = `
    <div style="position:fixed;bottom:20px;right:120px;width:260px;z-index:9999;cursor:pointer;text-align:center;">
      <video id="avatar-video" muted loop autoplay playsinline style="width:100%;border-radius:15px;transition:transform 0.3s ease;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <source src="https://assets.cdn.filesafe.space/1YLyTJHGfc98hfoM9Hsz/media/69a0762c9185ffca0c4c6587.mp4" type="video/mp4">
      </video>
      <div id="ai-label" style="margin-top:6px;font-weight:bold;">Click to Talk</div>
    </div>
  `;

  const avatar = container.querySelector("div");
  const video = document.getElementById("avatar-video");
  const label = document.getElementById("ai-label");

  const BOT_ID = "<script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></script>
<script src="https://files.bpcontent.cloud/2026/02/26/08/20260226085038-G3HUPUZH.js" defer></script>";
  const API_KEY = "bp_bak_6yfil_P_yaylwB_wEzsw1-Cw33uaPJ-R9GsK";

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

    const response = await fetch(
      "https://api.botpress.cloud/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          botId: BOT_ID,
          messages: [{ role: "user", content: userText }]
        })
      }
    );

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    const msg = new SpeechSynthesisUtterance(botReply);
    video.style.transform = "scale(1.05)";
    speechSynthesis.speak(msg);

    msg.onend = function() {
      video.style.transform = "scale(1)";
      label.innerText = "Click to Talk";
    };
  };

});
