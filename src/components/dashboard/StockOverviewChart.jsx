// src/components/dashboard/StockOverviewChart.jsx
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
  } from 'recharts';
  
  export default function StockOverviewChart({ data }) {
    if (!data || data.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#9ca3af' 
        }}>
          No hay datos disponibles
        </div>
      );
    }
  
    const chartData = data.slice(0, 15).map(item => ({
      nombre: item.nombre.length > 15 
        ? item.nombre.substring(0, 15) + '...' 
        : item.nombre,
      stock_actual: item.stock,
      stock_minimo: item.stock_minimo,
      nivel: item.nivel_stock
    }));
  
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom:10 }} // ⬅️ Aumentado bottom para leyenda
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="nombre" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            label={{ 
              value: 'Cantidad', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#6b7280' }
            }}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            formatter={(value, name) => {
              if (name === 'stock_actual') return [value, 'Stock Actual'];
              if (name === 'stock_minimo') return [value, 'Stock Mínimo'];
              return [value, name];
            }}
          />
          <Legend 
            verticalAlign="bottom" // ⬅️ Posición vertical abajo
            height={36}             // ⬅️ Altura fija para la leyenda
            wrapperStyle={{ 
              paddingTop: '12px',
              bottom: 0             // ⬅️ Fijada al fondo
            }}
            formatter={(value) => {
              if (value === 'stock_actual') return 'Stock Actual';
              if (value === 'stock_minimo') return 'Stock Mínimo';
              return value;
            }}
          />
          <Bar 
            dataKey="stock_actual" 
            fill="#3b82f6" 
            name="stock_actual"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="stock_minimo" 
            fill="#f97316" 
            name="stock_minimo"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }