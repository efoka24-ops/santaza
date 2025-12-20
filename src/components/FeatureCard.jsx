export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="text-center p-6">
      <div className="flex justify-center mb-4">
        <Icon size={40} className="text-red-600" />
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
