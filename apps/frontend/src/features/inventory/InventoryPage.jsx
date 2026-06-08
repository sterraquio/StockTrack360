"use client";

import { useEffect, useMemo, useState } from "react";

import { Pagination, StatusCell, Table } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { FilterToolbar } from "@/components/forms";
import { PageContainer, PageHeader } from "@/components/layout";
import { Badge, Button, Input, SearchInput, Select } from "@/components/ui";
import {
  listInventory,
  listInventoryCategories,
} from "@/services/inventoryService";
import { USER_MESSAGES } from "@/utils/messages";

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  categoryId: "",
  search: "",
  sku: "",
};

export function InventoryPage() {
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: category.name, value: category.id })),
    [categories],
  );

  const columns = useMemo(
    () => [
      {
        header: "Producto",
        key: "name",
        render: (product) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-text-heading">{product.name}</span>
            <span className="font-mono text-xs text-text-muted">{product.sku}</span>
          </div>
        ),
      },
      {
        header: "Categoría",
        key: "category",
        render: (product) => (
          <Badge variant="neutral">{getCategoryName(product)}</Badge>
        ),
      },
      {
        header: "Stock disponible",
        key: "availableStock",
        render: (product) => (
          <StatusCell
            helperText={getStockHelperText(product)}
            variant={getStockVariant(product)}
          >
            {formatStock(product.availableStock)}
          </StatusCell>
        ),
      },
      {
        header: "Stock mínimo",
        key: "minimumStock",
        render: (product) => formatMinimumStock(product.minimumStock),
      },
      {
        header: "Vencimiento",
        key: "expirationDate",
        render: (product) => formatDate(product.expirationDate),
      },
    ],
    [],
  );

  useEffect(() => {
    let isActive = true;

    async function loadInventoryData() {
      setIsLoading(true);
      setLoadError("");
      setCategoriesError("");

      const [inventoryResult, categoriesResult] = await Promise.allSettled([
        listInventory({
          ...filters,
          page: pagination.page,
          pageSize: PAGE_SIZE,
        }),
        listInventoryCategories(),
      ]);

      if (!isActive) {
        return;
      }

      if (inventoryResult.status === "fulfilled") {
        const normalized = normalizeInventoryResponse(inventoryResult.value);

        setInventory(normalized.items);
        setPagination(normalized.pagination);
      } else {
        setInventory([]);
        setLoadError(
          inventoryResult.reason?.message || "No se pudo cargar el inventario.",
        );
      }

      if (categoriesResult.status === "fulfilled") {
        setCategories(normalizeCategoriesResponse(categoriesResult.value));
      } else {
        setCategories([]);
        setCategoriesError(
          categoriesResult.reason?.message || "No se pudieron cargar las categorías.",
        );
      }

      setIsLoading(false);
    }

    loadInventoryData();

    return () => {
      isActive = false;
    };
  }, [filters, pagination.page]);

  function updateFilter(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
    }));
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
    }));
  }

  async function refreshInventory() {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await listInventory({
        ...filters,
        page: pagination.page,
        pageSize: PAGE_SIZE,
      });
      const normalized = normalizeInventoryResponse(data);

      setInventory(normalized.items);
      setPagination(normalized.pagination);
    } catch (error) {
      setInventory([]);
      setLoadError(error.message || "No se pudo cargar el inventario.");
    } finally {
      setIsLoading(false);
    }
  }

  const hasFilters = Boolean(filters.search || filters.sku || filters.categoryId);

  return (
    <PageContainer size="wide">
      <PageHeader
        description="Consulta existencias, stock mínimo y vencimientos desde el catálogo oficial."
        title="Inventario"
      />

      {loadError ? (
        <Alert title="No se pudo cargar" variant="error">
          {loadError}
        </Alert>
      ) : null}

      {categoriesError && !loadError ? (
        <Alert title="Filtro de categorías no disponible" variant="warning">
          {categoriesError}
        </Alert>
      ) : null}

      <FilterToolbar
        actions={
          <Button
            disabled={!hasFilters}
            onClick={clearFilters}
            type="button"
            variant="secondary"
          >
            Limpiar filtros
          </Button>
        }
      >
        <SearchInput
          label="Buscar por nombre"
          onChange={(value) => updateFilter("search", value)}
          placeholder="Nombre del producto..."
          value={filters.search}
        />
        <Input
          label="SKU exacto"
          name="inventory-sku-filter"
          onChange={(event) => updateFilter("sku", event.target.value)}
          placeholder="ARR-500"
          value={filters.sku}
        />
        <Select
          disabled={Boolean(categoriesError)}
          label="Categoría"
          name="inventory-category-filter"
          onChange={(event) => updateFilter("categoryId", event.target.value)}
          options={categoryOptions}
          placeholder="Todas las categorías"
          value={filters.categoryId}
        />
      </FilterToolbar>

      {loadError && !isLoading ? (
        <EmptyState
          action={
            <Button onClick={refreshInventory} type="button" variant="secondary">
              Reintentar
            </Button>
          }
          description="Revisa la conexión con el API Gateway o intenta nuevamente."
          icon="!"
          title="Inventario no disponible"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={inventory}
            emptyMessage={USER_MESSAGES.noResults}
            loading={isLoading}
          />
          {!isLoading && inventory.length > 0 ? (
            <Pagination
              onPageChange={(page) =>
                setPagination((currentPagination) => ({
                  ...currentPagination,
                  page,
                }))
              }
              page={pagination.page}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
            />
          ) : null}
        </>
      )}
    </PageContainer>
  );
}

function normalizeInventoryResponse(data) {
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
        Number(pagination.totalPages) || Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    },
  };
}

function normalizeCategoriesResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.items) ? data.items : [];
}

function getCategoryName(product) {
  return product?.category?.name ?? product?.categoryName ?? "Sin categoría";
}

function getStockVariant(product) {
  const availableStock = Number(product?.availableStock ?? 0);
  const minimumStock = product?.minimumStock;

  if (availableStock <= 0) {
    return "danger";
  }

  if (
    minimumStock !== null &&
    minimumStock !== undefined &&
    availableStock <= Number(minimumStock)
  ) {
    return "warning";
  }

  return "success";
}

function getStockHelperText(product) {
  const availableStock = Number(product?.availableStock ?? 0);

  if (availableStock <= 0) {
    return "Stock crítico";
  }

  if (getStockVariant(product) === "warning") {
    return "Stock bajo";
  }

  return "Stock suficiente";
}

function formatStock(value) {
  return `${Number(value ?? 0)} disponibles`;
}

function formatMinimumStock(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return String(value);
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
