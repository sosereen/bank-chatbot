async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();

    if (message === "") return;

    chatBox.innerHTML += `
        <p><strong>أنت:</strong> ${message}</p>
    `;

    input.value = "";

    chatBox.innerHTML += `
        <p><strong>المساعد:</strong> جاري التفكير...</p>
    `;

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        chatBox.lastElementChild.innerHTML = `
            <strong>المساعد:</strong> ${data.reply}
        `;
    } catch (error) {
        chatBox.lastElementChild.innerHTML = `
            <strong>المساعد:</strong> حدث خطأ في الاتصال بالسيرفر.
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}