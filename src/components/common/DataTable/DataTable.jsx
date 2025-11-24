import { useMemo, useState, useEffect } from "react";
import s from "./DataTable.module.css";

/**
 * Props:
 * - columns: [{ key, label, align?, render?, noTruncate?, unconstrained? }]
 * - data: any[]
 * - emptyText?: string
 * - pageSize?: number               // default 6
 * - page?: number                   // si lo pasas, el paginado es controlado
 * - onPageChange?: (p: number) => void
 * - pagination?: boolean            // default true
 */
export default function DataTable({
  columns,
  data,
  emptyText = "Sin resultados…",
  pageSize = 6,
  page: controlledPage,
  onPageChange,
  pagination = true,
}) {
  const [uncontrolledPage, setUncontrolledPage] = useState(1);
  const page = controlledPage ?? uncontrolledPage;

  const total = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  // Corrige la página si cambia la data
  useEffect(() => {
    if (page > totalPages) changePage(totalPages);
    if (page < 1) changePage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  function changePage(p) {
    if (onPageChange) onPageChange(p);
    else setUncontrolledPage(p);
  }

  const pageData = useMemo(() => {
    if (!pagination) return data;
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize, pagination]);

  return (
    <div className={s.wrap}>
      <div className={s.scrollX}>
        <table className={s.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key || c.label} className={c.align === "right" ? s.right : ""}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className={s.empty}>
                  {emptyText}
                </td>
              </tr>
            )}
            {pageData.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? s.evenRow : s.oddRow}>
                {columns.map((c) => {
                  const baseClass = [c.align === "right" ? s.right : "", s.cell].join(" ");
                  // c.noTruncate => respeta flujo normal; c.unconstrained => permite overflow visible (útil para acciones)
                  const cls = [
                    baseClass,
                    c.noTruncate ? s.noTruncate : s.truncate,
                    (c.unconstrained || c.key === "actions") ? s.unconstrained : ""
                  ].join(" ");
                  return (
                    <td key={c.key || c.label} className={cls} title={!c.noTruncate ? undefined : undefined}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className={s.pagerBar}>
          <small className={s.pagerInfo}>
            Mostrando {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} de {total}
          </small>
          <Pager page={page} totalPages={totalPages} onChange={changePage} />
        </div>
      )}
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  const go = (p) => onChange(Math.min(Math.max(1, p), totalPages));
  return (
    <nav className={s.pager} role="navigation" aria-label="Paginación de tabla">
      <button onClick={() => go(1)} disabled={page <= 1} className={s.pagerBtn} aria-label="Primera página">«</button>
      <button onClick={() => go(page - 1)} disabled={page <= 1} className={s.pagerBtn} aria-label="Página anterior">‹</button>
      <PageNumbers page={page} totalPages={totalPages} onChange={go} />
      <button onClick={() => go(page + 1)} disabled={page >= totalPages} className={s.pagerBtn} aria-label="Página siguiente">›</button>
      <button onClick={() => go(totalPages)} disabled={page >= totalPages} className={s.pagerBtn} aria-label="Última página">»</button>
    </nav>
  );
}

function PageNumbers({ page, totalPages, onChange }) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  return (
    <div className={s.pageNums}>
      {list.map((p, idx) => {
        const prev = list[idx - 1];
        const gap = idx > 0 && p - prev > 1;
        return (
          <span key={p} className={s.pageItem}>
            {gap && <span className={s.dots}>…</span>}
            <button
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${s.pagerBtn} ${p === page ? s.active : ""}`}
            >
              {p}
            </button>
          </span>
        );
      })}
    </div>
  );
}
