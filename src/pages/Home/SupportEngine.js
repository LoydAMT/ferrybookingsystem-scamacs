import React, { useState, useEffect, useRef, useMemo } from 'react';
import io from 'socket.io-client';
import './SupportEngine.css';
import Avatar from './Avatar'; // Import Avatar.js
import translations from './translations';

const socket = io('http://localhost:5000'); // Connect to the WebSocket server

const SupportEngine = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isRealTimeChat, setIsRealTimeChat] = useState(false);
  const chatEndRef = useRef(null);
  const t = translations[language]; 

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
        initialMessages.forEach((msg, index) => {
          setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            if (index === initialMessages.length - 1) {
              setShowOptions(t.options); 
            }
          }, index * 1000);
        });
      } else {
        setShowOptions(t.options);
      }
    }
  }, [isOpen, language]);

  const handleOptionClick = (option) => {
    const updatedTranslations = translations[language];
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: option }]);
    setShowOptions([]); // Temporarily hide options while processing

    let botResponse = '';

    switch (option) {
      case updatedTranslations.options[0]:
        botResponse = updatedTranslations.howToBook;
        break;

      case updatedTranslations.options[1]:
        botResponse = updatedTranslations.shippingLines;
        break;

      case updatedTranslations.options[2]: 
        botResponse = updatedTranslations.paymentMethod;
        break;

        case updatedTranslations.options[3]: // More
        botResponse = t.more;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
        setTimeout(() => setShowOptions(['Yes', 'No']), 500);
        return;

      case 'Yes': // User chooses "Yes"
        botResponse = t.yes;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
        setTimeout(() => {
          setIsRealTimeChat(true);
          socket.emit('notify admin', { message: 'A user needs real-time support!' });
          setShowOptions([]);
        }, 1000);
        return;

      case 'No': // User chooses "No"
        botResponse = t.no;
        setTimeout(() => setShowOptions(t.options), 500);
        break;

      case updatedTranslations.options[4]: 
        botResponse = updatedTranslations.languagePrompt;
        setShowOptions(['English', 'Korean', 'Japanese']);
        return;

        case 'English':
          setLanguage('en');
          botResponse = 'Language changed to English!';
          setShowOptions(translations['en'].options); 
          break;
        
        case 'Korean':
          setLanguage('ko');
          botResponse = '언어가 한국어로 변경되었습니다!';
          setShowOptions(translations['ko'].options);
          break;
        
        case 'Japanese':
          setLanguage('ja');
          botResponse = '言語が日本語に変更されました！';
          setShowOptions(translations['ja'].options);
          break;
        

      default:
        botResponse = updatedTranslations.unknown;
        break;
    }

    
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      if (!['Change Language', 'Yes', 'No'].includes(option)) {
        setShowOptions(updatedTranslations.options);
      }
    }, 1000);
  };

  return (
    <div>
      {!isOpen && <Avatar onClick={() => setIsOpen(true)} />}
      {isOpen && (
        <div className="support-engine">
          <div className="chat-header">
            <h3>Ruru</h3>
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
                      alt="bot avatar"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <p dangerouslySetInnerHTML={{ __html: message.text }} />
              </div>
            ))}
            {showOptions.length > 0 && (
              <div className="chat-options-container">
                {showOptions.map((option, index) => (
                  <button key={index} onClick={() => handleOptionClick(option)}>
                    {option}
                  </button>
                ))}
              </div>
            )}
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