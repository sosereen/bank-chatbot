function ChatMessages({ messages }) {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div
          key={index}
          className={message.sender === "bot" ? "bot-message" : "user-message"}
        >
          {message.type === "service_steps" ? (
            <div className="service-card">
              <h3>
                {message.language === "en"
                  ? message.service.service_en
                  : message.service.service_ar}
              </h3>

              <ol>
                {(message.language === "en"
                  ? message.service.steps_en
                  : message.service.steps_ar
                ).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ) : (
            message.text
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;