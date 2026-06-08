"use client";

import { useEffect, useMemo, useState } from "react";

import { KpiCard, Pagination, StatusCell, Table } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { FilterToolbar } from "@/components/forms";
import { PageContainer, PageHeader } from "@/components/layout";
import { Badge, Button, Input, Select } from "@/components/ui";
import {
  getExpiringProductsReport,
  getLowStockReport,
  getMovementsByPeriodReport,
  getTopExitsReport,
} from "@/services/reportsService";
import { USER_MESSAGES } from "@/utils/messages";

const PAGE_SIZE = 10;

const REPORT_TYPES = {
  EXPIRING_PRODUCTS: "expiringProducts",
  LOW_STOCK: "lowStock",
  MOVEMENTS_BY_PERIOD: "movementsByPeriod",
  TOP_EXITS: "topExits",
};

const REPORT_OPTIONS = [
  { label: "Stock bajo", value: REPORT_TYPES.LOW_STOCK },
  { label: "Vencimientos", value: REPORT_TYPES.EXPIRING_PRODUCTS },
  { label: "Productos con más salidas", value: REPORT_TYPES.TOP_EXITS },
  { label: "Movimientos por periodo", value: REPORT_TYPES.MOVEMENTS_BY_PERIOD },
];

const DAYS_OPTIONS = [
  { label: "Próximos 7 días", value: "7" },
  { label: "Próximos 30 días", value: "30" },
];

