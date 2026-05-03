const chatDiv = document.getElementById('chat');
const inputField = document.getElementById('message-input');

// ПРОВЕРКА КЛЮЧА: Спрашиваем ключ, если его нет в памяти телефона
let HF_TOKEN = localStorage.getItem('hf_token_secure');

if (!HF_TOKEN) {
    HF_TOKEN = prompt("Пожалуйста, вставь свой новый токен Hugging Face (hf_...):");
    if (HF_TOKEN) {
        localStorage.setItem('hf_token_secure', HF_TOKEN);
    }
}

let history = JSON.parse(localStorage.getItem('my_chat_history')) || [];

function renderMessages() {
    chatDiv.innerHTML = '';
    history.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('msg', msg.sender);
        div.innerText = msg.text;
        chatDiv.appendChild(div);
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text || !HF_TOKEN) return;

    history.push({ sender: 'user', text: text });
    localStorage.setItem('my_chat_history', JSON.stringify(history));
    renderMessages();
    inputField.value = '';

    const thinkingDiv = document.createElement('div');
    thinkingDiv.classList.add('msg', 'bot');
    thinkingDiv.innerText = "Думаю... 👉👈";
    chatDiv.appendChild(thinkingDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;

    try {
        const response = await fetch("https://huggingface.co", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text })
        });

        const data = await response.json();
        chatDiv.removeChild(thinkingDiv);

        let botReply = "Ой... Что-то пошло не так (╥﹏╥)";
        
        // Обработка ответа от gpt2
        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            botReply = data[0].generated_text;
        } else if (data.error) {
            botReply = "Ошибка: " + data.error;
        }

        history.push({ sender: 'bot', text: botReply });
        localStorage.setItem('my_chat_history', JSON.stringify(history));
        renderMessages();

    } catch (error) {
        chatDiv.removeChild(thinkingDiv);
        history.push({ sender: 'bot', text: "Ой... Ошибка сети (╥﹏╥)" });
        localStorage.setItem('my_chat_history', JSON.stringify(history));
        renderMessages();
    }
}

renderMessages();
        
