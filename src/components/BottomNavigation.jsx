import { NavLink } from 'react-router-dom'

const items = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z" />
    ),
  },
  {
    to: '/reservations',
    label: 'Reservations',
    icon: (
      <>
        <path d="M6 3v3M18 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
        <path d="m9 15 2 2 4-5" />
      </>
    ),
  },
]

function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/10 bg-background/95 shadow-[0_-8px_28px_rgba(61,61,61,0.08)] backdrop-blur" aria-label="Primary navigation">
      <div className="mx-auto grid h-20 max-w-md grid-cols-2 px-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `relative flex flex-col items-center justify-center gap-1 text-xs font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-teal ${isActive ? 'text-primary' : 'text-charcoal/75 hover:text-teal'}`}
          >
            {({ isActive }) => (
              <>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  {item.icon}
                </svg>
                <span>{item.label}</span>
                {isActive && <span className="absolute bottom-1 h-1 w-6 rounded-full bg-highlight" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation
