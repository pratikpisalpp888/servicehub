import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../api';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'faq'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to UI immediately
    const userMessage = {
      id: Date.now() + messages.length,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInputMessage('');
    
    try {
      // Send message to backend
      const res = await chatAPI.sendMessage(inputMessage);
      
      // Add bot response to UI
      const botMessage = {
        id: Date.now() + messages.length + 1,
        text: res.data.data.message,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Show error message
      const errorMessage = {
        id: Date.now() + messages.length + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // FAQ Groups for common questions
  const faqGroups = [
    {
      title: "Booking Services",
      questions: [
        "How do I book a service?",
        "What information do I need to book?",
        "Can I change my appointment time?",
        "How do I cancel a booking?",
        "What happens if the provider doesn't show up?"
      ]
    },
    {
      title: "Payments & Charges",
      questions: [
        "How much does it cost?",
        "What are your service charges?",
        "Do I pay upfront?",
        "What payment methods do you accept?",
        "Is there a guarantee on services?"
      ]
    },
    {
      title: "Service Providers",
      questions: [
        "How do I find a provider?",
        "How are providers verified?",
        "Can I see provider ratings?",
        "What if I'm not satisfied with the service?",
        "How do I leave a review?"
      ]
    },
    {
      title: "Service Categories",
      questions: [
        "What services do you offer?",
        "Do you provide emergency services?",
        "What areas do you serve?",
        "How do I know what service I need?",
        "Can I book multiple services?"
      ]
    }
  ];

  // Household Problem Solutions
  const householdSolutions = [
    {
      category: "Plumbing Issues",
      problems: [
        "Overflow water in bathroom",
        "Leaking pipe",
        "Clogged drain"
      ]
    },
    {
      category: "Electrical Issues",
      problems: [
        "Power outage",
        "Flickering lights"
      ]
    },
    {
      category: "Carpentry Issues",
      problems: [
        "Squeaky floor",
        "Stuck door"
      ]
    },
    {
      category: "Cleaning Issues",
      problems: [
        "Stubborn stains",
        "Mold removal"
      ]
    }
  ];

  const quickQuestions = [
    "Find electricians near me",
    "What services do you offer?",
    "How do I book a service?",
    "Show me beauty services",
    "What are your service charges?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setActiveTab('chat');
  };

  const handleFAQQuestion = (question) => {
    setInputMessage(question);
    setActiveTab('chat');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">24/7 Service Assistant</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
            activeTab === 'chat' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
            activeTab === 'faq' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('faq')}
        >
          FAQs & Solutions
        </button>
      </div>

      {activeTab === 'chat' ? (
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[70vh]">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <h2 className="text-xl font-semibold">Chat with our Assistant</h2>
            <p className="text-sm text-blue-100">
              Ask about services, providers, or get help with bookings
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-indigo-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Welcome to ServiceHub Assistant</h3>
                <p className="text-gray-600 max-w-md mb-6">
                  I can help you find verified service providers in Kharghar for beauty, carpentry, electrical work, plumbing, painting, and home cleaning.
                </p>
                <div className="mt-4 w-full max-w-2xl">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Try asking:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left text-gray-700 hover:text-blue-600 border border-gray-200"
                      >
                        <p className="font-medium">{question}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-2xl disabled:opacity-50 transition-all duration-200"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Our assistant is here to help 24/7 with local service inquiries.
            </p>
          </div>
        </div>
      ) : (
        // FAQ & Solutions Tab
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about our services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {faqGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">{group.title}</h3>
                <ul className="space-y-3">
                  {group.questions.map((question, qIndex) => (
                    <li key={qIndex}>
                      <button
                        onClick={() => handleFAQQuestion(question)}
                        className="text-left text-gray-700 hover:text-blue-600 w-full text-sm"
                      >
                        <span className="mr-2 text-blue-500">•</span>
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Household Problem Solutions</h2>
            <p className="text-gray-600">Get instant help with common household issues</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {householdSolutions.map((category, catIndex) => (
              <div key={catIndex} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-purple-600 mb-4">{category.category}</h3>
                <ul className="space-y-3">
                  {category.problems.map((problem, probIndex) => (
                    <li key={probIndex}>
                      <button
                        onClick={() => handleFAQQuestion(problem)}
                        className="text-left text-gray-700 hover:text-purple-600 w-full text-sm"
                      >
                        <span className="mr-2 text-purple-500">•</span>
                        {problem}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-gray-700 text-center">
              Need personalized help? Switch to the chat tab to talk directly with our assistant!
            </p>
            <div className="text-center mt-3">
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Go to Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;