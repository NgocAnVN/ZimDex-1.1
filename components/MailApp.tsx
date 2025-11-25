
import React, { useState } from 'react';
import { 
  Inbox, Send, File, Trash2, Star, AlertCircle, 
  Search, RotateCw, ChevronLeft, ChevronRight, 
  MoreVertical, Reply, ReplyAll, Forward, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../contexts/SystemContext';

interface Email {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  read: boolean;
  avatarColor: string;
}

const MOCK_EMAILS: Email[] = [
  {
    id: 1,
    sender: "Ginger Root",
    senderEmail: "newsletter@gingerroot.com",
    subject: "City Slicker Tour Dates Announced!",
    preview: "Hey everyone, we are hitting the road again this summer...",
    content: "Hey everyone,\n\nWe are hitting the road again this summer for the City Slicker Tour! We'll be visiting 25 cities across North America.\n\nPre-sale tickets go live this Friday. Don't miss out on the exclusive merch bundles.\n\nSee you there,\nCameron",
    date: "10:42 AM",
    read: false,
    avatarColor: "bg-red-500"
  },
  {
    id: 2,
    sender: "Minh Tốc & Lam",
    senderEmail: "updates@minhtoclam.vn",
    subject: "New Release: Những Giai Điệu Khác 2",
    preview: "Our latest track is now available on all streaming platforms...",
    content: "Hello fans,\n\nWe are thrilled to announce the release of 'Những Giai Điệu Khác 2'. This song explores new sonic landscapes while keeping the soul you know and love.\n\nListen now on the Music App!\n\nWarmly,\nMinh Tốc & Lam",
    date: "Yesterday",
    read: true,
    avatarColor: "bg-purple-500"
  },
  {
    id: 3,
    sender: "ZimDex Support",
    senderEmail: "security@zimdex.os",
    subject: "Security Alert: New Login Detected",
    preview: "We noticed a new login to your ZimDex account from...",
    content: "We noticed a new login to your ZimDex account from a device named 'Unknown-Device'.\n\nLocation: Hanoi, Vietnam\nTime: Just now\n\nIf this was you, you can ignore this email. If not, please reset your password immediately.",
    date: "Jan 15",
    read: true,
    avatarColor: "bg-blue-500"
  },
  {
    id: 4,
    sender: "Spotify",
    senderEmail: "no-reply@spotify.com",
    subject: "Your Weekly Discover Weekly",
    preview: "Your weekly mixtape of fresh music. Enjoy new tracks...",
    content: "Your weekly mixtape of fresh music is ready. We've picked some songs we think you'll love based on your recent listening history.\n\nTop picks:\n- Loretta by Ginger Root\n- An Thần by Low G\n\nListen now.",
    date: "Jan 12",
    read: true,
    avatarColor: "bg-green-500"
  },
  {
    id: 5,
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "[ZimDex/OS] Pull Request #42 Merged",
    preview: "ngocann merged commit 3a1b2c into main...",
    content: "ngocann merged commit 3a1b2c into main.\n\nChanges:\n- Added Mail App\n- Updated Music Playlist\n- Fixed minor bugs in File Explorer\n\nView details on GitHub.",
    date: "Jan 10",
    read: true,
    avatarColor: "bg-gray-600"
  }
];

export const MailApp: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { avatar, username } = useSystem();

  const filteredEmails = MOCK_EMAILS.filter(email => 
    email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmail = MOCK_EMAILS.find(e => e.id === selectedEmailId);

  const NavItem = ({ id, icon: Icon, label, count }: any) => (
    <button 
      onClick={() => {
          setSelectedFolder(id);
          setSelectedEmailId(null);
      }}
      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 group`}
    >
      {selectedFolder === id && (
        <motion.div 
          layoutId="mail-nav-active"
          className="absolute inset-0 bg-blue-100 dark:bg-blue-600/20 rounded-lg"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className={`relative z-10 flex items-center gap-3 ${selectedFolder === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-gray-200'}`}>
        <Icon size={18} />
        {label}
      </div>
      {count && <span className="relative z-10 text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-md text-gray-600 dark:text-gray-300">{count}</span>}
    </button>
  );

  return (
    <div className="w-full h-full flex bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl text-gray-800 dark:text-gray-200 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <div className="w-60 flex flex-col border-r border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 shrink-0 transition-colors">
         <div className="p-4">
             <button className="w-full py-2.5 bg-white hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-gray-900 dark:text-white border border-black/5 dark:border-white/5 shadow-sm flex items-center justify-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white"><span className="text-xs font-bold">+</span></div>
                 New Message
             </button>
         </div>
         
         <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
            <div className="text-xs font-bold text-gray-500 px-3 mb-2 uppercase tracking-wider">Favorites</div>
            <NavItem id="inbox" icon={Inbox} label="Inbox" count={2} />
            <NavItem id="sent" icon={Send} label="Sent" />
            <NavItem id="drafts" icon={File} label="Drafts" count={1} />
            <NavItem id="junk" icon={AlertCircle} label="Junk" />
            <NavItem id="trash" icon={Trash2} label="Trash" />
            
            <div className="h-[1px] bg-black/5 dark:bg-white/5 my-3 mx-2" />
            
            <div className="text-xs font-bold text-gray-500 px-3 mb-2 uppercase tracking-wider">Folders</div>
            <NavItem id="important" icon={Star} label="Important" />
            <NavItem id="work" icon={File} label="Work" />
            <NavItem id="personal" icon={File} label="Personal" />
         </div>

         <div className="p-4 border-t border-black/5 dark:border-white/5">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                     {avatar ? (
                         <img src={avatar} alt="User" className="w-full h-full object-cover" />
                     ) : (
                         <span>{username[0]}</span>
                     )}
                 </div>
                 <div className="overflow-hidden">
                     <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{username}</div>
                     <div className="text-xs text-gray-500 truncate">admin@zimdex.os</div>
                 </div>
             </div>
         </div>
      </div>

      {/* Email List */}
      <div className="w-80 flex flex-col border-r border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#151515]/50 shrink-0 transition-colors">
          <div className="h-14 flex items-center px-4 border-b border-black/5 dark:border-white/5 shrink-0 gap-2">
             <div className="flex-1 relative">
                 <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                 <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors"
                 />
             </div>
             <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                 <RotateCw size={14} />
             </button>
          </div>

          <motion.div 
             className="flex-1 overflow-y-auto custom-scrollbar"
             initial="hidden"
             animate="visible"
             variants={{
               hidden: { opacity: 0 },
               visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
             }}
          >
             {filteredEmails.map((email, index) => (
                 <motion.div 
                    key={email.id}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    onClick={() => setSelectedEmailId(email.id)}
                    className={`
                        p-4 border-b border-black/5 dark:border-white/5 cursor-pointer transition-colors relative
                        ${selectedEmailId === email.id ? 'bg-blue-50 dark:bg-blue-600/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                        ${!email.read ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500' : ''}
                    `}
                 >
                    <div className="flex justify-between items-start mb-1">
                        <div className={`text-sm font-medium truncate pr-2 ${!email.read ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{email.sender}</div>
                        <div className="text-[10px] text-gray-500 whitespace-nowrap">{email.date}</div>
                    </div>
                    <div className={`text-xs truncate mb-1.5 ${!email.read ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{email.subject}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{email.preview}</div>
                 </motion.div>
             ))}
          </motion.div>
      </div>

      {/* Reading Pane */}
      <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-[#181818]/30 min-w-0 relative transition-colors">
         <AnimatePresence mode="wait">
         {selectedEmail ? (
             <motion.div 
                key={selectedEmail.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-1 flex flex-col h-full"
             >
                {/* Toolbar */}
                <div className="h-14 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/5 shrink-0 transition-colors">
                   <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="Reply"><Reply size={18} /></button>
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="Reply All"><ReplyAll size={18} /></button>
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="Forward"><Forward size={18} /></button>
                      <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1" />
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete"><Trash2 size={18} /></button>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="Previous"><ChevronLeft size={18} /></button>
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="Next"><ChevronRight size={18} /></button>
                   </div>
                </div>

                {/* Email Header */}
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{selectedEmail.subject}</h2>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${selectedEmail.avatarColor}`}>
                                 {selectedEmail.sender[0]}
                             </div>
                             <div>
                                 <div className="flex items-center gap-2">
                                     <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedEmail.sender}</span>
                                     <span className="text-xs text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</span>
                                 </div>
                                 <div className="text-xs text-gray-500 mt-0.5">To: {username} &lt;admin@zimdex.os&gt;</div>
                             </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            {selectedEmail.date}, 2025
                        </div>
                    </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                    <div className="text-sm text-gray-800 dark:text-gray-300 leading-7 whitespace-pre-wrap font-sans max-w-3xl">
                        {selectedEmail.content}
                    </div>
                    
                    {/* Mock Attachment */}
                    <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                            <Paperclip size={12} /> 1 Attachment
                        </div>
                        <div className="inline-flex items-center gap-3 p-2 pr-4 rounded border border-black/10 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                             <div className="w-8 h-8 bg-red-100 dark:bg-red-500/20 rounded flex items-center justify-center text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">
                                 <File size={16} />
                             </div>
                             <div>
                                 <div className="text-xs font-medium text-gray-900 dark:text-white">Document.pdf</div>
                                 <div className="text-[10px] text-gray-500">1.2 MB</div>
                             </div>
                        </div>
                    </div>
                </div>
             </motion.div>
         ) : (
             <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600"
             >
                 <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                     <Inbox size={40} className="opacity-20" />
                 </div>
                 <p className="text-sm">Select an email to read</p>
             </motion.div>
         )}
         </AnimatePresence>
      </div>
    </div>
  );
};
