import s from "./Button.module.css";

export default function Button({ variant = "solid", className = "", ...props }) {
  const cls = [s.base, variant === "outline" ? s.outline : s.solid, className]
    .filter(Boolean).join(" ");
  return <button className={cls} {...props} />;
}
