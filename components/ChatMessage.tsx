import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isModel ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
        }`}>
          {isModel ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col space-y-2 p-4 rounded-2xl shadow-sm ${
          isModel 
            ? 'bg-white border border-slate-100 rounded-tl-none text-slate-800' 
            : 'bg-indigo-600 text-white rounded-tr-none'
        }`}>
          
          {/* Image Attachment (if any) */}
          {message.image && (
            <div className="mb-2">
              <img 
                src={message.image} 
                alt="Uploaded content" 
                className="max-w-full rounded-lg border border-slate-200/20 max-h-60 object-contain bg-black/5"
              />
            </div>
          )}

          {/* Text Content */}
          <div className={`prose prose-sm max-w-none break-words leading-relaxed ${
            isModel ? 'prose-slate' : 'prose-invert'
          }`}>
             <ReactMarkdown 
               components={{
                 // Custom renderer to ensure math-like text is readable
                 code: ({node, inline, className, children, ...props}: any) => (
                   <code className={`${inline ? 'bg-black/10 px-1 py-0.5 rounded font-mono text-sm' : 'block bg-black/5 p-2 rounded-lg overflow-x-auto'}`} {...props}>
                     {children}
                   </code>
                 )
               }}
             >
                {message.text}
             </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};