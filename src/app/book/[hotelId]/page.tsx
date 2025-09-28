
'use client';

import { useState } from 'react';
import { Bot, Send, Loader2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { hotelBookingAgent } from '@/ai/flows/hotel-booking';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  isConfirmation?: boolean;
}

// The page parameter is now 'hotelName' instead of 'hotelId'
export default function BookHotelPage({ params }: { params: { hotelId: string } }) {
  // Decode the hotel name from the URL
  const hotelName = decodeURIComponent(params.hotelId);
  const [messages, setMessages] = useState<Message[]>([
    {
        text: `Hello! I can help you book a room at ${hotelName}. What is your full name and email address?`,
        isUser: false,
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading || isBooked) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await hotelBookingAgent({
        hotelName: hotelName,
        query: input,
        chatHistory: messages.map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`).join('\n')
      });

      const botMessage: Message = { text: result.responseText, isUser: false };
      setMessages((prev) => [...prev, botMessage]);

      if (result.bookingConfirmation?.success) {
        setIsBooked(true);
        const confirmationMessage: Message = {
            text: `Booking confirmed! Your confirmation ID is ${result.bookingConfirmation.confirmationId}.`,
            isUser: false,
            isConfirmation: true,
        }
        setMessages((prev) => [...prev, confirmationMessage]);
      }

    } catch (error) {
      console.error('Error with booking agent:', error);
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Book Hotel</CardTitle>
              <CardDescription>Complete your booking for: {hotelName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto pr-4 space-y-4 mb-4 border rounded-lg p-4">
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
                    
                    {message.isConfirmation ? (
                        <Alert variant="default" className="bg-primary/10 border-primary/20">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle className="text-primary font-bold">Booking Confirmed!</AlertTitle>
                            <AlertDescription>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    ) : (
                         <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                            message.isUser
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                        </div>
                    )}


                    {message.isUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                    )}
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
              
              {!isBooked ? (
                 <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Provide your details..."
                        disabled={isLoading || isBooked}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || isBooked}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
              ) : (
                <div className="text-center text-primary font-medium">
                    Thank you for booking with TourNaija!
                </div>
              )}
             
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
