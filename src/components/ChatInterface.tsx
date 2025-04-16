
import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{
    id: number;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>>([
    {
      id: 1,
      content: "Hello! How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: messages.length + 1,
      content,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: "I'm processing your message...",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 bg-[#403E43]">
      <div className="py-4 flex justify-center items-center border-b bg-white">
        <img 
          src="/lovable-uploads/5415f8a0-e2ef-4c09-8cf3-1ef94260a533.png" 
          alt="Nournet Logo" 
          className="h-12 object-contain"
        />
      </div>
      <div className="flex-1 overflow-hidden bg-[#403E43] rounded-t-lg shadow-sm">
        <ChatMessages messages={messages} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
