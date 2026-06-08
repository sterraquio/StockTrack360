"use client";

import { useEffect, useMemo, useState } from "react";

import { Pagination, StatusCell, Table } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { PageContainer, PageHeader } from "@/components/layout";
import { Badge, Button } from "@/components/ui";
import {
  listExpiredAlerts,
  listExpiringSoonAlerts,
  listLowStockAlerts,
} from "@/services/alertsService";
import { USER_MESSAGES } from "@/utils/messages";

const PAGE_SIZE = 10;

const ALERT_REQUESTS = {
  expired: (query) => listExpiredAlerts(query),
  expiring7: (query) => listExpiringSoonAlerts({ ...query, days: 7 }),
  expiring30: (query) => listExpiringSoonAlerts({ ...query, days: 30 }),
  lowStock: (query) => listLowStockAlerts(query),
};

const lowStockColumns = [
  {
    header: "Producto",
    key: "name",
    render: (alert) => <ProductCell item={alert} />,
  },
  {
    header: "Categoría",
    key: "categoryName",
    render: (alert) => (
      <Badge variant="neutral">{alert.categoryName || "N/A"}</Badge>
    ),
  },
  {
    header: "Stock disponible",
    key: "availableStock",
    render: (alert) => (
      <StatusCell
        helperText={getLowStockHelperText(alert)}
        variant={Number(alert.availableStock) <= 0 ? "danger" : "warning"}
      >
        {formatUnits(alert.availableStock)}
      </StatusCell>
    ),
  },
  {
    header: "Stock mínimo",
    key: "minimumStock",
    render: (alert) => formatUnits(alert.minimumStock),
  },
  {
    header: "Estado",
    key: "status",
    render: (alert) => (
      <Badge variant={Number(alert.availableStock) <= 0 ? "danger" : "warning"}>
        {Number(alert.availableStock) <= 0 ? "Sin stock" : "Stock bajo"}
      </Badge>
    ),
  },
];

const expirationColumns = [
  {
    header: "Producto",
    key: "name",
    render: (alert) => <ProductCell item={alert} />,
  },
  {
    header: "Categoría",
    key: "categoryName",
    render: (alert) => (
      <Badge variant="neutral">{alert.categoryName || "N/A"}</Badge>
    ),
  },
  {
    header: "Vencimiento",
    key: "expirationDate",
    render: (alert) => formatDate(alert.expirationDate),
  },
  {
    header: "Días",
    key: "daysUntilExpiration",
    render: (alert) => (
      <StatusCell
        helperText={getExpirationHelperText(alert.daysUntilExpiration)}
        variant={Number(alert.daysUntilExpiration) < 0 ? "danger" : "warning"}
      >
        {formatDays(alert.daysUntilExpiration)}
      </StatusCell>
    ),
  },
  {
    header: "Estado",
    key: "status",
    render: (alert) => (
      <Badge
        variant={alert.status === "EXPIRED" ? "danger" : "warning"}
      >
        {alert.status === "EXPIRED" ? "Vencido" : "Próximo a vencer"}
      </Badge>
    ),
  },
];

const alertSections = [
  {
    description: "Productos con existencias iguales o menores al stock mínimo.",
    emptyMessage: "No hay productos con stock bajo.",
    marker: "SB",
    requestKey: "lowStock",
    title: "Stock bajo",
    variant: "danger",
  },
  {
    description: "Productos con fecha de vencimiento anterior a hoy.",
    emptyMessage: "No hay productos vencidos.",
    marker: "VE",
    requestKey: "expired",
    title: "Vencidos",
    variant: "danger",
  },
  {
    description: "Productos que vencen dentro de los próximos 7 días.",
    emptyMessage: "No hay productos próximos a vencer en 7 días.",
    marker: "7D",
    requestKey: "expiring7",
    title: "Próximos 7 días",
    variant: "warning",
  },
  {
    description: "Productos que vencen dentro de los próximos 30 días.",
    emptyMessage: "No hay productos próximos a vencer en 30 días.",
    marker: "30D",
    requestKey: "expiring30",
    title: "Próximos 30 días",
    variant: "warning",
  },
];

export function AlertsPage() {
  return (
    <PageContainer size="wide">
      <PageHeader
        description="Monitorea stock bajo, productos vencidos y próximos vencimientos por rango operativo."
        title="Alertas"
      />

      <div className="space-y-8">
        {alertSections.map((section) => (
          <AlertSection key={section.requestKey} {...section} />
        ))}
      </div>
    </PageContainer>
  );
}

function AlertSection({
  description,
  emptyMessage,
  marker,
  requestKey,
  title,
  variant,
}) {
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => (requestKey === "lowStock" ? lowStockColumns : expirationColumns),
    [requestKey],
  );

  useEffect(() => {
    let isActive = true;

    async function loadAlerts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await ALERT_REQUESTS[requestKey]({
          page,
          pageSize: PAGE_SIZE,
        });
        const normalized = normalizeAlertsResponse(data);

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
        setError(requestError?.message || "No se pudo cargar esta alerta.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      isActive = false;
    };
  }, [page, reloadToken, requestKey]);

  function retryLoad() {
    setReloadToken((currentToken) => currentToken + 1);
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight text-text-heading">
              {title}
            </h2>
            <Badge variant={variant}>{marker}</Badge>
          </div>
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        </div>
        <Badge variant={items.length > 0 ? variant : "neutral"}>
          {isLoading ? "Cargando" : `${pagination.totalItems} registros`}
        </Badge>
      </header>

      {error ? (
        <Alert title={`No se pudo cargar ${title.toLowerCase()}`} variant="error">
          {error}
        </Alert>
      ) : null}

      {error && !isLoading ? (
        <EmptyState
          action={
            <Button onClick={retryLoad} type="button" variant="secondary">
              Reintentar
            </Button>
          }
          description="Esta categoría no está disponible en este momento. Las demás alertas se mantienen visibles."
          icon="!"
          title="Alerta no disponible"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={items}
            emptyMessage={emptyMessage || USER_MESSAGES.noResults}
            loading={isLoading}
            rowKey="productId"
          />

          {!isLoading && items.length > 0 ? (
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
  );
}

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

function normalizeAlertsResponse(data) {
  if (Array.isArray(data)) {
    return {
      items: data,
      pagination: {
        page: 1,
        pageSize: data.length || PAGE_SIZE,
        totalItems: data.length,
        totalPages: 1,
      },
    };
  }

  const items = Array.isArray(data?.items) ? data.items : [];
  const pagination = data?.pagination ?? {};

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

function getLowStockHelperText(alert) {
  const availableStock = Number(alert.availableStock ?? 0);
  const minimumStock = Number(alert.minimumStock ?? 0);

  if (availableStock <= 0) {
    return "Sin unidades disponibles";
  }

  return `Mínimo requerido: ${minimumStock}`;
}

function getExpirationHelperText(daysUntilExpiration) {
  const days = Number(daysUntilExpiration);

  if (!Number.isFinite(days)) {
    return "Fecha por revisar";
  }

  if (days < 0) {
    return "Requiere retiro o revisión";
  }

  if (days === 0) {
    return "Vence hoy";
  }

  return "Revisar rotación";
}

function formatUnits(value) {
  const amount = Number(value ?? 0);

  return `${new Intl.NumberFormat("es-CO").format(amount)} unidades`;
}

function formatDays(value) {
  const days = Number(value);

  if (!Number.isFinite(days)) {
    return "N/A";
  }

  if (days < 0) {
    return `Hace ${Math.abs(days)} días`;
  }

  if (days === 0) {
    return "Hoy";
  }

  return `${days} días`;
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
