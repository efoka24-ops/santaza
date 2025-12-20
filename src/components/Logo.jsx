export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Orange officiel */}
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect width="100" height="100" fill="#FF6B35" />
        <text x="50" y="70" fontSize="56" fontWeight="900" fill="white" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-1">
          o
        </text>
      </svg>
      <div>
        <span className="font-bold text-lg text-gray-900">Santaza</span>
      </div>
    </div>
  )
}
