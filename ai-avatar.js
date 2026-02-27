// ===============================
// CONFIG
// ===============================

const BOT_ID = "e62a3963-a16b-4c6b-b7d6-3ebc59948c63";
const ELEVEN_API_KEY = "sk_661907e01aea98d211af20b29d346f49f2b7013c1e7226b0";
const ELEVEN_VOICE_ID = "9IzcwKmvwJcw58h3KnlH";

// ===============================
// CREATE SIMPLE UI
// ===============================

document.body.innerHTML += `
<div style="position:fixed;bottom:20px;right:20px;width:320px;background:#111;padding:10px;border-radius:10px;z-index:9999">
  <video id="avatarVideo" width="100%" autoplay loop muted>
    <source src="https://assets.cdn.filesafe.space/1YLyTJHGfc98hfoM9Hsz/media/69a0762c9185ffca0c4c6587.mp4" type="video/mp4">
  </video>
  <button id="talkBtn" style="width:100%;padding:10px;margin-top:10px;background:#0f62fe;color:white;border:none;border-radius:5px">
    Talk
  </button>
</div>
`;

// ===============================
// VOICE RECOGNITION
// ===============================

const talkBtn = document.getElementById("talkBtn");

talkBtn.onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = async function (event) {
    const userText = event.results[0][0].transcript;
    sendToBotpress(userText);
  };
};

// ===============================
// SEND TO BOTPRESS
// ===============================

async function sendToBotpress(text) {

  const response = await fetch(`https://api.botpress.cloud/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-bot-id": BOT_ID
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: text }]
    })
  });

  const data = await response.json();
  const botReply = data.choices[0].message.content;

  generateVoice(botReply);
}

// ===============================
// ELEVENLABS VOICE
// ===============================

async function generateVoice(text) {

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVEN_API_KEY
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2"
    })
  });

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  const audio = new Audio(audioUrl);
  audio.play();
}
