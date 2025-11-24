import KPICard from "../../components/common/KPICard/KPICard";
import Icon from "../../components/common/icon";
import s from "../../pages/Products/Products.module.css"; // si quieres estilos específicos

export default function ProductsCard({ stats }) {
  return (
    <section className={s.kpis}>
      <KPICard
        title="Total Productos"
        value={stats.total}
        icon={<Icon name="products" />}
        variant="cyan"
        progress={72}
      />
      <KPICard
        title="Productos Activos"
        value={stats.activos}
        icon={<Icon name="active" />}
        variant="teal"
        progress={54}
      />
      <KPICard
        title="Stock Bajo"
        value={stats.bajo}
        icon={<Icon name="low" />}
        variant="pink"
        progress={30}
      />
      <KPICard
        title="Agotados"
        value={stats.agot}
        icon={<Icon name="out" />}
        variant="purple"
        progress={10}
      />
    </section>
  );
}
