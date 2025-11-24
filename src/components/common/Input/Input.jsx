import s from "./Input.module.css";

export default function Input({
  label, error, rightAdornment, className = "", ...props
}) {
  return (
    <div className={s.wrap}>
      {label && <label className={s.label}>{label}</label>}
      <div className={s.box}>
        <input className={[s.input, className].join(" ")} {...props} />
        {rightAdornment && <div className={s.adorn}>{rightAdornment}</div>}
      </div>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
}
