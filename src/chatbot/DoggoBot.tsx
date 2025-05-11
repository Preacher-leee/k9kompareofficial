import { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { MessageParser } from './MessageParser';
import { ActionProvider } from './ActionProvider';
import { Bot, X } from 'lucide-react';

const config = {
  initialMessages: [
    {
      id: 'welcome',
      message: "Hi! I'm DoggoBot 🐾 I can help you find the perfect dog breed, answer questions about dog care, or find local shelters. What would you like to know?",
      trigger: 'options',
    },
  ],
  botName: 'DoggoBot',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#2d3e67',
    },
    chatButton: {
      backgroundColor: '#f68b28',
    },
  },
};

const DoggoBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
          aria-label="Open chat assistant"
        >
          <Bot size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot size={24} className="text-primary-500" />
              <h3 className="font-semibold text-gray-800">DoggoBot</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat assistant"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-[500px]">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoggoBot;