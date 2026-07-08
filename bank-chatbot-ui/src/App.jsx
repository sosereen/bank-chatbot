import { useState } from "react";
import Header from "./components/Header";
import ChatMessages from "./components/ChatMessages";
import QuickActions from "./components/QuickActions";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "أهلاً بك 👋 كيف أقدر أساعدك اليوم؟" }
  ]);

  const [input, setInput] = useState("");

  async function sendMessage(text) {
  const messageText = text || input;

  if (messageText.trim() === "") return;

  // أضف رسالة المستخدم مباشرة
  setMessages((prev) => [
    ...prev,
    { sender: "user", text: messageText }
  ]);

  setInput("");

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: data.reply,
        type: data.type,
        service: data.service,
      },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "حدث خطأ أثناء الاتصال بالخادم.",
      },
    ]);

    console.error(error);
  }
}

  return (
    <div className="app">
      <div className="chat-card">
        <Header />

        <ChatMessages messages={messages} />

        <QuickActions onActionClick={sendMessage} />

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => sendMessage()}
        />
      </div>
    </div>
  );
}

export default App;