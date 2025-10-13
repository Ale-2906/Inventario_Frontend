// Iconos basados en tus imágenes de /src/images
import paquete from "../../assets/images/paquete.png";
import enStock from "../../assets/images/en-stock.png";
import inventario from "../../assets/images/inventario.png";
import agotado from "../../assets/images/agotado.png";
import agregar from "../../assets/images/agregar-producto.png"
import proveedor from "../../assets/images/proveedor.png"
import proveedorActivo from "../../assets/images/proveedoresActivos.png"
import categoria from "../../assets/images/categorias.png"

// NUEVAS IMÁGENES PARA REPORTES
import ventas from "../../assets/images/ventas.png";
import dinero from "../../assets/images/dinero.png";
import unidades from "../../assets/images/unidades.png";
import stock from "../../assets/images/stock.png";


export default function Icon({ name, className = "" , alt }) {
  const map = {
    products: paquete,     // total productos
    active: enStock,       // activos
    low: inventario,       // stock bajo
    out: agotado,          // agotados
    add: agregar,
    suppliers: proveedor,
    suppliersActives: proveedorActivo,
    category: categoria,

    // Reportes (NUEVOS)
    sales: ventas,
    money: dinero,
    units: unidades,
    stock: stock,
  };

  const src = map[name] || paquete;
  return <img src={src} alt={alt || name} className={className} />;
}
