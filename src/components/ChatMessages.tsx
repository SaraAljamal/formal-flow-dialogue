
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          } animate-fade-in`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-primary text-white'
                : 'bg-[#403E43] text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-75 mt-1 block">
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
