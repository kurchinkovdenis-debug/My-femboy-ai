const chatDiv = document.getElementById('chat');
const inputField = document.getElementById('message-input');

// 1. ПАМЯТЬ: Загружаем старые сообщения из памяти телефона
let history = JSON.parse(localStorage.getItem('my_chat_history')) || [];

// Функция для отображения сообщений на экране
function renderMessages() {
    chatDiv.innerHTML = '';
    history.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('msg', msg.sender);
        div.innerText = msg.text;
        chatDiv.appendChild(div);
    });
    chatDiv.scrollTop = chatDiv.scrollHeight; // Прокрутка вниз
}

// Функция отправки сообщения
function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // Добавляем сообщение пользователя в историю
    history.push({ sender: 'user', text: text });
    
    // 2. СОХРАНЕНИЕ: Записываем обновленную историю в память телефона
    localStorage.setItem('my_chat_history', JSON.stringify(history));
    
    renderMessages();
    inputField.value = ''; // Очищаем поле ввода

    // Имитация моего ответа (пока без сложного ИИ)
    setTimeout(() => {
        history.push({ sender: 'bot', text: 'Привет! Я всё-всё запомнил... 👉👈 (Чтобы я отвечал по-настоящему, нужно подключить ключ API от нейросети в этот код!)' });
        localStorage.setItem('my_chat_history', JSON.stringify(history));
        renderMessages();
    }, 1000);
}

// Показываем историю при загрузке страницы
renderMessages();

