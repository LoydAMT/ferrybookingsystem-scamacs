import React, { useState, useEffect } from 'react';
import './SupportEngine.css';
import Avatar from './Avatar';

const SupportEngine = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(''); // Tracks user interaction state
  const [showYesNo, setShowYesNo] = useState(false); // For Yes/No options

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setCurrentQuestion('');
      const initialMessages = [
        { sender: 'bot', text: "Hey, it's Ruru, your virtual assistant!" },
        { sender: 'bot', text: 'How can I help you today?' },
      ];
      initialMessages.forEach((msg, index) => {
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }, index * 1000);
      });
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: option },
    ]);

    let botResponse = '';

    switch (option) {
      case 'How to book?':
        botResponse = `To book your trip, check the schedule for available departures and select your preferred time.<br>
          You can then proceed with booking by following the prompts.<br>
          <a href="https://swiftsail-ferries.vercel.app/schedule" target="_blank" rel="noopener noreferrer">
            View Schedule
          </a>`;
        setCurrentQuestion('');
        setShowYesNo(false);
        break;

      case 'What are the available shipping lines?':
        botResponse = `We currently offer the following shipping lines for travel:<br>
          - Swift Sail Ferries<br>
          - BlueWave Travels<br>
          - Horizon Marine Lines<br>
          Click below to view all available shipping companies:<br>
          <a href="https://swiftsail-ferries.vercel.app/companies" target="_blank" rel="noopener noreferrer">
            View Companies
          </a>`;
        setCurrentQuestion('');
        setShowYesNo(false);
        break;

      case 'What is the payment method?':
        botResponse = `We accept:<br>
          - Credit/Debit Cards<br>
          - PayPal<br>
          - Bank Transfers<br>
          Payments are securely processed on our platform.`;
        setCurrentQuestion('');
        setShowYesNo(false);
        break;

      case 'More':
        botResponse = `Would you like to talk to a virtual agent for further assistance?<br>
          Click "Yes" to connect or "No" to continue chatting with me.`;
        setCurrentQuestion('More');
        setShowYesNo(false);
        break;

      case 'Yes':
        botResponse = `You chose to talk to a virtual agent. This feature is not available yet, but I’m here to help!`;
        setCurrentQuestion('');
        setShowYesNo(false);
        break;

      case 'No':
        botResponse = `Alright, feel free to ask me anything else or choose an option below.`;
        setCurrentQuestion('');
        setShowYesNo(false);
        break;

      default:
        botResponse = "I'm not sure about that, but I can assist you with booking or schedules!";
        setShowYesNo(false);
        break;
    }

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botResponse },
      ]);
      if (option === 'More') {
        setTimeout(() => setShowYesNo(true), 500); // Delay Yes/No options
      }
    }, 1000);
  };

  const renderOptions = () => {
    if (currentQuestion === 'More' && showYesNo) {
      return (
        <div className="chat-options-container">
          <button onClick={() => handleOptionClick('Yes')}>Yes</button>
          <button onClick={() => handleOptionClick('No')}>No</button>
        </div>
      );
    }

    // Default options
    return (
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
    );
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
                <p dangerouslySetInnerHTML={{ __html: message.text }} />
              </div>
            ))}

            {renderOptions()}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={() => handleOptionClick(userMessage)}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportEngine;
