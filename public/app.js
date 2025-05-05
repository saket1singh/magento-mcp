document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeButton = document.getElementById('closeButton');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Toggle chat window visibility
    chatButton.addEventListener('click', () => {
        chatWindow.classList.add('active');
    });

    closeButton.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle quick action buttons
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList && target.classList.contains('quick-action-btn')) {
            const action = target.getAttribute('data-action');
            handleQuickAction(action);
        }
    });

    // Handle quick actions
    function handleQuickAction(action) {
        let message = '';
        switch (action) {
            case 'list':
                message = 'Show me all products';
                break;
            case 'stock':
                message = 'What products can I check stock for?';
                break;
            case 'search':
                message = 'I want to search for products';
                break;
            case 'help':
                message = 'Help';
                break;
        }
        addMessage(message, 'user');
        getBotResponse(message);
    }

    // Handle sending messages
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');
            userInput.value = '';

            // Get bot response
            getBotResponse(message);
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Format message text with HTML
    function formatMessage(text) {
        // Replace markdown-style bold with HTML
        text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        
        // Format product lists
        if (text.includes('Here are the products')) {
            const parts = text.split('\n\n');
            let formattedText = parts[0] + '<div class="product-list">';
            
            parts.slice(1).forEach(part => {
                if (part.match(/^\d+\./)) {
                    formattedText += '<div class="product-item">';
                    const lines = part.split('\n');
                    formattedText += `<div class="product-name">${lines[0].replace(/^\d+\.\s*/, '')}</div>`;
                    formattedText += '<div class="product-details">';
                    lines.slice(1).forEach(line => {
                        formattedText += `<div>${line.trim()}</div>`;
                    });
                    formattedText += '</div></div>';
                } else {
                    formattedText += `<p>${part}</p>`;
                }
            });
            
            formattedText += '</div>';
            return formattedText;
        }
        
        return text.replace(/\n/g, '<br>');
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `<p>${text}</p>`;
        } else {
            messageDiv.innerHTML = formatMessage(text);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get bot response
    async function getBotResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            addMessage(data.content, 'bot');
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }
}); 