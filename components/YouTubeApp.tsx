
import React, { useState, useRef, useEffect } from 'react';
import { Search, Home, Compass, PlaySquare, Clock, ThumbsUp, MoreVertical, Bell, Menu, User, Youtube, Mic, Video, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoData {
  id: string;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  thumbnail: string;
  avatar: string;
  embedId: string;
}

const MOCK_VIDEOS: VideoData[] = [
  {
    id: '1',
    title: "lofi hip hop radio 📚 beats to relax/study to",
    channel: "Lofi Girl",
    views: "68K watching",
    timestamp: "LIVE",
    thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "jfKfPfyJRdk"
  },
  {
    id: '2',
    title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)",
    channel: "Jacob + Katie Schwarz",
    views: "102M views",
    timestamp: "5 years ago",
    thumbnail: "https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_lWJ_8y_1_8y_1_8y_1_8y_1_8y_1=s176-c-k-c0x00ffffff-no-rj",
    embedId: "LXb3EKWsInQ"
  },
  {
    id: '3',
    title: "React in 100 Seconds",
    channel: "Fireship",
    views: "2.1M views",
    timestamp: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/Tn6-PIqc4UM/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "Tn6-PIqc4UM"
  },
  {
    id: '4',
    title: "Synthwave Radio - Beats to Chill/Game to",
    channel: "Retro Vibes",
    views: "1.2M views",
    timestamp: "LIVE",
    thumbnail: "https://img.youtube.com/vi/4xDzrJKXOOY/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "4xDzrJKXOOY"
  },
  {
    id: '5',
    title: "How to Cook a Steak | Gordon Ramsay",
    channel: "Gordon Ramsay",
    views: "25M views",
    timestamp: "4 years ago",
    thumbnail: "https://img.youtube.com/vi/2JCn05F7kfM/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "2JCn05F7kfM"
  },
  {
    id: '6',
    title: "Hans Zimmer - Interstellar Main Theme (Piano Version)",
    channel: "Patrik Pietschmann",
    views: "50M views",
    timestamp: "8 years ago",
    thumbnail: "https://img.youtube.com/vi/4y33h81phKU/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "4y33h81phKU"
  },
  {
    id: '7',
    title: "Switzerland in 8K ULTRA HD",
    channel: "High Tech",
    views: "200K views",
    timestamp: "5 hours ago",
    thumbnail: "https://img.youtube.com/vi/linlz7-Pnvw/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "linlz7-Pnvw"
  },
  {
    id: '8',
    title: "Building a Custom Keyboard",
    channel: "Tech Tips",
    views: "340K views",
    timestamp: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/8E-WbKy8eWw/maxresdefault.jpg",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_k1d8-W72XN-7j8fK5g_9qQ9q8k_8x8q8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    embedId: "8E-WbKy8eWw"
  }
];

