import { EmptyState } from "@/components/feedback";
import { Loader } from "@/components/ui";
import { classNames } from "@/utils/classNames";
import { USER_MESSAGES } from "@/utils/messages";

export function Table({
  columns = [],
  data = [],
  emptyMessage = USER_MESSAGES.noResults,
  loading = false,
  rowKey = "id",
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border-default bg-surface p-4 shadow-card">
        <Loader variant="skeleton" />
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState description={emptyMessage} title="Sin resultados" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-default">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  className={classNames(
                    "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted",
                    column.className,
                  )}
                  key={column.key}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft bg-surface">
            {data.map((row, rowIndex) => (
              <tr
                className="transition-colors duration-150 hover:bg-slate-50"
                key={row[rowKey] ?? rowIndex}
              >
                {columns.map((column) => (
                  <td
                    className="whitespace-nowrap px-6 py-4 text-sm text-text-body"
                    key={column.key}
                  >
                    {typeof column.render === "function"
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
