// src/components/reports/ReportCard.jsx

export default function ReportCard({ title, value, subtitle, icon, color = "bg-blue-100", trend }) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className={`mt-2 text-xs font-semibold ${
                trend.type === 'up' ? 'text-green-600' : 
                trend.type === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend.type === 'up' && '↑ '}
                {trend.type === 'down' && '↓ '}
                {trend.value}
              </div>
            )}
          </div>
          <div className={`${color} p-3 rounded-lg`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    );
  }