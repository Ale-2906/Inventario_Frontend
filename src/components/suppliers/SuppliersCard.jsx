import KPICard from "../../components/common/KPICard/KPICard";
import Icon from "../../components/common/icon";
import s from "../../pages/Suppliers/Suppliers.module.css";

export default function ProductsCard({ stats }) {
  return (
    <section className={s.kpis}>
      <KPICard
        title="Total Proveedores"
        value={stats.total}
        icon={<Icon name="suppliers" />}
        variant="cyan"
        progress={72}
      />
      <KPICard
        title="Proveedores Activos"
        value={stats.activos}
        icon={<Icon name="suppliersActives" />}
        variant="teal"
        progress={54}
      />
      <KPICard
        title="Categorías"
        value={stats.bajo}
        icon={<Icon name="category" />}
        variant="pink"
        progress={30}
      />
      <KPICard
        title="Productos Totales"
        value={stats.agot}
        icon={<Icon name="products" />}
        variant="purple"
        progress={10}
      />
    </section>
  );
}
