
import React, { useState, useRef } from 'react';
import { 
  Monitor, Volume2, Bell, Grid, Layout, HardDrive, 
  Battery, Shield, Accessibility, Settings as SettingsIcon, 
  Info, User, Cpu, CircuitBoard, Type, Keyboard,
  Mouse, Printer, Bluetooth, Wifi, Moon, Sun,
  Trash2, Mic, Camera, MapPin, Eye, Smartphone, Speaker,
  Lock, Key, Search, Zap, Move3d, Palette, Check,
  Cloud, Calendar, Clock, Music, CheckSquare, StickyNote, ExternalLink, Camera as CameraIcon
} from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationType, Theme, WidgetType, SystemFont } from '../types';

// --- Reusable UI Components ---

const SectionCard: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`bg-white/60 dark:bg-[#2a2e35]/80 border border-black/5 dark:border-white/5 rounded-xl p-5 mb-4 shadow-sm ${className}`}
  >
    {title && <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-4 border-b border-black/5 dark:border-white/5 pb-2">{title}</h3>}
    {children}
  </motion.div>
);

const SettingRow: React.FC<{ 
  icon?: React.ElementType; 
  label: string; 
  subLabel?: string; 
  action?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon: Icon, label, subLabel, action, onClick }) => (
  <div 
    className={`flex items-center justify-between py-3 first:pt-0 last:pb-0 ${onClick ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5">
          <Icon size={18} className="text-gray-600 dark:text-gray-300"/>
        </div>
      )}
      <div>
        <div className="text-gray-900 dark:text-gray-200 text-sm font-medium">{label}</div>
        {subLabel && <div className="text-gray-500 dark:text-gray-500 text-xs">{subLabel}</div>}
      </div>
    </div>
    <div>{action}</div>
  </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button onClick={onChange} className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${checked ? 'bg-[#3b82f6]' : 'bg-gray-300 dark:bg-gray-600'}`}>
    <motion.div 
      layout 
      className={`absolute top-1 w-3 h-3 bg-white rounded-full ${checked ? 'left-6' : 'left-1'}`} 
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = "bg-blue-500" }) => (
  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <motion.div 
      className={`h-full ${color}`} 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </div>
);

// --- Main Component ---

