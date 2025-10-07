import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from 'lucide-react';
import { getAvatarClasses, getAvatarEmoji, getMessageClasses } from "@/utils/functions/functionsChat";
import { Input } from "@/ui/input";
import type { Message } from "@/types/index";
import { agentService, type ChatInitiative } from "@/services/agent";

const initialIaGreeting: Message = {
    id: "seed-ia-1",
    author: "ia",
    text: "Olá! 👋 Vou te ajudar a estruturar sua ideia. Me conte sobre sua proposta."
};

type Props = {
    onInitiativeUpdate?: (initiative: ChatInitiative | null) => void;
};

const ChatMessages = ({ onInitiativeUpdate }: Props) => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([initialIaGreeting]);
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const typingTimeoutRef = useRef<number | null>(null);

    const navigate = useNavigate();

    const goToPreviousScreen = () => {
        navigate(-1);
    };

    useEffect(() => {
        let retryTimeout: number | null = null;
        let unsubscribe: (() => void) | null = null;

        const attemptConnection = () => {
            try {
                agentService.connect();
                
                unsubscribe = agentService.subscribe(({ message, initiative }) => {
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = null;
                    }
                    
                    setIsAgentTyping(false);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(Date.now()),
                            author: "ia",
                            text: message,
                        },
                    ]);
                    onInitiativeUpdate?.(initiative);
                });
                
                console.log('✅ Connected to agent service');
            } catch (error) {
                console.log('⏳ Waiting for user authentication, retrying in 2s...');
                retryTimeout = window.setTimeout(attemptConnection, 2000);
            }
        };

        attemptConnection();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [onInitiativeUpdate]);

    // Auto-scroll to bottom on new messages
    const messagesRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const el = messagesRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, isAgentTyping]);

    const handleSend = () => {
        const text = inputMessage.trim();
        if (!text) return;
        
        // Push user message locally
        setMessages((prev) => [
            ...prev,
            { id: String(Date.now()), author: "user", text },
        ]);
        
        setIsAgentTyping(true);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setIsAgentTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    author: "ia",
                    text: "Desculpe, houve um problema de conexão. Tente novamente.",
                },
            ]);
        }, 30000);
        
        // Send to agent
        agentService.sendMessage(text);
        setInputMessage('');
    };
  
    return (
        <div className="flex flex-col h-[80vh] bg-white rounded-lg overflow-hidden">
            <div className="bg-[var(--green-primary)] text-white p-4 rounded-t-lg">
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={goToPreviousScreen}
                        className="p-2 rounded-full transition-colors hover:bg-green-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button> 
                    <h2 className="font-semibold text-lg">Assistente de Criação</h2>
                </div>
            </div>
        
            <div ref={messagesRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.author === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className="flex items-start gap-3 max-w-xs">
                            {message.author !== "user" && (
                                <div className={getAvatarClasses(message.author)}>
                                    {getAvatarEmoji(message.author)}
                                </div>
                            )}

                            <div className={`p-3 rounded-lg ${getMessageClasses(message.author)}`}>
                                <div className="text-sm">
                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                </div>
                            </div>

                            {message.author === "user" && (
                                <div className={getAvatarClasses(message.author)}>
                                    {getAvatarEmoji(message.author)}
                                </div>
                            )}
                    </div>
                    </div>
                ))}
                
                {isAgentTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-xs">
                            <div className={getAvatarClasses("ia")}>
                                {getAvatarEmoji("ia")}
                            </div>
                            <div className={`p-3 rounded-lg ${getMessageClasses("ia")}`}>
                                <div className="flex items-center space-x-1">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        id="message-input"
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={isAgentTyping ? "Aguardando resposta..." : "Digite sua mensagem..."}
                        disabled={isAgentTyping}
                        style={{ borderRadius: '25px' }}
                    />
                    <button
                        className="bg-[var(--green-primary)] text-white p-3 rounded-3xl hover:bg-green-700 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSend}
                        disabled={isAgentTyping || !inputMessage.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
;

export default ChatMessages;
