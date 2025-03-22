import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Send, Bot, User, Loader2 } from "lucide-react";
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

const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  classroomId,
  user,
}) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const askChatbot = async () => {
    if (!question.trim()) return;
    
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
    
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/chatbot/respond", {
        classId: classroomId,
        question
      }, {
        headers: { "Content-Type": "application/json" }
      });
      
      const data = res.data;
      
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
      toast.error("Failed to get response from AI assistant");
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex flex-col w-full h-full">
      <Card className="flex-1 bg-white shadow-sm border border-gray-100 flex flex-col">
        <CardHeader className="p-4 border-b border-gray-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          {messages.length > 0 ? (
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
                        {message.role === "user" ? "You" : "Assistant"}
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
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <Bot className="h-12 w-12 text-emerald-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Hello! I'm your AI Assistant
              </h3>
              <p className="text-gray-600 max-w-md">
                I can help answer questions about your course materials, explain concepts, 
                and assist with your learning journey.
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
              placeholder="Ask me anything about your course..."
              className="flex-1 bg-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isLoading}
              rows={3}
            />
            <Button
              onClick={askChatbot}
              disabled={isLoading || !question.trim()}
              className="ml-2 h-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
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