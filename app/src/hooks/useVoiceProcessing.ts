import { useState, useCallback, useRef } from 'react';
import { voiceService, type STTResult, type TTSResult } from '@/services/voiceProcessingService';

export interface UseVoiceProcessingOptions {
  language?: string;
  voice?: string;
  autoStart?: boolean;
}

export function useVoiceProcessing(options: UseVoiceProcessingOptions = {}) {
  const { language = 'en', voice = 'default', autoStart = false } = options;

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      let duration = 0;
      recordingTimerRef.current = setInterval(() => {
        duration += 100;
        setRecordingDuration(duration);
      }, 100);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Stop audio stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start recording';
      setError(message);
      console.error('[v0] Recording failed:', err);
    }
  }, []);

  /**
   * Stop recording audio
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
    }
  }, [isRecording]);

  /**
   * Process audio blob through STT
   */
  const processAudio = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      setError(null);
      
      try {
        const result = await voiceService.speechToText(audioBlob, language);
        setTranscript(result.text);
        console.log('[v0] Transcription:', result.text);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process audio';
        setError(message);
        console.error('[v0] Audio processing failed:', err);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [language]
  );

  /**
   * Convert text to speech
   */
  const speak = useCallback(
    async (text: string) => {
      if (!voiceService.isSpeechSynthesisAvailable()) {
        setError('Speech synthesis not available');
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await voiceService.textToSpeech(text, voice);
        
        // Create audio element if needed
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        const audioUrl = URL.createObjectURL(
          new Blob([result.audioData], { type: result.mimeType })
        );
        
        audioRef.current.src = audioUrl;
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
          setError('Failed to play audio');
          setIsSpeaking(false);
        };

        await audioRef.current.play();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to convert text to speech';
        setError(message);
        setIsSpeaking(false);
        console.error('[v0] TTS failed:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [voice]
  );

  /**
   * Stop playing audio
   */
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Clear transcript
   */
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get available voices
   */
  const getAvailableVoices = useCallback(() => {
    return voiceService.getAvailableVoices();
  }, []);

  /**
   * Check capabilities
   */
  const canRecord = voiceService.isSpeechRecognitionAvailable();
  const canSpeak = voiceService.isSpeechSynthesisAvailable();

  return {
    // State
    isRecording,
    isProcessing,
    isSpeaking,
    transcript,
    error,
    recordingDuration,
    
    // Methods
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    clearTranscript,
    clearError,
    getAvailableVoices,
    
    // Capabilities
    canRecord,
    canSpeak
  };
}

export default useVoiceProcessing;
