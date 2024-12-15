import React, { useState, useEffect } from 'react';
import './SupportEngine.css';
import Avatar from './Avatar';

const SupportEngine = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setMessages([]); // Reset messages when chat is opened
      setShowOptions(false);

      const initialMessages = [
        { sender: 'bot', text: "Hey, it's Ruru, your virtual assistant!" },
        { sender: 'bot', text: 'How can I help you today?' },
      ];

      initialMessages.forEach((msg, index) => {
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, msg]);
          if (index === initialMessages.length - 1) setShowOptions(true);
        }, index * 1000);
      });
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: option },
    ]);
    setShowOptions(false);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: `You selected: "${option}"` },
      ]);
    }, 1000);
  };

  const handleUserInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: userMessage },
      ]);
      setUserMessage('');

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: "I'm still learning, but I'll try to help!" },
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      {!isOpen && <Avatar onClick={() => setIsOpen(true)} />}

      {isOpen && (
        <div className="support-engine">
          <div className="chat-header">
            <h3>Ruru - Virtual Assistant</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>

          <div className="chat-body">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === 'bot' ? 'bot-message' : 'user-message'
                }`}
              >
                <div className="message-icon">
                  {message.sender === 'bot' ? (
                    <img
                      src="https://i.pinimg.com/736x/77/d0/10/77d010471d917c115521c05add2d4854.jpg"
                      alt="avatar"
                    />
                  ) : (
                    '👤'
                  )}
                </div>
                <p>{message.text}</p>
              </div>
            ))}

            {showOptions && (
              <div className="chat-options-container">
                <button onClick={() => handleOptionClick('How to book?')}>
                  How to book?
                </button>
                <button
                  onClick={() =>
                    handleOptionClick('What are the available shipping lines?')
                  }
                >
                  What are the available shipping lines?
                </button>
                <button onClick={() => handleOptionClick('What is the payment method?')}>
                  What is the payment method?
                </button>
                <button onClick={() => handleOptionClick('More')}>More</button>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={handleUserInputChange}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportEngine;
