import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { UserParams, ImageData } from '../types';

interface InputAreaProps {
  onSend: (params: UserParams) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageData | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      // base64 includes the data URI prefix "data:image/jpeg;base64,..."
      // We need to split it for the API, but keep it for preview
      const preview = base64;
      const apiData = base64.split(',')[1];
      
      setSelectedImage({
        base64: apiData,
        preview: preview,
        mimeType: file.type
      });
    } catch (err) {
      console.error("Error reading file", err);
    }
    
    // Reset input so same file can be selected again if cleared
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || isLoading) return;
    
    onSend({ text, image: selectedImage });
    setText('');
    setSelectedImage(undefined);
  };

  const clearImage = () => {
    setSelectedImage(undefined);
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto flex flex-col space-y-3">
        
        {/* Image Preview Area */}
        {selectedImage && (
          <div className="relative inline-block w-fit">
            <div className="relative group">
                <img 
                src={selectedImage.preview} 
                alt="Preview" 
                className="h-20 w-20 object-cover rounded-lg border border-slate-300 shadow-sm"
                />
                <button 
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                <X size={12} />
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Image attached</p>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all shadow-sm">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
            title="Upload image"
          >
            <ImageIcon size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Add a question about this image..." : "Ask a math question or upload a problem..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 text-slate-700 placeholder:text-slate-400 text-sm sm:text-base scrollbar-hide"
            rows={1}
            disabled={isLoading}
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage) || isLoading}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              (!text.trim() && !selectedImage) || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        
        <div className="text-center">
            <p className="text-[10px] text-slate-400">
                AI can make mistakes. Please verify important calculations.
            </p>
        </div>
      </div>
    </div>
  );
};