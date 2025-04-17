
import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const ChatInterface = () => {
  const { toast } = useToast();
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message to the chat
    const newMessage = {
      id: messages.length + 1,
      content,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Add a temporary loading message
      const loadingMessage = {
        id: messages.length + 2,
        content: "Processing your request...",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, loadingMessage]);
      
      // Local endpoint for your Llama model running on the same VM
      // Adjust the URL to match your local Llama API setup
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          // Include any other parameters your Llama API requires
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to the Llama model');
      }
      
      const data = await response.json();
      
      // Remove the loading message
      setMessages((prev) => prev.filter(msg => msg.id !== loadingMessage.id));
      
      // Add the actual response
      const aiResponse = {
        id: messages.length + 3,
        content: data.response || "Sorry, I couldn't process that request.",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error connecting to Llama model:', error);
      
      // Remove the loading message
      setMessages((prev) => 
        prev.filter(msg => msg.content !== "Processing your request...")
      );
      
      // Add error message
      const errorMessage = {
        id: messages.length + 3,
        content: "Sorry, I couldn't connect to the AI service. Please try again later.",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the Llama model. Please check your local server connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4">
      <div className="py-4 flex justify-between items-center border-b">
        <div className="text-xl font-semibold" style={{ color: '#014f95' }}>
          NourNet Gen-AI Agent
        </div>
        <img 
          src="/lovable-uploads/5415f8a0-e2ef-4c09-8cf3-1ef94260a533.png" 
          alt="Nournet Logo" 
          className="h-12 object-contain"
        />
      </div>
      <div className="flex-1 overflow-hidden bg-white rounded-t-lg shadow-sm">
        <ChatMessages messages={messages} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