interface SettingsAppProps {
  onOpenWidgetPicker: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ onOpenWidgetPicker }) => {
  const [activeTab, setActiveTab] = useState('Personalization');
  const system = useSystem();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for password change flow
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  // Local state for devices (so they can be removed)
  const [devices, setDevices] = useState([
      { id: 1, icon: Mouse, name: 'Gaming Mouse G502', sub: 'Connected - Battery 80%', type: 'Input' },
      { id: 2, icon: Keyboard, name: 'Mechanical Keyboard', sub: 'Connected', type: 'Input' },
      { id: 3, icon: Printer, name: 'Canon LBP 2900', sub: 'Offline', type: 'Other' },
      { id: 4, icon: Smartphone, name: 'iPhone 14 Pro', sub: 'Paired', type: 'Other' },
  ]);

  const handlePasswordChange = () => {
      if (oldPass !== system.password) {
          setPassMessage({ type: 'error', text: 'Incorrect current password.' });
          return;
      }
      if (newPass.length < 4) {
          setPassMessage({ type: 'error', text: 'New password must be at least 4 characters.' });
          return;
      }
      if (newPass !== confirmPass) {
          setPassMessage({ type: 'error', text: 'New passwords do not match.' });
          return;
      }
      system.setPassword(newPass);
      setPassMessage({ type: 'success', text: 'Password updated successfully.' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        system.setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDevice = (id: number) => {
      setDevices(prev => prev.filter(d => d.id !== id));
  };

  const menuItems = [
    { icon: Palette, label: 'Personalization' },
    { icon: User, label: 'Accounts' },
    { icon: Monitor, label: 'Devices' },
    { icon: Volume2, label: 'Sounds' },
    { icon: Bell, label: 'Notification' },
    { icon: Grid, label: 'Apps' },
    { icon: Layout, label: 'Display' },
    { icon: HardDrive, label: 'Storage' },
    { icon: Battery, label: 'Battery' },
    { icon: Shield, label: 'Privacy' },
    { icon: Accessibility, label: 'Accessibility' },
    { icon: SettingsIcon, label: 'System' },
  ];

  // Colors for Accent Picker
  const accentColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  // Render Content Logic
  const renderContent = () => {
    switch (activeTab) {
      case 'Personalization':
          return (
            <div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personalization</h2>
               
               <SectionCard title="Theme">
                  <div className="flex gap-4">
                      <button 
                        onClick={() => system.theme !== 'light' && system.toggleTheme()}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 group ${system.theme === 'light' ? 'border-blue-500 bg-blue-500/5' : 'border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}`}
                      >
                          <div className="w-full aspect-video bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-6 bg-white border-b border-gray-200" />
                              <div className="absolute top-10 left-4 w-24 h-16 bg-white rounded border border-gray-200 shadow-sm" />
                          </div>
                          <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${system.theme === 'light' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>Light</span>
                              {system.theme === 'light' && <Check size={14} className="text-blue-600" />}
                          </div>
                      </button>

                      <button 
                        onClick={() => system.theme !== 'dark' && system.toggleTheme()}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 group ${system.theme === 'dark' ? 'border-blue-500 bg-blue-500/5' : 'border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}`}
                      >
                          <div className="w-full aspect-video bg-[#1e1e1e] rounded-lg border border-white/10 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-6 bg-[#2d2d2d] border-b border-white/5" />
                              <div className="absolute top-10 left-4 w-24 h-16 bg-[#252525] rounded border border-white/10 shadow-sm" />
                          </div>
                          <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${system.theme === 'dark' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>Dark</span>
                              {system.theme === 'dark' && <Check size={14} className="text-blue-600" />}
                          </div>
                      </button>
                  </div>
               </SectionCard>

               <SectionCard title="System Typography">
                  <div className="grid grid-cols-3 gap-3">
                      {['Inter', 'Lora', 'Patrick Hand'].map((font) => (
                          <button
                              key={font}
                              onClick={() => system.setSystemFont(font as SystemFont)}
                              className={`
                                  p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                                  ${system.systemFont === font 
                                      ? 'border-blue-500 bg-blue-500/5' 
                                      : 'border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}
                              `}
                          >
                              <span className="text-2xl text-gray-800 dark:text-gray-200" style={{ fontFamily: font }}>Aa</span>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{font}</span>
                          </button>
                      ))}
                  </div>
               </SectionCard>

               <SectionCard title="Desktop Customization">
                   <SettingRow 
                     icon={Layout}
                     label="Desktop Widgets"
                     subLabel="Add, remove, and style widgets on your desktop"
                     action={
                        <button 
                            onClick={onOpenWidgetPicker}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded shadow-sm transition-colors"
                        >
                            Open Gallery <ExternalLink size={12} />
                        </button>
                     } 
                   />
                   <div className="my-2 border-b border-black/5 dark:border-white/5" />
                   <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5">
                                <Palette size={18} className="text-gray-600 dark:text-gray-300"/>
                            </div>
                            <div>
                                <div className="text-gray-900 dark:text-gray-200 text-sm font-medium">Accent Color</div>
                                <div className="text-gray-500 dark:text-gray-500 text-xs">Choose your system accent color</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {accentColors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => system.setAccentColor(color)}
                                    className={`w-6 h-6 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${system.accentColor === color ? 'border-white scale-110 ring-2 ring-blue-500' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                   </div>
                   <div className="my-2 border-b border-black/5 dark:border-white/5" />
                   <SettingRow 
                     icon={Layout}
                     label="Transparency effects"
                     subLabel="Windows and surfaces appear translucent"
                     action={<Toggle checked={system.isTransparencyEnabled} onChange={system.toggleTransparency} />} 
                   />
               </SectionCard>
            </div>
          );

      case 'Accounts':
          return (
            <div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Accounts</h2>
               
               {/* Profile Card */}
               <SectionCard className="flex items-center gap-6">
                  <div 
                    className="relative w-20 h-20 rounded-full p-1 group cursor-pointer" 
                    style={{ background: `linear-gradient(to bottom right, ${system.accentColor}, #8b5cf6)` }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                      <div className="w-full h-full rounded-full bg-gray-100 dark:bg-black flex items-center justify-center overflow-hidden relative">
                           {system.avatar ? (
                               <img src={system.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                           ) : (
                               <User size={40} className="text-gray-400 dark:text-gray-300" />
                           )}
                           
                           {/* Overlay for upload hint */}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <CameraIcon size={20} className="text-white" />
                           </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{system.username}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Administrator • Local Account</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline font-medium"
                      >
                        Change profile picture
                      </button>
                  </div>
               </SectionCard>

               <SectionCard title="Sign-in options">
                  <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                          <Key size={20} className="text-blue-500 dark:text-blue-400" />
                          <span className="text-gray-900 dark:text-white font-medium">Password</span>
                      </div>
                      
                      <div className="space-y-3 max-w-sm">
                          <input 
                            type="password" 
                            placeholder="Current Password"
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                          <input 
                            type="password" 
                            placeholder="New Password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                          <input 
                            type="password" 
                            placeholder="Confirm New Password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                          
                          {passMessage && (
                              <div className={`text-xs ${passMessage.type === 'error' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                  {passMessage.text}
                              </div>
                          )}

                          <button 
                             onClick={handlePasswordChange}
                             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors"
                          >
                              Change Password
                          </button>
                      </div>
                  </div>
               </SectionCard>
               
               <SectionCard title="Lock settings">
                   <SettingRow 
                     icon={Lock}
                     label="Lock Screen"
                     subLabel="Automatically lock device when screen turns off"
                     action={<Toggle checked={system.isAutoLockEnabled} onChange={system.toggleAutoLock} />} 
                   />
                   <div className="my-2 border-b border-black/5 dark:border-white/5" />
                   <button 
                     onClick={() => system.setLocked(true)}
                     className="w-full py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded text-gray-900 dark:text-white text-sm font-medium border border-black/5 dark:border-white/5 transition-colors"
                   >
                      Lock Now
                   </button>
               </SectionCard>
            </div>
          );

      case 'Devices':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bluetooth & devices</h2>
            <SectionCard>
               <SettingRow 
                  icon={Bluetooth} 
                  label="Bluetooth" 
                  subLabel={system.isBluetoothEnabled ? "Discoverable as 'ZimDex-PC'" : "Bluetooth is off"}
                  action={<Toggle checked={system.isBluetoothEnabled} onChange={system.toggleBluetooth} />}
               />
               <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                 <button className="w-full py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-gray-900 dark:text-white border border-black/5 dark:border-white/5">
                   Add device
                 </button>
               </div>
            </SectionCard>

            <SectionCard title="Input">
              {devices.filter(d => d.type === 'Input').map((device, i) => (
                  <div key={device.id}>
                      <SettingRow 
                        icon={device.icon} 
                        label={device.name} 
                        subLabel={device.sub} 
                        action={
                            <button 
                                onClick={() => removeDevice(device.id)} 
                                className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                            >
                                Remove
                            </button>
                        } 
                      />
                      {i < devices.filter(d => d.type === 'Input').length - 1 && <div className="my-2 border-b border-black/5 dark:border-white/5" />}
                  </div>
              ))}
              {devices.filter(d => d.type === 'Input').length === 0 && <div className="text-xs text-gray-500 italic">No input devices connected</div>}
            </SectionCard>
            
            <SectionCard title="Other devices">
               {devices.filter(d => d.type === 'Other').map((device, i) => (
                  <div key={device.id}>
                      <SettingRow 
                        icon={device.icon} 
                        label={device.name} 
                        subLabel={device.sub} 
                        action={
                            <button 
                                onClick={() => removeDevice(device.id)} 
                                className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                            >
                                Remove
                            </button>
                        } 
                      />
                      {i < devices.filter(d => d.type === 'Other').length - 1 && <div className="my-2 border-b border-black/5 dark:border-white/5" />}
                  </div>
              ))}
              {devices.filter(d => d.type === 'Other').length === 0 && <div className="text-xs text-gray-500 italic">No other devices connected</div>}
            </SectionCard>
          </div>
        );

      case 'Sounds':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sound</h2>
            <SectionCard title="Output">
               <SettingRow 
                 icon={Speaker} 
                 label="Speakers" 
                 subLabel="Realtek(R) Audio" 
                 action={<span className="text-xs text-blue-500 dark:text-blue-400 cursor-pointer">Properties</span>}
               />
               <div className="mt-4 px-2">
                 <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                   <span>Volume</span>
                   <span>{system.volume}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" max="100" 
                    value={system.volume}
                    onChange={(e) => system.setVolume(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                 />
               </div>
            </SectionCard>

            <SectionCard title="Input">
               <SettingRow 
                 icon={Mic} 
                 label="Microphone Array" 
                 subLabel="Intel Smart Sound Technology" 
                 action={<span className="text-xs text-blue-500 dark:text-blue-400 cursor-pointer">Properties</span>}
               />
            </SectionCard>
          </div>
        );

      case 'Notification':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>
            <SectionCard>
              <SettingRow 
                icon={Bell} 
                label="Notifications" 
                subLabel="Get notifications from apps and other senders" 
                action={<Toggle checked={system.isNotificationsEnabled} onChange={system.toggleNotifications} />}
              />
              <div className="my-2 border-b border-black/5 dark:border-white/5" />
              <SettingRow 
                icon={Moon} 
                label="Do not disturb" 
                subLabel="Notifications will be sent directly to notification center" 
                action={<Toggle checked={system.isDoNotDisturb} onChange={system.toggleDoNotDisturb} />}
              />
            </SectionCard>

            <SectionCard title="Get notifications from these senders">
               <SettingRow 
                 icon={SettingsIcon} label="Settings" subLabel="Banners, Sounds" 
                 action={<Toggle checked={system.isNotificationsEnabled} onChange={() => {}} />} 
               />
               <div className="my-2 border-b border-black/5 dark:border-white/5" />
               <SettingRow 
                 icon={Grid} label="Explorer" subLabel="Banners" 
                 action={<Toggle checked={system.isNotificationsEnabled} onChange={() => {}} />} 
               />
            </SectionCard>
          </div>
        );
        
      case 'Apps':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Apps & features</h2>
            <div className="bg-white/60 dark:bg-[#2a2e35]/80 border border-black/5 dark:border-white/5 rounded-xl p-4 mb-4 flex gap-2">
               <Search className="text-gray-500" size={20} />
               <input 
                 type="text" 
                 placeholder="Search apps" 
                 className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-500"
               />
            </div>
            
            <SectionCard title="Installed apps">
               <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                     <div>
                        <div className="text-gray-900 dark:text-white text-sm font-medium">ZimDex Browser</div>
                        <div className="text-gray-500 text-xs">156 MB • 2025-01-15</div>
                     </div>
                  </div>
                  <SettingsIcon size={16} className="text-gray-500" />
               </div>
               <div className="border-b border-black/5 dark:border-white/5 my-1" />
               <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center text-black"><Volume2 size={20} /></div>
                     <div>
                        <div className="text-gray-900 dark:text-white text-sm font-medium">Spotify</div>
                        <div className="text-gray-500 text-xs">240 MB • 2024-12-20</div>
                     </div>
                  </div>
                  <SettingsIcon size={16} className="text-gray-500" />
               </div>
            </SectionCard>
          </div>
        );

      case 'Display':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Display</h2>
            <SectionCard title="Brightness & color">
               <div className="mb-4">
                 <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                   <span>Brightness</span>
                   <span>{system.brightness}%</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <Sun size={16} className="text-gray-500" />
                   <input 
                        type="range" 
                        min="10" max="100" 
                        value={system.brightness}
                        onChange={(e) => system.setBrightness(parseInt(e.target.value))}
                        className="w-full accent-blue-500 dark:accent-white"
                   />
                   <Sun size={20} className="text-gray-900 dark:text-white" />
                 </div>
               </div>
               <SettingRow 
                 icon={Moon} 
                 label="Night light" 
                 subLabel="Use warmer colors to help block blue light" 
                 action={<Toggle checked={system.isNightLight} onChange={system.toggleNightLight} />}
               />
            </SectionCard>

            <SectionCard title="Scale & layout">
               <SettingRow 
                 label="Scale" 
                 subLabel="100% (Recommended)" 
                 action={<div className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded text-xs text-gray-900 dark:text-white">Change</div>}
               />
               <div className="my-2 border-b border-black/5 dark:border-white/5" />
               <SettingRow 
                 label="Display resolution" 
                 subLabel="1920 x 1080 (Recommended)" 
                 action={<div className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded text-xs text-gray-900 dark:text-white">Change</div>}
               />
            </SectionCard>
          </div>
        );

      case 'Storage':
         return (
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Storage</h2>
             <SectionCard className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-lg flex items-center justify-center">
                      <HardDrive size={32} className="text-blue-500 dark:text-blue-400" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-end mb-1">
                         <span className="text-gray-900 dark:text-white font-medium">Local Disk (C:)</span>
                         <span className="text-gray-500 dark:text-gray-400 text-sm">420 GB used / 1.8 TB free</span>
                      </div>
                      <ProgressBar value={20} />
                   </div>
                </div>
             </SectionCard>
             
             <SectionCard title="Usage breakdown">
                <SettingRow icon={Grid} label="Apps & features" subLabel="210 GB" />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <SettingRow icon={Trash2} label="Temporary files" subLabel="14 GB" />
             </SectionCard>
           </div>
         );

      case 'Battery':
         return (
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Power & battery</h2>
             <SectionCard className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-green-500 rounded-full border-l-transparent border-b-transparent rotate-45"></div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(system.batteryLevel)}%</span>
                   </div>
                   <div>
                      <div className="text-gray-900 dark:text-white font-medium">Estimated time remaining</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">{system.isCharging ? 'Charging...' : '5 hours 21 minutes'}</div>
                   </div>
                </div>
             </SectionCard>
             
             <SectionCard title="Power options">
                <SettingRow 
                  label="Power mode" 
                  subLabel="Optimize for performance" 
                  action={<div className="text-sm text-gray-900 dark:text-white bg-black/5 dark:bg-white/10 px-3 py-1 rounded border border-black/5 dark:border-white/10">Best performance</div>}
                />
             </SectionCard>
           </div>
         );

      case 'Privacy':
         return (
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy & security</h2>
             <SectionCard title="Windows permissions">
                <SettingRow icon={Shield} label="General" subLabel="Advertising ID, local content" />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <SettingRow icon={Mic} label="Speech" subLabel="Online speech recognition" />
             </SectionCard>
             
             <SectionCard title="App permissions">
                <SettingRow 
                    icon={MapPin} label="Location" subLabel="On" 
                    action={<Toggle checked={system.isLocationEnabled} onChange={system.toggleLocation} />} 
                />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <SettingRow 
                    icon={Camera} label="Camera" subLabel="On" 
                    action={<Toggle checked={system.isCameraEnabled} onChange={system.toggleCamera} />} 
                />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <SettingRow 
                    icon={Mic} label="Microphone" subLabel="On" 
                    action={<Toggle checked={system.isMicrophoneEnabled} onChange={system.toggleMicrophone} />} 
                />
             </SectionCard>
           </div>
         );
      
      case 'Accessibility':
         return (
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Accessibility</h2>
             <SectionCard title="Vision">
                <SettingRow icon={Type} label="Text size" subLabel="Make text bigger" />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <div className="my-2" />
             </SectionCard>

             <SectionCard title="Animation Tuning">
                <div className="px-1 space-y-4">
                   {/* Speed Control */}
                   <div>
                      <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5">
                                <Zap size={18} className="text-gray-600 dark:text-gray-300"/>
                            </div>
                            <div>
                                <div className="text-gray-900 dark:text-gray-200 text-sm font-medium">Animation Speed</div>
                                <div className="text-gray-500 dark:text-gray-500 text-xs">Adjust window and transition speed</div>
                            </div>
                          </div>
                          <span className="text-gray-900 dark:text-white text-sm font-bold">{system.animationSpeed}x</span>
                      </div>
                      <input 
                          type="range" 
                          min="0.5" max="3" step="0.5"
                          value={system.animationSpeed}
                          onChange={(e) => system.setAnimationSpeed(parseFloat(e.target.value))}
                          className="w-full accent-blue-500"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>Slow</span>
                          <span>Fast</span>
                      </div>
                   </div>

                   {/* Animation Type Selector */}
                   <div className="pt-2 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5">
                              <Move3d size={18} className="text-gray-600 dark:text-gray-300"/>
                          </div>
                          <div>
                              <div className="text-gray-900 dark:text-gray-200 text-sm font-medium">Animation Style</div>
                              <div className="text-gray-500 dark:text-gray-500 text-xs">Choose the feel of OS animations</div>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                          {(['default', 'snappy', 'bouncy', 'linear'] as AnimationType[]).map((type) => (
                              <button
                                key={type}
                                onClick={() => system.setAnimationType(type)}
                                className={`
                                    px-3 py-2 rounded-lg text-xs font-medium border transition-all
                                    ${system.animationType === type 
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-400' 
                                        : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10'}
                                `}
                              >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                              </button>
                          ))}
                      </div>
                   </div>
                </div>
             </SectionCard>

             <SectionCard title="Hearing">
                <SettingRow icon={Volume2} label="Audio" subLabel="Mono audio, audio notifications" />
             </SectionCard>
           </div>
         );
         
      case 'System':
         return (
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System</h2>
             <SectionCard>
                <SettingRow icon={Monitor} label="Display" subLabel="Monitors, brightness, night light, display profile" />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <SettingRow icon={Volume2} label="Sound" subLabel="Volume levels, output, input, sound devices" />
                <div className="my-2 border-b border-black/5 dark:border-white/5" />
                <SettingRow icon={Bell} label="Notifications" subLabel="Alerts from apps and system, do not disturb" />
             </SectionCard>
           </div>
         );

      case 'About':
      default:
        return (
          <div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* Computer Name Card */}
              <div className="col-span-5 bg-white/60 dark:bg-[#2a2e35]/80 border border-black/5 dark:border-white/5 rounded-xl p-5 flex flex-col justify-center shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Computer name</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">ZimDex-PC</h2>
              </div>
              
              {/* Hero Banner */}
              <div className="col-span-7 relative h-32 rounded-xl overflow-hidden border border-black/5 dark:border-white/5 group bg-gradient-to-r from-blue-900 to-purple-900 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
                  alt="ZimDex Banner" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
                    <div className="flex flex-col relative z-10">
                      <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                        ZimDex <span className="text-2xl font-light opacity-90">with AI</span>
                      </h1>
                    </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* Device Info */}
              <div className="col-span-5 bg-white/60 dark:bg-[#2a2e35]/80 border border-black/5 dark:border-white/5 rounded-xl p-5 flex flex-col justify-center shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Device ID</span>
                <div className="bg-gray-100 dark:bg-[#1a1d21] text-gray-600 dark:text-gray-400 font-mono text-xs p-2 rounded border border-black/5 dark:border-white/5 break-all">
                  7A91-4F22-9910-D3X1
                </div>
              </div>
              <div className="col-span-7 bg-white/60 dark:bg-[#2a2e35]/80 border border-black/5 dark:border-white/5 rounded-xl p-5 flex flex-col justify-center shadow-sm">
                 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Product ID</span>
                 <div className="text-gray-900 dark:text-white text-sm">00330-80000-00000-AA539</div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-white/60 dark:bg-[#2a2e35]/80 border border-black/5 dark:border-white/5 rounded-xl p-6 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">System Specifications</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                  {/* CPU */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                      <Cpu size={12} /> Processor
                    </div>
                    <div className="text-gray-900 dark:text-white font-semibold text-sm">Intel® Core™ i9-14900K</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">3.20 GHz (Turbo 6.00 GHz)</div>
                  </div>

                  {/* GPU */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                      <CircuitBoard size={12} /> Graphics
                    </div>
                    <div className="text-gray-900 dark:text-white font-semibold text-sm">NVIDIA GeForce RTX 4090</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">24 GB GDDR6X</div>
                  </div>

                  {/* RAM */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                      <HardDrive size={12} /> Memory
                    </div>
                    <div className="text-gray-900 dark:text-white font-semibold text-sm">64 GB</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">DDR5 6000MHz</div>
                  </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full text-gray-900 dark:text-gray-100 font-sans bg-[#f3f3f3] dark:bg-transparent transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-[240px] bg-white/50 dark:bg-black/20 border-r border-black/5 dark:border-white/5 flex flex-col py-4">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto space-y-1 px-2 custom-scrollbar">
           
           {/* User Account Quick Link */}
           <button
              onClick={() => setActiveTab('Accounts')}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-md text-sm transition-all duration-200 border border-transparent relative group hover:bg-black/5 dark:hover:bg-white/5`}
            >
               {activeTab === 'Accounts' && (
                  <motion.div 
                     layoutId="settings-sidebar-active" 
                     className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-md"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
               )}
               <div className="relative z-10 flex items-center gap-3 w-full">
                 <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden" 
                    style={{ backgroundColor: system.accentColor }}
                 >
                   {system.avatar ? <img src={system.avatar} alt="User" className="w-full h-full object-cover" /> : system.username[0]}
                 </div>
                 <div className="text-left">
                   <div className="text-xs font-bold text-gray-900 dark:text-white">{system.username}</div>
                   <div className="text-[10px] text-gray-500 dark:text-gray-400">Local Account</div>
                 </div>
               </div>
            </button>

          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 relative group hover:bg-black/5 dark:hover:bg-white/5`}
            >
              {activeTab === item.label && (
                  <motion.div 
                     layoutId="settings-sidebar-active" 
                     className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-md"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
              )}
              <div className="relative z-10 flex items-center gap-3">
                 <item.icon size={16} className={`${activeTab === item.label ? 'text-[#3b82f6]' : 'text-gray-500'} ${item.label === 'Notification' ? 'text-red-500 dark:text-red-400' : ''} ${item.label === 'Battery' ? 'text-green-600 dark:text-green-400' : ''} transition-colors`} />
                 <span className={activeTab === item.label ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}>{item.label}</span>
              </div>
            </button>
          ))}
           {/* Separator before About */}
           <div className="my-2 border-b border-black/5 dark:border-white/5 mx-4"></div>
           <button
              onClick={() => setActiveTab('About')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 relative group hover:bg-black/5 dark:hover:bg-white/5`}
            >
              {activeTab === 'About' && (
                  <motion.div 
                     layoutId="settings-sidebar-active" 
                     className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-md"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
              )}
              <div className="relative z-10 flex items-center gap-3">
                 <Info size={16} className={activeTab === 'About' ? 'text-gray-900 dark:text-white' : 'text-gray-500'} />
                 <span className={activeTab === 'About' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}>About</span>
              </div>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
