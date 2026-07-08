function ChatInput({ input, setInput, onSend }) {
  return (
    <div className="input-area">
      <input
        type="text"
        placeholder="اكتب رسالتك..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={onSend}>
        إرسال
      </button>
    </div>
  );
}

export default ChatInput;
