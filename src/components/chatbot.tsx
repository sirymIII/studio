'use client';

import { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { interactiveAITravelChatbot } from '@/ai/flows/interactive-ai-travel-chatbot';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  destinationContext?: string;
  promptPlaceholder?: string;
}

export function Chatbot({ destinationContext, promptPlaceholder }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await interactiveAITravelChatbot({
        query: input,
        destinationContext: destinationContext,
      });
      const botMessage: Message = { text: result.response, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error with chatbot:', error);
      const errorMessage: Message = {
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="chatbot" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl">
              AI Travel Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto pr-4 space-y-4 mb-4 border-b pb-4">
               {messages.length === 0 && (
                <div className="flex items-start gap-3">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                     <div className="rounded-lg px-4 py-2 bg-muted">
                        <p className="text-sm">
                           {destinationContext 
                                ? `Ready to explore ${destinationContext}? Ask me anything!`
                                : "Have a question about tourism in Nigeria? Ask away!"
                           }
                        </p>
                    </div>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.isUser ? 'justify-end' : ''
                  }`}
                >
                  {!message.isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={promptPlaceholder || "Ask about destinations..."}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
