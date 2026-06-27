import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Camera,
  ImageIcon,
  Edit3,
  History,
  Settings,
  HelpCircle,
  Info,
  Home,
} from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

const navigation = [
  { name: 'Home', href: '/', icon: Home, exact: true },
  { name: 'Camera', href: '/camera', icon: Camera },
  { name: 'Preview', href: '/preview', icon: ImageIcon },
  { name: 'Editor', href: '/editor', icon: Edit3 },
  { name: 'History', href: '/history', icon: History },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'About', href: '/about', icon: Info },
]

interface NavItemProps {
  item: (typeof navigation)[0]
  collapsed: boolean
}

function NavItem({ item, collapsed }: NavItemProps) {
  const location = useLocation()
  // exact match for Home (/), prefix match for everything else
  const isActive = item.exact
    ? location.pathname === item.href
    : location.pathname === item.href

  return (
    <NavLink
      to={item.href}
      end={item.exact}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        'hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isActive
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
          : 'text-muted hover:text-primary',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? item.name : undefined}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.name}
        </motion.span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const sidebarOpen = useUIStore(state => state.sidebarOpen)
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen)
  const navigate = useNavigate()
  const collapsed = !sidebarOpen

  const goHome = () => {
    navigate('/')
    setSidebarOpen(false)
  }

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white border-r border-border fixed left-0 top-0 h-full z-40 shadow-soft"
      >
        <div className="flex-1 flex flex-col gap-5 p-3">
          {/* Logo — click to go home */}
          <button
            onClick={goHome}
            className={cn(
              'flex items-center gap-2.5 px-2 py-3 border-b border-border w-full',
              'hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg',
              collapsed && 'justify-center'
            )}
            aria-label="Go to home"
          >
            <img
              src="/logo.png"
              alt="ClickStudio"
              className={cn(
                'object-contain flex-shrink-0 transition-all',
                collapsed ? 'h-8 w-8' : 'h-10 w-auto max-w-[140px]'
              )}
              onError={e => {
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
                // show fallback sibling
                const fallback = img.nextElementSibling as HTMLElement | null
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            {/* Fallback rendered if logo.png fails */}
            <div
              className={cn(
                'items-center gap-2 hidden',
                collapsed ? 'justify-center' : ''
              )}
            >
              <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30 flex-shrink-0">
                <Camera className="h-4 w-4 text-white" />
              </div>
              {!collapsed && (
                <span className="font-script text-xl text-primary leading-tight">
                  ClickStudio
                </span>
              )}
            </div>
          </button>

          {/* Primary Navigation */}
          <nav className="space-y-0.5">
            {navigation.map(item => (
              <NavItem key={item.name} item={item} collapsed={collapsed} />
            ))}
          </nav>

          {/* Secondary Navigation */}
          <nav className="mt-auto space-y-0.5 border-t border-border pt-3">
            {secondaryNavigation.map(item => (
              <NavItem key={item.name} item={item} collapsed={collapsed} />
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* ── Mobile Sidebar ── */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden fixed left-0 top-0 h-full w-60 bg-white border-r border-border z-40 shadow-card"
      >
        <div className="flex flex-col gap-5 p-3 h-full">
          {/* Logo — click to go home */}
          <button
            onClick={goHome}
            className="flex items-center gap-2.5 px-2 py-3 border-b border-border w-full hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <img
              src="/logo.png"
              alt="ClickStudio"
              className="h-10 w-auto max-w-[140px] object-contain"
              onError={e => {
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
                const fallback = img.nextElementSibling as HTMLElement | null
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            {/* Fallback */}
            <div className="items-center gap-2 hidden">
              <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <span className="font-script text-xl text-primary leading-tight">
                ClickStudio
              </span>
            </div>
          </button>

          {/* Primary Navigation */}
          <nav className="space-y-0.5">
            {navigation.map(item => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted hover:text-primary hover:bg-rose-50'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Secondary Navigation */}
          <nav className="mt-auto space-y-0.5 border-t border-border pt-3">
            {secondaryNavigation.map(item => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted hover:text-primary hover:bg-rose-50'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  )
}