const GROUP_BY_OPTIONS = [
  { label: "Día", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
];

const reportConfig = {
  [REPORT_TYPES.LOW_STOCK]: {
    description: "Productos con existencias iguales o menores al stock mínimo.",
    marker: "SB",
    title: "Reporte de stock bajo",
    variant: "danger",
  },
  [REPORT_TYPES.EXPIRING_PRODUCTS]: {
    description: "Productos próximos a vencer según el rango seleccionado.",
    marker: "VE",
    title: "Reporte de vencimientos",
    variant: "warning",
  },
  [REPORT_TYPES.TOP_EXITS]: {
    description: "Ranking de productos con mayor cantidad de salidas.",
    marker: "MS",
    title: "Productos con más salidas",
    variant: "info",
  },
  [REPORT_TYPES.MOVEMENTS_BY_PERIOD]: {
    description: "Entradas y salidas agrupadas por día, semana o mes.",
    marker: "MP",
    title: "Movimientos por periodo",
    variant: "neutral",
  },
};

export function ReportsPage() {
  const defaultFilters = useMemo(() => buildDefaultFilters(), []);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [reloadToken, setReloadToken] = useState(0);
  const [reportType, setReportType] = useState(REPORT_TYPES.LOW_STOCK);

  const activeConfig = reportConfig[reportType];
  const columns = useMemo(() => getColumns(reportType), [reportType]);
  const needsPagination =
    reportType === REPORT_TYPES.LOW_STOCK ||
    reportType === REPORT_TYPES.EXPIRING_PRODUCTS;
  const needsDateRange =
    reportType === REPORT_TYPES.TOP_EXITS ||
    reportType === REPORT_TYPES.MOVEMENTS_BY_PERIOD;
  const hasCustomFilters = hasChangedFilters(filters, defaultFilters);

  useEffect(() => {
    let isActive = true;

    async function loadReport() {
      setIsLoading(true);
      setError("");

      if (needsDateRange && !isValidDateRange(filters.from, filters.to)) {
        setItems([]);
        setPagination({
          page: 1,
          pageSize: PAGE_SIZE,
          totalItems: 0,
          totalPages: 1,
        });
        setError("El rango de fechas no es válido.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await requestReport(reportType, filters, page);
        const normalized = normalizeReportResponse(response, needsPagination);

        if (!isActive) {
          return;
        }

        setItems(normalized.items);
        setPagination(normalized.pagination);
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setItems([]);
        setPagination({
          page,
          pageSize: PAGE_SIZE,
          totalItems: 0,
          totalPages: 1,
        });
        setError(requestError?.message || "No se pudo cargar el reporte.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      isActive = false;
    };
  }, [filters, needsDateRange, needsPagination, page, reloadToken, reportType]);

  function updateReportType(value) {
    setReportType(value || REPORT_TYPES.LOW_STOCK);
    setPage(1);
    setError("");
  }

  function updateFilter(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
    setPage(1);
    setError("");
  }

  function clearFilters() {
    setFilters(defaultFilters);
    setPage(1);
    setError("");
  }

  function refreshReport() {
    setReloadToken((currentToken) => currentToken + 1);
  }

  const summary = buildSummary(reportType, items, pagination);

  return (
    <PageContainer size="wide">
      <PageHeader
        actions={
          <Button
            loading={isLoading}
            onClick={refreshReport}
            type="button"
            variant="secondary"
          >
            Consultar
          </Button>
        }
        description="Consulta reportes básicos de inventario según los contratos oficiales del API Gateway."
        title="Reportes"
      />

      {error ? (
        <Alert title="No se pudo cargar el reporte" variant="error">
          {error}
        </Alert>
      ) : null}

      <FilterToolbar
        actions={
          <Button
            disabled={!hasCustomFilters}
            onClick={clearFilters}
            type="button"
            variant="secondary"
          >
            Limpiar filtros
          </Button>
        }
      >
        <Select
          label="Tipo de reporte"
          name="report-type"
          onChange={(event) => updateReportType(event.target.value)}
          options={REPORT_OPTIONS}
          placeholder="Selecciona un reporte"
          value={reportType}
        />

        {reportType === REPORT_TYPES.EXPIRING_PRODUCTS ? (
          <Select
            label="Rango de vencimiento"
            name="report-days"
            onChange={(event) => updateFilter("days", event.target.value || "30")}
            options={DAYS_OPTIONS}
            placeholder="Selecciona un rango"
            value={filters.days}
          />
        ) : null}

        {needsDateRange ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-1">
            <Input
              label="Desde"
              name="report-from"
              onChange={(event) => updateFilter("from", event.target.value)}
              type="date"
              value={filters.from}
            />
            <Input
              label="Hasta"
              name="report-to"
              onChange={(event) => updateFilter("to", event.target.value)}
              type="date"
              value={filters.to}
            />
          </div>
        ) : null}

        {reportType === REPORT_TYPES.TOP_EXITS ? (
          <Input
            label="Límite"
            max="50"
            min="1"
            name="report-limit"
            onChange={(event) => updateFilter("limit", event.target.value)}
            placeholder="10"
            type="number"
            value={filters.limit}
          />
        ) : null}

        {reportType === REPORT_TYPES.MOVEMENTS_BY_PERIOD ? (
          <Select
            label="Agrupar por"
            name="report-group-by"
            onChange={(event) => updateFilter("groupBy", event.target.value || "day")}
            options={GROUP_BY_OPTIONS}
            placeholder="Selecciona agrupación"
            value={filters.groupBy}
          />
        ) : null}
      </FilterToolbar>

      <section className="grid gap-6 md:grid-cols-3">
        {summary.map((item) => (
          <KpiCard
            helperText={item.helperText}
            key={item.label}
            label={item.label}
            marker={item.marker}
            value={item.value}
            variant={item.variant}
          />
        ))}
      </section>

      <section className="space-y-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight text-text-heading">
                {activeConfig.title}
              </h2>
              <Badge variant={activeConfig.variant}>{activeConfig.marker}</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              {activeConfig.description}
            </p>
          </div>
          <Badge variant={items.length > 0 ? activeConfig.variant : "neutral"}>
            {isLoading ? "Cargando" : `${getTotalItems(items, pagination)} registros`}
          </Badge>
        </header>

        {error && !isLoading ? (
          <EmptyState
            action={
              <Button onClick={refreshReport} type="button" variant="secondary">
                Reintentar
              </Button>
            }
            description="Revisa los filtros o intenta consultar nuevamente."
            icon="!"
            title="Reporte no disponible"
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={items}
              emptyMessage={getEmptyMessage(reportType)}
              loading={isLoading}
              rowKey={getRowKey(reportType)}
            />
            {!isLoading && needsPagination && items.length > 0 ? (
              <Pagination
                onPageChange={setPage}
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
              />
            ) : null}
          </>
        )}
      </section>
    </PageContainer>
  );
}

function requestReport(reportType, filters, page) {
  if (reportType === REPORT_TYPES.LOW_STOCK) {
    return getLowStockReport({ page, pageSize: PAGE_SIZE });
  }

  if (reportType === REPORT_TYPES.EXPIRING_PRODUCTS) {
    return getExpiringProductsReport({
      days: Number(filters.days) || 30,
      page,
      pageSize: PAGE_SIZE,
    });
  }

  if (reportType === REPORT_TYPES.TOP_EXITS) {
    return getTopExitsReport({
      from: filters.from,
      limit: clampLimit(filters.limit),
      to: filters.to,
    });
  }

  return getMovementsByPeriodReport({
    from: filters.from,
    groupBy: filters.groupBy || "day",
    to: filters.to,
  });
}

function getColumns(reportType) {
  if (reportType === REPORT_TYPES.LOW_STOCK) {
    return lowStockColumns;
  }

  if (reportType === REPORT_TYPES.EXPIRING_PRODUCTS) {
    return expirationColumns;
  }

  if (reportType === REPORT_TYPES.TOP_EXITS) {
    return topExitsColumns;
  }

  return movementsByPeriodColumns;
}

const lowStockColumns = [
  {
    header: "Producto",
    key: "name",
    render: (item) => <ProductCell item={item} />,
  },
  {
    header: "Categoría",
    key: "categoryName",
    render: (item) => <Badge variant="neutral">{item.categoryName || "N/A"}</Badge>,
  },
  {
    header: "Stock disponible",
    key: "availableStock",
    render: (item) => (
      <StatusCell
        helperText={`Mínimo: ${formatNumber(item.minimumStock)}`}
        variant={Number(item.availableStock) <= 0 ? "danger" : "warning"}
      >
        {formatNumber(item.availableStock)}
      </StatusCell>
    ),
  },
  {
    header: "Stock mínimo",
    key: "minimumStock",
    render: (item) => formatNumber(item.minimumStock),
  },
];

const expirationColumns = [
  {
    header: "Producto",
    key: "name",
    render: (item) => <ProductCell item={item} />,
  },
  {
    header: "Categoría",
    key: "categoryName",
    render: (item) => <Badge variant="neutral">{item.categoryName || "N/A"}</Badge>,
  },
  {
    header: "Vencimiento",
    key: "expirationDate",
    render: (item) => formatDate(item.expirationDate),
  },
  {
    header: "Días",
    key: "daysUntilExpiration",
    render: (item) => (
      <StatusCell helperText="Próximo vencimiento" variant="warning">
        {formatDays(item.daysUntilExpiration)}
      </StatusCell>
    ),
  },
];

const topExitsColumns = [
  {
    header: "Producto",
    key: "name",
    render: (item) => <ProductCell item={item} />,
  },
  {
    header: "Categoría",
    key: "categoryName",
    render: (item) => <Badge variant="neutral">{item.categoryName || "N/A"}</Badge>,
  },
  {
    header: "Salidas",
    key: "value",
    render: (item) => (
      <StatusCell helperText={item.label || "Salidas"} variant="danger">
        {formatNumber(item.value)}
      </StatusCell>
    ),
  },
];

const movementsByPeriodColumns = [
  {
    header: "Periodo",
    key: "period",
    render: (item) => <span className="font-mono text-xs">{item.period || "N/A"}</span>,
  },
  {
    header: "Entradas",
    key: "entries",
    render: (item) => (
      <StatusCell helperText="Unidades ingresadas" variant="success">
        {formatNumber(item.entries)}
      </StatusCell>
    ),
  },
  {
    header: "Salidas",
    key: "exits",
    render: (item) => (
      <StatusCell helperText="Unidades retiradas" variant="danger">
        {formatNumber(item.exits)}
      </StatusCell>
    ),
  },
  {
    header: "Balance",
    key: "balance",
    render: (item) => {
      const balance = Number(item.entries ?? 0) - Number(item.exits ?? 0);

      return (
        <StatusCell
          helperText="Entradas menos salidas"
          variant={balance < 0 ? "danger" : balance > 0 ? "success" : "neutral"}
        >
          {formatNumber(balance)}
        </StatusCell>
      );
    },
  },
];

function ProductCell({ item }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-text-heading">
        {item.name || "Producto sin nombre"}
      </span>
      <span className="font-mono text-xs text-text-muted">
        {item.sku || "N/A"}
      </span>
    </div>
  );
}

function normalizeReportResponse(data, isPaginated) {
  if (Array.isArray(data)) {
    return buildNormalizedResponse(data, isPaginated);
  }

  const items = Array.isArray(data?.items) ? data.items : [];
  const pagination = data?.pagination ?? {};

  if (!isPaginated) {
    return buildNormalizedResponse(items, false);
  }

  return {
    items,
    pagination: {
      page: Number(pagination.page) || 1,
      pageSize: Number(pagination.pageSize) || PAGE_SIZE,
      totalItems: Number(pagination.totalItems) || items.length,
      totalPages:
        Number(pagination.totalPages) ||
        Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    },
  };
}

function buildNormalizedResponse(items, isPaginated) {
  return {
    items,
    pagination: {
      page: 1,
      pageSize: isPaginated ? PAGE_SIZE : items.length || PAGE_SIZE,
      totalItems: items.length,
      totalPages: 1,
    },
  };
}

function buildSummary(reportType, items, pagination) {
  const totalItems = getTotalItems(items, pagination);

  if (reportType === REPORT_TYPES.LOW_STOCK) {
    return [
      buildSummaryCard("Productos afectados", totalItems, "SB", "danger"),
      buildSummaryCard(
        "Stock disponible",
        sumBy(items, "availableStock"),
        "SD",
        "warning",
      ),
      buildSummaryCard("Stock mínimo", sumBy(items, "minimumStock"), "SM", "neutral"),
    ];
  }

  if (reportType === REPORT_TYPES.EXPIRING_PRODUCTS) {
    return [
      buildSummaryCard("Productos reportados", totalItems, "VE", "warning"),
      buildSummaryCard(
        "Vencen hoy",
        items.filter((item) => Number(item.daysUntilExpiration) === 0).length,
        "HOY",
        "danger",
      ),
      buildSummaryCard(
        "Menor plazo",
        getMinimumDays(items),
        "DÍAS",
        "warning",
        "Días hasta el vencimiento más cercano",
      ),
    ];
  }

  if (reportType === REPORT_TYPES.TOP_EXITS) {
    return [
      buildSummaryCard("Productos listados", items.length, "PR", "info"),
      buildSummaryCard("Salidas totales", sumBy(items, "value"), "SA", "danger"),
      buildSummaryCard(
        "Mayor salida",
        Math.max(0, ...items.map((item) => Number(item.value ?? 0))),
        "TOP",
        "warning",
      ),
    ];
  }

  return [
    buildSummaryCard("Periodos", items.length, "PE", "neutral"),
    buildSummaryCard("Entradas", sumBy(items, "entries"), "EN", "success"),
    buildSummaryCard("Salidas", sumBy(items, "exits"), "SA", "danger"),
  ];
}

function buildSummaryCard(label, value, marker, variant, helperText) {
  return {
    helperText,
    label,
    marker,
    value: typeof value === "string" ? value : formatNumber(value),
    variant,
  };
}

function getTotalItems(items, pagination) {
  return Number(pagination?.totalItems) || items.length;
}

function getEmptyMessage(reportType) {
  if (reportType === REPORT_TYPES.LOW_STOCK) {
    return "No hay productos con stock bajo.";
  }

  if (reportType === REPORT_TYPES.EXPIRING_PRODUCTS) {
    return "No hay productos próximos a vencer en el rango seleccionado.";
  }

  if (reportType === REPORT_TYPES.TOP_EXITS) {
    return "No hay salidas registradas para el periodo seleccionado.";
  }

  return USER_MESSAGES.noResults;
}

function getRowKey(reportType) {
  if (reportType === REPORT_TYPES.MOVEMENTS_BY_PERIOD) {
    return "period";
  }

  if (reportType === REPORT_TYPES.TOP_EXITS) {
    return "productId";
  }

  return "productId";
}

function buildDefaultFilters() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    days: "30",
    from: formatDateParam(firstDay),
    groupBy: "day",
    limit: "10",
    to: formatDateParam(now),
  };
}

function hasChangedFilters(filters, defaultFilters) {
  return Object.keys(defaultFilters).some(
    (key) => filters[key] !== defaultFilters[key],
  );
}

function isValidDateRange(from, to) {
  return !from || !to || from <= to;
}

function clampLimit(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 10;
  }

  return Math.min(Math.max(Math.trunc(numberValue), 1), 50);
}

function sumBy(items, key) {
  return items.reduce((total, item) => total + Number(item[key] ?? 0), 0);
}

function getMinimumDays(items) {
  const values = items
    .map((item) => Number(item.daysUntilExpiration))
    .filter((value) => Number.isFinite(value));

  if (!values.length) {
    return "N/A";
  }

  return Math.min(...values);
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateParam(date) {
  return date.toISOString().slice(0, 10);
}

function formatDays(value) {
  const days = Number(value);

  if (!Number.isFinite(days)) {
    return "N/A";
  }

  if (days === 0) {
    return "Hoy";
  }

  return `${days} días`;
}

function formatNumber(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "0";
  }

  return new Intl.NumberFormat("es-CO").format(numberValue);
}
