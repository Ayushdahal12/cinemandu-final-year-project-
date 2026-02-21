import { useState, useRef, useEffect } from "react";
import axios from "axios";

const QUICK_QUESTIONS = [
  "Rate this movie out of 10",
  "What is this movie about?",
  "Should I watch this?",
  "Who is the main actor?",
  "How long is this movie?",
];

const AIMovieChatbot = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Welcome message when first opened
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `🎬 Hi! I'm CineAI, your movie assistant for **${movie?.title}**. Ask me anything — plot, cast, reviews, or whether you should watch it! 🍿`,
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/ai/movie-chat", {
        movie,
        messages: newMessages.slice(-8), // last 8 messages for context
        userMessage: userText,
      });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had a problem. Please try again! 😅" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .chatbot-wrapper {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 1000;
        }

        /* Floating Button */
        .chat-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5c518, #e6a800);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 8px 32px rgba(245,197,24,0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .chat-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(245,197,24,0.5);
        }

        .chat-fab-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(245,197,24,0.4);
          animation: fabPulse 2s infinite;
        }

        @keyframes fabPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .chat-label {
          position: absolute;
          right: 70px;
          background: rgba(0,0,0,0.85);
          color: #f5c518;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          border: 1px solid rgba(245,197,24,0.2);
          pointer-events: none;
        }

        /* Popup */
        .chat-popup {
          position: absolute;
          bottom: 74px;
          right: 0;
          width: 370px;
          background: #0f1117;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          height: 500px;
        }

        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); transform-origin: bottom right; }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Header */
        .chat-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(245,197,24,0.12), rgba(245,197,24,0.04));
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #f5c518, #e6a800);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .chat-header-info h4 {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 2px;
        }

        .chat-header-info p {
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          margin: 0;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          background: #00e676;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
          animation: aiPulse2 2s infinite;
        }

        @keyframes aiPulse2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .close-btn {
          background: rgba(255,255,255,0.08);
          border: none;
          color: rgba(255,255,255,0.6);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }

        /* Movie context bar */
        .movie-context {
          padding: 10px 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .movie-context span {
          color: rgba(255,255,255,0.35);
          font-size: 11px;
        }

        .movie-context strong {
          color: #f5c518;
          font-size: 11px;
        }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .msg {
          max-width: 85%;
          animation: msgIn 0.3s ease;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg.user {
          align-self: flex-end;
        }

        .msg.assistant {
          align-self: flex-start;
        }

        .msg-bubble {
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.6;
        }

        .msg.user .msg-bubble {
          background: linear-gradient(135deg, #f5c518, #e6a800);
          color: #000;
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }

        .msg.assistant .msg-bubble {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.88);
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* Quick questions */
        .quick-questions {
          padding: 0 16px 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .quick-q {
          padding: 5px 12px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 50px;
          color: rgba(245,197,24,0.8);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .quick-q:hover {
          background: rgba(245,197,24,0.15);
          color: #f5c518;
        }

        /* Typing indicator */
        .typing {
          display: flex;
          gap: 4px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.07);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }

        .typing span {
          width: 7px;
          height: 7px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          animation: typingDot 1.2s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* Input */
        .chat-input-area {
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          gap: 10px;
          align-items: flex-end;
          background: rgba(0,0,0,0.3);
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          resize: none;
          outline: none;
          line-height: 1.5;
          max-height: 80px;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: rgba(245,197,24,0.4);
        }

        .chat-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f5c518, #e6a800);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-popup {
            width: calc(100vw - 32px);
            right: -14px;
          }
        }
      `}</style>

      <div className="chatbot-wrapper">
        {/* Floating Button */}
        {!isOpen && (
          <button className="chat-fab" onClick={() => setIsOpen(true)}>
            <div className="chat-fab-pulse" />
            🤖
            <div className="chat-label">Ask AI about this movie</div>
          </button>
        )}

        {/* Chat Popup */}
        {isOpen && (
          <div className="chat-popup">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-avatar">🎬</div>
                <div className="chat-header-info">
                  <h4>CineAI Assistant</h4>
                  <p><span className="online-dot" />By cinemandu.pvt.ltd</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Movie context */}
            <div className="movie-context">
              <span>🎞️ Talking about:</span>
              <strong>{movie?.title}</strong>
              <span>• {movie?.genre} • {movie?.language}</span>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role}`}>
                  <div className="msg-bubble">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="msg assistant">
                  <div className="typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions — only show at start */}
            {messages.length <= 1 && (
              <div className="quick-questions">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="quick-q" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <textarea
                className="chat-input"
                rows={1}
                placeholder="Ask anything about this movie..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* FAB when popup is open */}
        {isOpen && (
          <button className="chat-fab" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        )}
      </div>
    </>
  );
};

export default AIMovieChatbot;