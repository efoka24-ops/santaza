const COLORS = {
  red: 'bg-red-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-600'
}

const INITIALS = {
  'marie': 'M',
  'pierre': 'P',
  'sophia': 'S',
  'lucas': 'L'
}

export default function Avatar({ name, size = 'md' }) {
  const initial = INITIALS[name?.toLowerCase()] || name?.[0]?.toUpperCase() || '?'
  const colorClass = COLORS[Object.keys(COLORS)[Math.floor(Math.random() * Object.keys(COLORS).length)]]
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-bold`}>
      {initial}
    </div>
  )
}
