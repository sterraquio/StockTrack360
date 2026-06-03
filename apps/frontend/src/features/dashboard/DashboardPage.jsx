"use client";

import { useEffect, useMemo, useState } from "react";

import { KpiCard, StatusCell, Table } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button, Card, Loader } from "@/components/ui";
import { getDashboard } from "@/services/reportsService";
import { USER_MESSAGES } from "@/utils/messages";

const dashboardColumns = [
  { key: "name", header: "Producto" },
  {
    key: "sku",
    header: "SKU",
    render: (row) => <span className="font-mono text-xs">{row.sku}</span>,
  },
  { key: "categoryName", header: "Categoría" },
  {
    key: "value",
    header: "Movimientos",
    render: (row) => (
      <StatusCell helperText={row.label} variant="info">
        {formatNumber(row.value)}
      </StatusCell>
    ),
  },
];

const requiredSummaryFields = [
  "totalProducts",
  "lowStockProducts",
  "expiredProducts",
  "expiringSoonProducts",
  "movementsInPeriod",
  "topMovedProducts",
];

export function DashboardPage() {
  const query = useMemo(() => buildCurrentMonthQuery(), []);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        const response = await getDashboard(query);

        if (isActive) {
          setDashboard(normalizeDashboard(response));
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError?.message ?? USER_MESSAGES.dashboardLoadError);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [query]);

  async function handleRefresh() {
    setIsRefreshing(true);
    setError("");

    try {
      const response = await getDashboard(query);
      setDashboard(normalizeDashboard(response));
    } catch (requestError) {
      setError(requestError?.message ?? USER_MESSAGES.dashboardLoadError);
    } finally {
      setIsRefreshing(false);
    }
  }

  const hasPartialData = dashboard ? hasMissingFields(dashboard.raw) : false;
  const isEmpty = dashboard ? isDashboardEmpty(dashboard) : false;

  return (
    <PageContainer size="wide">
      <PageHeader
        actions={
          <Button
            loading={isRefreshing}
            onClick={handleRefresh}
            type="button"
            variant="secondary"
          >
            Actualizar
          </Button>
        }
        description="Indicadores principales de inventario, alertas y movimientos del periodo actual."
        title="Dashboard"
      />

      {error ? (
        <Alert title="No se pudo cargar el dashboard" variant="error">
          {error}
        </Alert>
      ) : null}

      {hasPartialData ? (
        <Alert title="Información parcial" variant="warning">
          Algunos indicadores no llegaron completos. Se muestran los datos
          disponibles del periodo.
        </Alert>
      ) : null}

      {isLoading ? <DashboardSkeleton /> : null}

      {!isLoading && dashboard ? (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              label="Productos"
              marker="PR"
              value={formatNumber(dashboard.totalProducts)}
              variant="info"
            />
            <KpiCard
              label="Stock bajo"
              marker="SB"
              value={formatNumber(dashboard.lowStockProducts)}
              variant={dashboard.lowStockProducts > 0 ? "danger" : "success"}
            />
            <KpiCard
              label="Vencidos"
              marker="VE"
              value={formatNumber(dashboard.expiredProducts)}
              variant={dashboard.expiredProducts > 0 ? "danger" : "success"}
            />
            <KpiCard
              label="Por vencer"
              marker="PV"
              value={formatNumber(dashboard.expiringSoonProducts)}
              variant={
                dashboard.expiringSoonProducts > 0 ? "warning" : "success"
              }
            />
            <KpiCard
              label="Movimientos"
              marker="MV"
              value={formatNumber(dashboard.movementsInPeriod)}
              variant="neutral"
            />
          </section>

          {isEmpty ? (
            <EmptyState
              description="Cuando existan productos, movimientos o alertas, los indicadores aparecerán en esta pantalla."
              title="Sin actividad para mostrar"
            />
          ) : null}

          <Card
            description="Productos con mayor cantidad de movimientos en el periodo actual."
            title="Productos con mayor movimiento"
          >
            <Table
              columns={dashboardColumns}
              data={dashboard.topMovedProducts}
              emptyMessage="No hay movimientos registrados en el periodo."
            />
          </Card>
        </>
      ) : null}

      {!isLoading && !dashboard && error ? (
        <EmptyState
          action={
            <Button
              loading={isRefreshing}
              onClick={handleRefresh}
              type="button"
            >
              Reintentar
            </Button>
          }
          description="No fue posible consultar los indicadores del periodo en este momento."
          title="Dashboard sin datos"
        />
      ) : null}
    </PageContainer>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} variant="kpi">
            <Loader rows={2} variant="skeleton" />
          </Card>
        ))}
      </div>
      <Card title="Productos con mayor movimiento">
        <Loader rows={4} variant="skeleton" />
      </Card>
    </>
  );
}

function buildCurrentMonthQuery() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    from: formatDateParam(from),
    to: formatDateParam(now),
  };
}

function formatDateParam(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeDashboard(summary = {}) {
  return {
    expiredProducts: toNumber(summary.expiredProducts),
    expiringSoonProducts: toNumber(summary.expiringSoonProducts),
    lowStockProducts: toNumber(summary.lowStockProducts),
    movementsInPeriod: toNumber(summary.movementsInPeriod),
    raw: summary,
    topMovedProducts: Array.isArray(summary.topMovedProducts)
      ? summary.topMovedProducts.map(normalizeReportItem)
      : [],
    totalProducts: toNumber(summary.totalProducts),
  };
}

function normalizeReportItem(item, index) {
  return {
    categoryName: item?.categoryName ?? "N/A",
    id: item?.id ?? item?.productId ?? `top-moved-${index}`,
    label: item?.label ?? "Movimientos",
    name: item?.name ?? "Producto sin nombre",
    sku: item?.sku ?? "N/A",
    value: toNumber(item?.value),
  };
}

function hasMissingFields(summary = {}) {
  return requiredSummaryFields.some((field) => !(field in summary));
}

function isDashboardEmpty(summary) {
  return (
    summary.totalProducts === 0 &&
    summary.lowStockProducts === 0 &&
    summary.expiredProducts === 0 &&
    summary.expiringSoonProducts === 0 &&
    summary.movementsInPeriod === 0 &&
    summary.topMovedProducts.length === 0
  );
}

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-CO").format(toNumber(value));
}
