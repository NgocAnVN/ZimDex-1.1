
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SystemContextType, SystemState, AnimationType, SystemFont } from '../types';

const defaultState: SystemState = {
  isLocked: true, 
  password: '1234', 
  username: 'NgocAnn',
  avatar: undefined,
  brightness: 100,
  volume: 75,
  isWifiEnabled: true,
  isBluetoothEnabled: true,
  isDoNotDisturb: false,
  isNightLight: false,
  accentColor: '#3b82f6',
  batteryLevel: 85,
  isCharging: false,
  animationSpeed: 1,
  animationType: 'default',
  theme: 'dark',
  // Defaults for new settings
  isTransparencyEnabled: true,
  isAutoLockEnabled: true,
  isNotificationsEnabled: true,
  isLocationEnabled: true,
  isCameraEnabled: true,
  isMicrophoneEnabled: true,
  systemFont: 'Inter',
};

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SystemState>(() => {
    try {
      const saved = localStorage.getItem('zimdex-system-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default state to ensure new fields are present
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn("Failed to load system state from local storage", e);
    }
    return defaultState;
  });

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem('zimdex-system-state', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save system state", e);
    }
  }, [state]);

  // Simulate battery drain/charge
  useEffect(() => {
    const interval = setInterval(() => {
        setState(prev => {
            let newLevel = prev.batteryLevel + (prev.isCharging ? 1 : -0.5);
            if (newLevel > 100) newLevel = 100;
            if (newLevel < 0) newLevel = 0;
            return { ...prev, batteryLevel: newLevel };
        });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const setLocked = (locked: boolean) => setState(prev => ({ ...prev, isLocked: locked }));
  const setPassword = (pass: string) => setState(prev => ({ ...prev, password: pass }));
  const setAvatar = (url: string) => setState(prev => ({ ...prev, avatar: url }));
  const setBrightness = (val: number) => setState(prev => ({ ...prev, brightness: val }));
  const setVolume = (val: number) => setState(prev => ({ ...prev, volume: val }));
  const toggleWifi = () => setState(prev => ({ ...prev, isWifiEnabled: !prev.isWifiEnabled }));
  const toggleBluetooth = () => setState(prev => ({ ...prev, isBluetoothEnabled: !prev.isBluetoothEnabled }));
  const toggleDoNotDisturb = () => setState(prev => ({ ...prev, isDoNotDisturb: !prev.isDoNotDisturb }));
  const toggleNightLight = () => setState(prev => ({ ...prev, isNightLight: !prev.isNightLight }));
  const setAnimationSpeed = (speed: number) => setState(prev => ({ ...prev, animationSpeed: speed }));
  const setAnimationType = (type: AnimationType) => setState(prev => ({ ...prev, animationType: type }));
  const toggleTheme = () => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  
  // New Toggles
  const toggleTransparency = () => setState(prev => ({ ...prev, isTransparencyEnabled: !prev.isTransparencyEnabled }));
  const toggleAutoLock = () => setState(prev => ({ ...prev, isAutoLockEnabled: !prev.isAutoLockEnabled }));
  const toggleNotifications = () => setState(prev => ({ ...prev, isNotificationsEnabled: !prev.isNotificationsEnabled }));
  const toggleLocation = () => setState(prev => ({ ...prev, isLocationEnabled: !prev.isLocationEnabled }));
  const toggleCamera = () => setState(prev => ({ ...prev, isCameraEnabled: !prev.isCameraEnabled }));
  const toggleMicrophone = () => setState(prev => ({ ...prev, isMicrophoneEnabled: !prev.isMicrophoneEnabled }));
  const setAccentColor = (color: string) => setState(prev => ({ ...prev, accentColor: color }));
  const setSystemFont = (font: SystemFont) => setState(prev => ({ ...prev, systemFont: font }));

  const unlock = (attempt: string) => {
      if (attempt === state.password) {
          setLocked(false);
          return true;
      }
      return false;
  };

  return (
    <SystemContext.Provider value={{
      ...state,
      setLocked,
      setPassword,
      setAvatar,
      setBrightness,
      setVolume,
      toggleWifi,
      toggleBluetooth,
      toggleDoNotDisturb,
      toggleNightLight,
      setAnimationSpeed,
      setAnimationType,
      toggleTheme,
      unlock,
      toggleTransparency,
      toggleAutoLock,
      toggleNotifications,
      toggleLocation,
      toggleCamera,
      toggleMicrophone,
      setAccentColor,
      setSystemFont
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
