interface CanvasProps {
  imageUrl?: string | null
  isEditing?: boolean
  hasStickers?: boolean
}

export const Canvas = ({ imageUrl, isEditing = false, hasStickers = false }: CanvasProps) => {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center">
      <div 
        className={`relative rounded-2xl overflow-hidden shadow-lg ${
          isEditing ? 'w-[208px] h-[208px]' : 'w-[300px] h-[300px]'
        } ${hasStickers ? 'border-2 border-dashed border-gray-300' : ''}`}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Photo" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#0F172A] flex flex-col items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/50 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/50 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/50 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/50 rounded-br-sm" />
            
            {/* Camera icon */}
            <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            
            <span className="text-white/50 text-sm">Camera will appear here</span>
          </div>
        )}
      </div>
    </div>
  )
}
