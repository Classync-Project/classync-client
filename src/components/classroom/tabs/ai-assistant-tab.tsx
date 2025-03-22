import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import axios from "axios";

interface AIAssistantTabProps {
  classroomId: string | undefined;
  user: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Key for storing chat in localStorage
const getChatStorageKey = (classroomId: string, userId: string) => 
  `classroom_chat_${classroomId}_${userId}`;

// Assistant name and details
const ASSISTANT_NAME = "Saarthi";
const ASSISTANT_TAGLINE = "Your intelligent learning companion";

const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  classroomId,
  user,
}) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = user?.id || user?.email || 'anonymous';

  // Load stored messages when component mounts
  useEffect(() => {
    if (classroomId && userId) {
      const storageKey = getChatStorageKey(classroomId, userId);
      const storedMessages = localStorage.getItem(storageKey);
      
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Convert string timestamps back to Date objects
          const formattedMessages = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        } catch (error) {
          console.error("Error parsing stored messages:", error);
        }
      }
    }
  }, [classroomId, userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (classroomId && userId && messages.length > 0) {
      const storageKey = getChatStorageKey(classroomId, userId);
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, classroomId, userId]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const askChatbot = async () => {
    if (!question.trim() || !classroomId) return;
    
    setIsLoading(true);
    
    // Create a new message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/chatbot/respond", {
        classId: classroomId,
        question,
        chatHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }, {
        headers: { "Content-Type": "application/json" }
      });
      
      const data = res.data;
      
      // Simulate a natural typing delay (remove in production if using streaming)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response to chat
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Clear the input
      setQuestion("");
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      setIsTyping(false);
      toast.error("Failed to get response from AI assistant");
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    if (classroomId && userId) {
      const storageKey = getChatStorageKey(classroomId, userId);
      localStorage.removeItem(storageKey);
      setMessages([]);
      toast.success("Chat history cleared");
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askChatbot();
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex gap-3 justify-start">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-emerald-100 text-emerald-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg">
        <div className="mb-1 flex justify-between items-center">
          <span className="text-xs font-medium">{ASSISTANT_NAME}</span>
          <span className="text-xs opacity-70">
            {formatTimestamp(new Date())}
          </span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <Card className="flex-1 bg-white shadow-sm border border-gray-100 flex flex-col">
        <CardHeader className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              {ASSISTANT_NAME}
              <span className="text-xs font-normal text-gray-500 ml-2">
                {ASSISTANT_TAGLINE}
              </span>
            </CardTitle>
            {messages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearChat}
                className="text-xs h-8"
              >
                Clear Chat
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          {messages.length > 0 || isTyping ? (
            <div className="p-4 space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.role === "user" 
                        ? "bg-emerald-600 text-white" 
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="mb-1 flex justify-between items-center">
                      <span className="text-xs font-medium">
                        {message.role === "user" ? "You" : ASSISTANT_NAME}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=random`} />
                      <AvatarFallback>{getInitials(user?.email || 'User')}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="relative">
                <Bot className="h-12 w-12 text-emerald-300 mb-4" />
                <Sparkles className="h-5 w-5 text-amber-400 absolute -top-1 -right-1" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Hello! I'm {ASSISTANT_NAME}
              </h3>
              <p className="text-gray-600 max-w-md">
                {ASSISTANT_TAGLINE}. Ask me anything about your course materials, 
                and I'll help explain concepts and guide your learning journey.
              </p>
            </div>
          )}
        </CardContent>
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${ASSISTANT_NAME} anything about your course...`}
              className="flex-1 bg-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isLoading || isTyping}
              rows={3}
            />
            <Button
              onClick={askChatbot}
              disabled={isLoading || isTyping || !question.trim() || !classroomId}
              className="ml-2 h-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading || isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistantTab;