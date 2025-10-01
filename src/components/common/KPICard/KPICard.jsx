import s from "./KPICard.module.css";

/**
 * Props:
 *  - title, value
 *  - icon: ReactNode (img/svg)
 *  - subtitle?: string
 *  - progress?: number 0..100
 *  - variant?: "cyan"|"teal"|"pink"|"purple"|"neutral"
 */
export default function KPICard({
  title,
  value,
  icon,
  subtitle,
  progress,
  variant = "neutral",
}) {
  return (
    <div className={`${s.card} ${s[variant]}`}>
      <div className={s.row}>
        <div className={s.textBlock}>
          <div className={s.title}>{title}</div>
          {subtitle && <div className={s.subtitle}>{subtitle}</div>}
        </div>

        {icon && <div className={s.iconWrap}>{icon}</div>}
      </div>

      <div className={s.value}>{value}</div>

      {typeof progress === "number" && (
        <div className={s.progress} role="progressbar"
             aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}
    </div>
  );
}
