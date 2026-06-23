import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Download, Trash2, Copy, FileText, Image as ImageIcon, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ChatFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export function AgentChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I\'m your AI Agent. I can help you with text, voice, files, images, and more. What would you like to do?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ChatFile[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Long-press voice activation for mobile (2 seconds)
  const handleMicMouseDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      setLongPressActive(true);
      startRecording();
    }, 2000);
  };

  const handleMicMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    if (longPressActive) {
      setLongPressActive(false);
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleAudioSubmit(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('[v0] Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioSubmit = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      
      // Process voice input
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: '[Voice Input - Processing...]',
        timestamp: new Date().toISOString(),
        metadata: { type: 'voice' }
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate agent response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'I received your voice message. Converting to text and processing...',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('[v0] Audio submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const chatFile: ChatFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      setUploadedFiles(prev => [...prev, chatFile]);

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date().toISOString(),
        metadata: { type: 'file', fileName: file.name, fileSize: file.size }
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Simulate agent processing
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `Processing ${file.name}. I can help you analyze, extract, or work with this file.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    });

    setShowFileMenu(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate API call to agent
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: 'I understood your request. I\'m coordinating with the best AI providers to fulfill this. Using orchestrated providers for optimal results.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, agentMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('[v0] Message sending failed:', error);
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={`flex flex-col h-screen bg-background text-foreground ${isMobile ? 'w-full' : 'w-full max-w-4xl mx-auto'}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md p-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Volume2 className="w-8 h-8 text-accent" />
          Voicebox AI Agent
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Multimodal autonomous agent • Voice • Files • Images • Documents</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-foreground border border-border'
              }`}
            >
              <p className="text-sm md:text-base break-words">{message.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                {message.role === 'agent' && (
                  <>
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="opacity-50 hover:opacity-100 transition-opacity p-1"
                      title="Copy message"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="opacity-50 hover:opacity-100 transition-opacity p-1"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg border border-border">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="border-t border-border bg-muted/50 p-4">
          <h3 className="text-sm font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-24 overflow-y-auto">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-background p-2 rounded border border-border hover:border-accent transition-colors">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-4 h-4 text-accent flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 p-1"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Mobile Optimized */}
      <div className="border-t border-border bg-background p-4 space-y-3">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          {/* File Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFileMenu(!showFileMenu)}
              className="p-2 md:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center min-h-10 md:min-h-12 min-w-10 md:min-w-12"
              title="Attach file (drag & drop or click)"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            {showFileMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-background border border-border rounded-lg shadow-lg z-50">
                <label className="block px-4 py-2 hover:bg-muted cursor-pointer text-sm">
                  Choose File
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="*/*"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Text Input */}
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            placeholder="Type message or press Shift+Enter for new line... (Ctrl+Shift+A for admin)"
            className="flex-1 px-4 py-2 md:py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm md:text-base resize-none max-h-24 min-h-10"
            rows={1}
          />

          {/* Voice Button - Long Press for Mobile */}
          <button
            type="button"
            onMouseDown={handleMicMouseDown}
            onMouseUp={handleMicMouseUp}
            onTouchStart={handleMicMouseDown}
            onTouchEnd={handleMicMouseUp}
            className={`p-2 md:p-3 rounded-lg transition-colors flex items-center justify-center min-h-10 md:min-h-12 min-w-10 md:min-w-12 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : longPressActive
                ? 'bg-amber-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
            title={isMobile ? 'Long press for 2s to record' : 'Click to record'}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 md:p-3 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center justify-center min-h-10 md:min-h-12 min-w-10 md:min-w-12"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {isMobile && (
          <p className="text-xs text-muted-foreground text-center">
            Long-press mic button for 2 seconds to record voice • Or type your message
          </p>
        )}
      </div>
    </div>
  );
}
