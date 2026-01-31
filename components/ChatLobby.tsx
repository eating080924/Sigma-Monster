
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  playerName: string;
}

const ChatLobby: React.FC<Props> = ({ playerName }) => {
  const [messages, setMessages] = useState<{user: string, text: string}[]>([
    { user: '系統', text: '歡迎來到世界聊天室' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: playerName, text: input }]);
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      <div className="p-4 border-b border-[#333] font-bold text-orange-500">聊天大廳</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            <span className={`font-bold mr-2 ${m.user === playerName ? 'text-blue-400' : 'text-orange-300'}`}>[{m.user}]</span>
            <span className="text-gray-300">{m.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-[#222]">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入聊天訊息..."
          className="w-full bg-[#333] border border-[#444] rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
      </form>
    </div>
  );
};

export default ChatLobby;
