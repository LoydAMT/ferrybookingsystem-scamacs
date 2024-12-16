import React, { useState, useEffect, useRef } from 'react';
import './SupportEngine.css';
import Avatar from './Avatar';
import translations from './translations'; // Import translations file

const SupportEngine = () => {
  const [messages, setMessages] = useState([]); // Stores all messages
  const [userMessage, setUserMessage] = useState(''); // User's input message
  const [isOpen, setIsOpen] = useState(false); // Controls chat visibility
  const [showOptions, setShowOptions] = useState([]); // Options displayed dynamically
  const [language, setLanguage] = useState('en'); // Default language (English)
  const t = translations[language]; // Load translations for the selected language
  const chatEndRef = useRef(null); // Reference for auto-scrolling

  // Auto-scroll to the bottom when messages are updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const initialMessages = [
        { sender: 'bot', text: t.greeting1 },
        { sender: 'bot', text: t.greeting2 },
        { sender: 'bot', text: t.greeting3 },
      ];

      if (messages.length === 0) {
        // Show initial messages on first open
        initialMessages.forEach((msg, index) => {
          setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            if (index === initialMessages.length - 1) {
              setTimeout(() => setShowOptions(t.options), 500);
            }
          }, index * 1000);
        });
      } else {
        setTimeout(() => setShowOptions(t.options), 500);
      }
    }
  }, [isOpen, language]);

  const handleOptionClick = (option) => {
    const t = translations[language]; // Dynamically fetch translations
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: option }]);
    setShowOptions([]); // Temporarily hide options while processing response

    let botResponse = '';

    switch (option) {
      case t.options[0]: // "How to book?"
        botResponse = t.howToBook;
        break;

      case t.options[1]: // "What are the available shipping lines?"
        botResponse = t.shippingLines;
        break;

      case t.options[2]: // "What is the payment method?"
        botResponse = t.paymentMethod;
        break;

      case t.options[3]: // "More"
        botResponse = t.more;
        setTimeout(() => setShowOptions(['Yes', 'No']), 500);
        break;

      case 'Yes':
        botResponse = t.yes;
        break;

      case 'No':
        botResponse = t.no;
        break;

      case t.options[4]: // "Change Language"
        botResponse = t.languagePrompt;
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
        setShowOptions(['English', 'Korean', 'Japanese']); // Immediately update options
        return;

      case 'English':
        setLanguage('en');
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Language changed to English!' },
        ]);
        setTimeout(() => setShowOptions(translations['en'].options), 0);
        break;

      case 'Korean':
        setLanguage('ko');
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: '언어가 한국어로 변경되었습니다!' },
        ]);
        setTimeout(() => setShowOptions(translations['ko'].options), 0);
        break;

      case 'Japanese':
        setLanguage('ja');
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: '言語が日本語に変更されました！' },
        ]);
        setTimeout(() => setShowOptions(translations['ja'].options), 0);
        break;

      default:
        botResponse = t.unknown;
        break;
    }

    // Add bot response
    setTimeout(() => {
      if (botResponse) {
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      }
      if (!['More', 'Change Language', 'Yes', 'No'].includes(option)) {
        setTimeout(() => setShowOptions(t.options), 500);
      }
    }, 1000);
  };

  const renderOptions = () => {
    return (
      <div className="chat-options-container">
        {showOptions.map((option, index) => (
          <button key={index} onClick={() => handleOptionClick(option)}>
            {option}
          </button>
        ))}
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
                className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
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
            {showOptions.length > 0 && renderOptions()}
            <div ref={chatEndRef} /> {/* Auto-scroll reference */}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={t.placeholder || 'Type your message...'}
            />
            <button onClick={() => handleOptionClick(userMessage)}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportEngine;
