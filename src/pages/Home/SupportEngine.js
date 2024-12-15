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

      // Messages to display with delay
      const initialMessages = [
        { sender: 'bot', text: "Hey, it's Ruru, your virtual assistant!" },
        { sender: 'bot', text: 'How can I help you today?' },
      ];

      // Add messages one by one with delay
      initialMessages.forEach((msg, index) => {
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, msg]);
          if (index === initialMessages.length - 1) setShowOptions(true); // Show options after messages
        }, index * 1000); // Delay of 1 second for each message
      });
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: option },
    ]);
    setShowOptions(false); // Hide options after a selection

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: `You selected: "${option}"` },
      ]);
    }, 1000); // Delay response for 1 second
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
