/**
 * Voice utilities for ZenPrac
 * - Speech-to-text: Web Speech API (browser native)
 * - Text-to-speech: OpenAI TTS API via our backend
 */

// Speech recognition (browser native)
export class VoiceRecorder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'zh-CN';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  get isSupported(): boolean {
    return this.recognition !== null;
  }

  get listening(): boolean {
    return this.isListening;
  }

  start(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): void {
    if (!this.recognition) {
      onError?.('语音识别不可用，请使用文字输入');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (event.error === 'no-speech') {
        onError?.('未检测到语音');
      } else if (event.error === 'audio-capture') {
        onError?.('无法访问麦克风');
      } else {
        onError?.('语音识别出错，请使用文字输入');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch {
      onError?.('语音识别启动失败');
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

// Text-to-speech via OpenAI TTS
export class VoiceSpeaker {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isSpeakingState = false;

  get isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  async speak(
    text: string,
    voiceId: string = 'alloy',
    onStart?: () => void,
    onEnd?: () => void,
    voiceSpeed?: number
  ): Promise<void> {
    try {
      // Request TTS from our API
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId, voiceSpeed }),
      });

      if (!res.ok) {
        console.error('TTS error:', res.status);
        onEnd?.();
        return;
      }

      const audioData = await res.arrayBuffer();

      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      // Resume if suspended (browsers require user gesture)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const audioBuffer = await this.audioContext.decodeAudioData(audioData);

      // Stop any current playback
      this.stop();

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      this.currentSource = source;
      this.isSpeakingState = true;
      onStart?.();

      source.onended = () => {
        this.isSpeakingState = false;
        this.currentSource = null;
        onEnd?.();
      };

      source.start(0);
    } catch (error) {
      console.error('Speech playback error:', error);
      this.isSpeakingState = false;
      onEnd?.();
    }
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // Already stopped
      }
      this.currentSource = null;
    }
    this.isSpeakingState = false;
  }
}

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
