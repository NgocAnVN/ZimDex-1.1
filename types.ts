
import React from 'react';

export enum AppId {
  SETTINGS = 'settings',
  FILES = 'files',
  BROWSER = 'browser',
  MEDIA = 'media'
}

export interface AppConfig {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

// --- Widget Types ---

export type WidgetType = 'weather' | 'clock' | 'calendar' | 'system' | 'music' | 'search' | 'todo' | 'note';

export type WidgetStyle = 
  // Original Styles
  'glass' | 'midnight' | 'ceramic' | 'cyber' | 'retro' | 'forest' | 'sunset' | 'ocean' | 'terminal' | 'royal' |
  // New UI Styles
  'minimal' | 'neumorph' | 'brutal' | 'blueprint' | 'outline' | 'acrylic' | 'paper' | 'clay' | 'tech' | 'gothic';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  style: WidgetStyle;
  x: number;
  y: number;
  zIndex: number;
}

// --- File System Types ---

export type FileType = 'folder' | 'image' | 'text' | 'code' | 'audio' | 'video' | 'archive' | 'drive' | 'network' | 'computer';

export interface FileSystemNode {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  size: string;
  date: string;
  content?: string; // Actual content (text string or URL)
  meta?: {
    totalSpace?: string;
    freeSpace?: string;
    percentUsed?: number;
    width?: number;
    height?: number;
    duration?: string;
  };
}

// --- System Context Types ---

export type AnimationType = 'default' | 'snappy' | 'bouncy' | 'linear';
export type Theme = 'light' | 'dark';
export type SystemFont = 'Inter' | 'Lora' | 'Patrick Hand';

export interface SystemState {
  isLocked: boolean;
  password: string; // In a real app, this would be hashed
  username: string;
  avatar?: string; // User avatar URL
  brightness: number; // 0-100
  volume: number; // 0-100
  isWifiEnabled: boolean;
  isBluetoothEnabled: boolean;
  isDoNotDisturb: boolean;
  isNightLight: boolean;
  accentColor: string;
  batteryLevel: number;
  isCharging: boolean;
  animationSpeed: number; // 1 is default, >1 is faster
  animationType: AnimationType;
  theme: Theme;
  // New Settings
  isTransparencyEnabled: boolean;
  isAutoLockEnabled: boolean;
  isNotificationsEnabled: boolean;
  isLocationEnabled: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
  systemFont: SystemFont;
}

export interface SystemContextType extends SystemState {
  setLocked: (locked: boolean) => void;
  setPassword: (pass: string) => void;
  setAvatar: (url: string) => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleDoNotDisturb: () => void;
  toggleNightLight: () => void;
  setAnimationSpeed: (speed: number) => void;
  setAnimationType: (type: AnimationType) => void;
  toggleTheme: () => void;
  unlock: (attempt: string) => boolean;
  // New Setters
  toggleTransparency: () => void;
  toggleAutoLock: () => void;
  toggleNotifications: () => void;
  toggleLocation: () => void;
  toggleCamera: () => void;
  toggleMicrophone: () => void;
  setAccentColor: (color: string) => void;
  setSystemFont: (font: SystemFont) => void;
}
