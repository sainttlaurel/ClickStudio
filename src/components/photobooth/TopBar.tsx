interface TopBarProps {
  currentScreen: 'capture' | 'edit'
  photoCount?: number
  onBack?: () => void
}

export const TopBar = ({ currentScreen, photoCount = 0, onBack }: TopBarProps) => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {currentScreen === 'capture' ? (
          <>
            <button 
              onClick={onBack}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span>‹</span>
              <span>Back</span>
            </button>
            <span className="text-gray-900 font-medium">Single Photo</span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-400">1 pose</span>
          </>
        ) : (
          <>
            <button 
              onClick={onBack}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span>‹</span>
              <span>Back</span>
            </button>
            <span className="text-gray-400">Preview</span>
            <span className="text-gray-400 text-xs">›</span>
            <span className="text-gray-900 font-medium">Edit photo</span>
          </>
        )}
      </div>
      
      {/* Right side buttons (edit screens only) */}
      {currentScreen === 'edit' && (
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            Reset
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            Undo
          </button>
          <button className="px-4 py-1.5 rounded-full bg-[#EC1A66] text-white font-medium text-sm hover:bg-[#EC1A66]/90 transition-all">
            Save
          </button>
        </div>
      )}
      
      {/* Photo counter (capture screen) */}
      {currentScreen === 'capture' && (
        <div className="text-sm text-gray-400">
          {photoCount} / 1 captured
        </div>
      )}
    </div>
  )
}
