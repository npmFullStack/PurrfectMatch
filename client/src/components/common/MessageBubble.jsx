import { useState } from "react";
import { MessageSquare, X, Send, Minimize2, User } from "lucide-react";

const MessageBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState("");
    
    // Mock conversation data
    const conversations = [
        { id: 1, name: "Sarah Johnson", lastMessage: "Is the puppy still available?", unread: 2, time: "2 min ago" },
        { id: 2, name: "Mike Wilson", lastMessage: "Can we meet tomorrow?", unread: 0, time: "1 hour ago" },
        { id: 3, name: "Emma Davis", lastMessage: "What's the adoption fee?", unread: 1, time: "3 hours ago" },
    ];

    const [activeChat, setActiveChat] = useState(null);

    // Mock messages for active chat
    const messages = activeChat ? [
        { id: 1, text: "Hi! Is the golden retriever still available?", sender: "them", time: "10:30 AM" },
        { id: 2, text: "Yes, he's still available!", sender: "you", time: "10:32 AM" },
        { id: 3, text: "Can I visit him tomorrow?", sender: "them", time: "10:33 AM" },
    ] : [];

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log("Sending message:", message);
            setMessage("");
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors z-50"
                    aria-label="Open messages"
                >
                    <MessageSquare className="h-6 w-6 text-white" />
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`
                    fixed right-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${isMinimized 
                        ? 'bottom-6 w-72 h-14' 
                        : 'bottom-6 w-80 sm:w-96 h-[500px]'
                    }
                `}>
                    {/* Header */}
                    <div className="bg-primary text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            <h3 className="font-semibold">Messages</h3>
                            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                {conversations.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1 hover:bg-white/10 rounded"
                                aria-label={isMinimized ? "Maximize" : "Minimize"}
                            >
                                <Minimize2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content - Show only when not minimized */}
                    {!isMinimized && (
                        <div className="flex flex-col h-[calc(100%-56px)]">
                            {/* Conversations List or Chat */}
                            {!activeChat ? (
                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-2">
                                        <div className="px-3 py-2 mb-2">
                                            <h4 className="font-medium text-gray-700">Recent Conversations</h4>
                                        </div>
                                        {conversations.map(convo => (
                                            <button
                                                key={convo.id}
                                                onClick={() => setActiveChat(convo)}
                                                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <div className="relative">
                                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    {convo.unread > 0 && (
                                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                            {convo.unread}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-medium text-gray-900">{convo.name}</p>
                                                        <span className="text-xs text-gray-500">{convo.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Chat Header */}
                                    <div className="border-b border-gray-200 p-3 flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveChat(null)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{activeChat.name}</h4>
                                            <p className="text-xs text-gray-500">Online</p>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] rounded-xl p-3 ${
                                                    msg.sender === 'you' 
                                                    ? 'bg-primary text-white rounded-br-none' 
                                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                                }`}>
                                                    <p>{msg.text}</p>
                                                    <span className={`text-xs mt-1 block ${msg.sender === 'you' ? 'text-primary-100' : 'text-gray-500'}`}>
                                                        {msg.time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="border-t border-gray-200 p-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type your message..."
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!message.trim()}
                                                className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Send message"
                                            >
                                                <Send className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default MessageBubble;