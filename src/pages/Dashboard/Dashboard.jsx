import Card from "../../components/common/Card/Card"
import { useAuth } from "../../context/AuthContext";
import s from "./Dashboard.module.css";

export default function Dashboard(){
  const { user } = useAuth();
  return (
    <div className={s.wrap}>
      <Card title={`Bienvenido, ${user?.name || "usuario"} 👋`}>
        <p>Ruta protegida. Este dashboard es solo una demostración de frontend.</p>
      </Card>
    </div>
  );
}
