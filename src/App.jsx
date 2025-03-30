import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { getChatResponse } from "./api";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you with cohort discovery?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const botReplyText = await getChatResponse(input);
    const botMessage = { sender: "bot", text: formatBotResponse(botReplyText) };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const formatBotResponse = (text) => {
    return text
      .replace("**SQL:**", "🧠 **Here's the SQL query you'd use:**")
      .replace("**Python (Pandas):**", "🐍 **And this is how you'd do it in Python:**");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isTyping && <div className="message bot">Typing...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
