import s from "./DataTable.module.css";

export default function DataTable({ columns, data, emptyText = "Sin resultados…" }) {
  return (
    <div className={s.wrap}>
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
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={s.empty}>
                {emptyText}
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? s.evenRow : s.oddRow}>
              {columns.map((c) => (
                <td
                  key={c.key || c.label}
                  className={c.align === "right" ? s.right : ""}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
