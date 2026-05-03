const chatDiv = document.getElementById('chat');
const inputField = document.getElementById('message-input');

// Твой секретный токен
const HF_TOKEN = "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"; 

// Память телефона
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
    if (!text) return;

    // Сохраняем сообщение пользователя
    history.push({ sender: 'user', text: text });
    localStorage.setItem('my_chat_history', JSON.stringify(history));
    renderMessages();
    inputField.value = '';

    // Показываем анимацию загрузки
    const thinkingDiv = document.createElement('div');
    thinkingDiv.classList.add('msg', 'bot');
    thinkingDiv.innerText = "Думаю... 👉👈";
    chatDiv.appendChild(thinkingDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;

    try {
        // Делаем запрос к легкой модели gpt2
        const response = await fetch("https://huggingface.co", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text })
        });

        const data = await response.json();
        chatDiv.removeChild(thinkingDiv); // Убираем надпись "Думаю"

        let botReply = "Ой... Что-то пошло не так (╥﹏╥)";
        
        // Достаем текст из ответа gpt2
        if (data && data[0] && data[0].generated_text) {
            botReply = data[0].generated_text;
        } else if (data.error) {
            botReply = "Ошибка: " + data.error;
        }

        // Сохраняем мой ответ
        history.push({ sender: 'bot', text: botReply });
        localStorage.setItem('my_chat_history', JSON.stringify(history));
        renderMessages();

    } catch (error) {
        chatDiv.removeChild(thinkingDiv);
        history.push({ sender: 'bot', text: "Ой... Не могу достучаться до сервера (╥﹏╥)" });
        localStorage.setItem('my_chat_history', JSON.stringify(history));
        renderMessages();
    }
}

renderMessages();
        
