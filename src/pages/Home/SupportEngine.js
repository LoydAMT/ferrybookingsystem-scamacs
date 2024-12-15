import React, { useState, useEffect } from 'react';
import './SupportEngine.css';
import Avatar from './Avatar';

const SupportEngine = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate an initial bot message when the component loads
    setMessages([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
  }, []);

  const handleUserInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setMessages([...messages, { sender: 'user', text: userMessage }]);
      setUserMessage('');

      setTimeout(() => {
        const botResponse = 'Thank you for your message! How else can I help?';
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Avatar that opens the chat */}
      {!isOpen && <Avatar onClick={() => setIsOpen(true)} />}

      {/* Chatbox */}
      {isOpen && (
        <div className="support-engine active">
          <div className="chat-header">
            <span>Ruru</span>
            <span className="close-button" onClick={() => setIsOpen(false)}>
              &times;
            </span>
          </div>

          <div className="chatbox">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={userMessage}
                onChange={handleUserInputChange}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportEngine;
