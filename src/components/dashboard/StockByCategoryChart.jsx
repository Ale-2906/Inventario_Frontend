import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function StockByCategoryChart({ data }) {
  
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
        No hay datos disponibles
      </div>
    );
  }

  // Transformar datos para el gráfico
  const chartData = data.map(item => ({
    name: item.categoria,
    value: parseInt(item.stock_total) || 0, // ⬅️ Asegurar que sea número
    productos: item.total_productos
  }));


  return (
    <div style={{ width: '100%', height: '400px' }}> {/* ⬅️ Contenedor con altura fija */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              `${value} unidades (${props.payload.productos} productos)`,
              props.payload.name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}