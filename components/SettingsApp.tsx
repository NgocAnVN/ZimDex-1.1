
import React, { useState, useRef } from 'react';
import { 
  Monitor, Volume2, Bell, Grid, Layout, HardDrive, 
  Battery, Shield, Accessibility, Settings as SettingsIcon, 
  Info, User, Cpu, CircuitBoard, Type, Keyboard,
  Mouse, Printer, Bluetooth, Wifi, Moon, Sun,
  Trash2, Mic, Camera, MapPin, Eye, Smartphone, Speaker,
  Lock, Key, Search, Zap, Move3d, Palette, Check,
  Cloud, Calendar, Clock, Music, CheckSquare, StickyNote, ExternalLink, Camera as CameraIcon, ArrowRight
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

  const getFontFamilyStyle = (fontName: string) => {
      switch(fontName) {
          case 'Patrick Hand': return '"Patrick Hand", cursive';
          case 'Lora': return '"Lora", serif';
          default: return 'Inter, sans-serif';
      }
  };

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
                              <span className="text-2xl text-gray-800 dark:text-gray-200" style={{ fontFamily: getFontFamilyStyle(font) }}>Aa</span>
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
            <SectionCard title="App List">
               <SettingRow 
                 icon={Grid} 
                 label="Installed Apps" 
                 subLabel="12 apps installed" 
                 action={<ArrowRight size={16} className="text-gray-400" />}
               />
               <div className="my-2 border-b border-black/5 dark:border-white/5" />
               <SettingRow 
                 icon={SettingsIcon} 
                 label="Advanced app settings" 
                 subLabel="Aliases, execution" 
                 action={<ArrowRight size={16} className="text-gray-400" />}
               />
            </SectionCard>
          </div>
        );

      case 'Display':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Display</h2>
            <SectionCard title="Brightness & color">
               <div className="px-2 mb-4">
                 <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                   <span>Brightness</span>
                   <span>{system.brightness}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" max="100" 
                    value={system.brightness}
                    onChange={(e) => system.setBrightness(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                 />
               </div>
               <SettingRow 
                 icon={Moon} 
                 label="Night light" 
                 subLabel="Use warmer colors to block blue light" 
                 action={<Toggle checked={system.isNightLight} onChange={system.toggleNightLight} />}
               />
            </SectionCard>
          </div>
        );

      case 'Storage':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Storage</h2>
            <SectionCard title="Local Disk (C:)">
                <div className="mb-4">
                    <div className="flex justify-between mb-2 text-sm text-gray-900 dark:text-white font-medium">
                        <span>248 GB used</span>
                        <span>1.8 TB free</span>
                    </div>
                    <ProgressBar value={40} color="bg-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 text-purple-500 rounded flex items-center justify-center"><Grid size={16} /></div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">124 GB</div>
                            <div className="text-xs text-gray-500">Apps & features</div>
                        </div>
                    </div>
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 text-yellow-500 rounded flex items-center justify-center"><SettingsIcon size={16} /></div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">48 GB</div>
                            <div className="text-xs text-gray-500">System & reserved</div>
                        </div>
                    </div>
                </div>
            </SectionCard>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
             <SettingsIcon size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Settings Unavailable</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mt-2">
                 This section is currently under development or restricted by system policy.
             </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex bg-[#f3f3f3] dark:bg-[#202020] font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#f9f9f9] dark:bg-[#2b2b2b] border-r border-black/5 dark:border-white/5 flex flex-col">
        <div className="p-6 pb-4">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                 <SettingsIcon size={20} />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">Settings</span>
           </div>
           
           <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find a setting" 
                className="w-full bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-md pl-9 pr-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 space-y-0.5">
           {menuItems.map((item) => (
             <button
               key={item.label}
               onClick={() => setActiveTab(item.label)}
               className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === item.label ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
             >
               <item.icon size={18} />
               {item.label}
             </button>
           ))}
        </div>
        
        {/* User Info Tiny */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {system.avatar ? <img src={system.avatar} className="w-full h-full object-cover" alt="User" /> : <User size={16} className="m-2 text-gray-500" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{system.username}</div>
                <div className="text-xs text-gray-500 truncate">Local Account</div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
         <div className="max-w-3xl mx-auto pb-10">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};
