import s from "./Alert.module.css";
export default function Alert({ children }) {
  return <div className={s.alert} role="alert">{children}</div>;
}
