import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

export default function Layout() {
  const sidebarOpen = useUIStore(state => state.sidebarOpen)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main 
          className={cn(
            'flex-1 overflow-auto transition-all duration-300',
            sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'
          )}
        >
          <Outlet />
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => useUIStore.getState().setSidebarOpen(false)}
        />
      )}
    </div>
  )
}