export const YouTubeApp = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedVideo]);

  const filteredVideos = MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleVideoClick = (video: VideoData) => {
    setSelectedVideo(video);
  };

  const goHome = () => {
    setSelectedVideo(null);
    setSearchQuery('');
  };

  const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer ${active ? 'bg-[#272727] font-medium' : 'hover:bg-[#272727]'}`}>
      <Icon size={20} className={active ? 'text-white' : ''} />
      <span className={`text-sm ${active ? 'text-white' : 'text-[#f1f1f1]'}`}>{label}</span>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#0f0f0f] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm z-50 border-b border-[#272727] sm:border-none">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#272727] rounded-full">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-1 cursor-pointer" onClick={goHome}>
            <div className="w-7 h-5 bg-red-600 rounded-lg flex items-center justify-center relative">
               <div className="border-t-[3px] border-b-[3px] border-l-[6px] border-transparent border-l-white ml-0.5" />
            </div>
            <span className="text-lg font-bold tracking-tighter font-sans">YouTube</span>
            <span className="text-[10px] text-gray-400 -mt-3 ml-0.5">VN</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-8 flex items-center gap-4 hidden sm:flex">
          <div className="flex flex-1">
            <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 focus-within:border-[#1c62b9] ml-8 shadow-inner">
              <Search size={18} className="text-[#303030] mr-2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-transparent border-none outline-none py-2 text-base font-normal placeholder-gray-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-5 hover:bg-[#303030] transition-colors">
              <Search size={20} className="text-gray-300" />
            </button>
          </div>
          <button className="p-2.5 bg-[#181818] hover:bg-[#303030] rounded-full">
            <Mic size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block"><Video size={20} /></button>
          <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block"><Bell size={20} /></button>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-medium ml-2 cursor-pointer shadow-md">
            Z
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-col px-3 py-2 overflow-y-auto custom-scrollbar hidden md:flex shrink-0"
            >
              <SidebarItem icon={Home} label="Home" active={!selectedVideo} />
              <SidebarItem icon={Compass} label="Shorts" />
              <SidebarItem icon={PlaySquare} label="Subscriptions" />
              <div className="h-[1px] bg-[#303030] my-3 mx-2" />
              <SidebarItem icon={User} label="Your channel" />
              <SidebarItem icon={Clock} label="History" />
              <SidebarItem icon={PlaySquare} label="Your videos" />
              <SidebarItem icon={Clock} label="Watch later" />
              <SidebarItem icon={ThumbsUp} label="Liked videos" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f0f0f] p-4 sm:p-6">
          {!selectedVideo ? (
            // Home Grid
            <div className="flex flex-col gap-6">
              {/* Filter Chips */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Gaming', 'Music', 'Live', 'Mixes', 'Computers', 'Programming', 'Podcasts', 'News', 'Recently Uploaded', 'Watched'].map((tag, i) => (
                  <button 
                    key={tag} 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-[#272727] hover:bg-[#3f3f3f] text-white'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => handleVideoClick(video)}>
                    <div className="aspect-video rounded-xl overflow-hidden relative bg-[#202020]">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium backdrop-blur-sm">
                        {video.timestamp === 'LIVE' ? <span className="text-red-500 flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/> LIVE</span> : '12:45'}
                      </div>
                    </div>
                    <div className="flex gap-3 items-start relative mt-1">
                      <img src={video.avatar} alt={video.channel} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold line-clamp-2 leading-tight text-white mb-1 group-hover:text-white/90 transition-colors">
                            {video.title}
                        </h3>
                        <div className="text-sm text-[#aaaaaa]">
                            <div className="hover:text-white transition-colors truncate">{video.channel}</div>
                            <div>{video.views} • {video.timestamp}</div>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#272727] rounded-full self-start absolute top-0 right-0 transition-all text-white">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Watch View
            <div className="flex flex-col lg:flex-row gap-6 max-w-[1700px] mx-auto">
              {/* Main Player Column */}
              <div className="flex-1 min-w-0">
                <div className="aspect-video bg-black w-full rounded-xl overflow-hidden shadow-2xl relative">
                   <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1&rel=0`} 
                      title={selectedVideo.title} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0"
                   ></iframe>
                </div>
                <div className="mt-4">
                  <h1 className="text-xl font-bold line-clamp-2 text-white">{selectedVideo.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4">
                    <div className="flex items-center gap-3">
                      <img src={selectedVideo.avatar} alt={selectedVideo.channel} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-sm text-white hover:text-gray-300 cursor-pointer">{selectedVideo.channel}</div>
                        <div className="text-xs text-[#aaaaaa]">1.2M subscribers</div>
                      </div>
                      <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">Subscribe</button>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      <div className="flex items-center bg-[#272727] rounded-full overflow-hidden shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] transition-colors">
                          <ThumbsUp size={18} /> <span className="text-sm font-medium">45K</span>
                        </button>
                        <button className="px-4 py-2 hover:bg-[#3f3f3f] transition-colors rotate-180">
                          <ThumbsUp size={18} />
                        </button>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-colors shrink-0">
                        <span className="text-sm font-medium">Share</span>
                      </button>
                      <button className="p-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-colors shrink-0">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-[#272727] p-3 rounded-xl text-sm cursor-pointer hover:bg-[#3f3f3f] transition-colors">
                    <div className="font-bold mb-1 text-white">{selectedVideo.views} • {selectedVideo.timestamp}</div>
                    <p className="text-white/80 line-clamp-2">
                      Experience the ultimate visual and auditory journey with this carefully curated content. Don't forget to like and subscribe for more amazing videos!
                    </p>
                    <div className="mt-1 font-bold text-white/60 text-xs">...more</div>
                  </div>
                </div>
                
                {/* Comments Section Placeholder */}
                <div className="mt-6 hidden lg:block">
                   <div className="flex items-center gap-8 mb-4">
                      <h3 className="text-xl font-bold text-white">482 Comments</h3>
                      <div className="flex items-center gap-2 text-sm font-medium cursor-pointer text-white"><Grid size={18} /> Sort by</div>
                   </div>
                   <div className="flex gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-sm text-white">Y</div>
                      <div className="flex-1 border-b border-[#303030] pb-2 text-gray-400 text-sm">Add a comment...</div>
                   </div>
                   {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 mb-4">
                         <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0" />
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-xs font-bold text-white">User_{992+i}</span>
                               <span className="text-xs text-gray-400">2 hours ago</span>
                            </div>
                            <p className="text-sm text-white">This video is absolutely amazing! The quality is top notch.</p>
                            <div className="flex items-center gap-4 mt-2">
                               <ThumbsUp size={14} className="text-gray-400 cursor-pointer hover:text-white" />
                               <span className="text-xs text-gray-400">12</span>
                               <div className="rotate-180"><ThumbsUp size={14} className="text-gray-400 cursor-pointer hover:text-white" /></div>
                               <span className="text-xs font-bold text-gray-400 hover:text-white cursor-pointer">Reply</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>

              {/* Recommendations Column */}
              <div className="lg:w-[350px] xl:w-[400px] shrink-0 flex flex-col gap-2">
                {MOCK_VIDEOS.filter(v => v.id !== selectedVideo.id).map(video => (
                  <div key={video.id} className="flex gap-2 cursor-pointer group" onClick={() => handleVideoClick(video)}>
                    <div className="w-40 aspect-video rounded-lg overflow-hidden shrink-0 relative bg-[#202020]">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-medium text-white">4:20</div>
                    </div>
                    <div className="flex flex-col pr-4 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 leading-tight text-white mb-1 group-hover:text-white/90 transition-colors">
                          {video.title}
                      </h4>
                      <div className="text-xs text-[#aaaaaa] hover:text-white transition-colors">{video.channel}</div>
                      <div className="text-xs text-[#aaaaaa]">{video.views} • {video.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
