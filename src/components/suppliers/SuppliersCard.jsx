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
      />
      <KPICard
        title="Proveedores Activos"
        value={stats.activos}
        icon={<Icon name="suppliersActives" />}
        variant="teal"
      />
      <KPICard
        title="Proveedores con Categorías"
        value={stats.proveedoresConCategorias}
        icon={<Icon name="category" />}
        variant="pink"
      />
      <KPICard
        title="Total Productos Asociados"
        value={stats.totalProductosAsociados}
        icon={<Icon name="products" />}
        variant="purple"
      />

    </section>
  );
}
