interface SidebarProps {
  currentScreen: 'capture' | 'edit'
  onNavigate: (screen: 'capture' | 'edit') => void
}

export const Sidebar = ({ currentScreen, onNavigate }: SidebarProps) => {
  return (
    <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#EC1A66] text-white font-bold flex items-center justify-center text-sm mb-12">
        S
      </div>
      
      {/* Nav Icons */}
      <div className="flex flex-col gap-4 items-center flex-1">
        <button 
          onClick={() => onNavigate('capture')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentScreen === 'capture' 
              ? 'bg-[#EC1A66] text-white' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 21h6" />
          </svg>
        </button>
        
        <button 
          onClick={() => onNavigate('capture')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentScreen === 'capture' 
              ? 'bg-[#EC1A66] text-white' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </button>
        
        <button 
          onClick={() => onNavigate('edit')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentScreen === 'edit' 
              ? 'bg-[#EC1A66] text-white' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button 
          onClick={() => onNavigate('edit')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentScreen === 'edit' 
              ? 'bg-[#EC1A66] text-white' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button 
          onClick={() => onNavigate('capture')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentScreen === 'capture' 
              ? 'bg-[#EC1A66] text-white' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Bottom Icons */}
      <div className="flex flex-col gap-4 items-center mt-auto">
        <button className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37.96 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 002.573-1.065z" />
          </svg>
        </button>
        
        <button className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.372 2.033-2.349 3.772-2.349 2.294 0 4.282 1.938 4.936 4.443m.59 3.249L14.79 17.553M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <button className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
