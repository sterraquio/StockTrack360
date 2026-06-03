"use client";

import { useEffect, useMemo, useState } from "react";

import { Pagination, Table } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { FieldGroup, FilterToolbar } from "@/components/forms";
import { PageContainer, PageHeader } from "@/components/layout";
import { Badge, Button, Input, Modal, Select } from "@/components/ui";
import { listInventory } from "@/services/inventoryService";
import {
  createEntry,
  createExit,
  listMovements,
} from "@/services/movementsService";
import { USER_MESSAGES } from "@/utils/messages";

const PAGE_SIZE = 10;
const PRODUCT_SELECTOR_PAGE_SIZE = 100;

const MOVEMENT_TYPES = {
  ENTRADA: "ENTRADA",
  SALIDA: "SALIDA",
};

const INITIAL_FILTERS = {
  from: "",
  productId: "",
  to: "",
  type: "",
};

const INITIAL_FORM = {
  productId: "",
  quantity: "",
};

export function MovementsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [formError, setFormError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [modalType, setModalType] = useState(null);
  const [movements, setMovements] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: `${product.name} (${product.sku})`,
        value: product.id,
      })),
    [products],
  );

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === formValues.productId),
    [formValues.productId, products],
  );

  const columns = useMemo(
    () => [
      {
        header: "Fecha y hora",
        key: "createdAt",
        render: (movement) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-text-heading">
              {formatDate(movement.createdAt)}
            </span>
            <span className="text-xs text-text-muted">
              {formatTime(movement.createdAt)}
            </span>
          </div>
        ),
      },
      {
        header: "Producto",
        key: "productName",
        render: (movement) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-text-heading">
              {movement.productName ?? "Producto no disponible"}
            </span>
            <span className="font-mono text-xs text-text-muted">
              {movement.sku ?? "N/A"}
            </span>
          </div>
        ),
      },
      {
        header: "Tipo",
        key: "type",
        render: (movement) => (
          <Badge variant={getMovementVariant(movement.type)}>
            {formatMovementType(movement.type)}
          </Badge>
        ),
      },
      {
        header: "Cantidad",
        key: "quantity",
        render: (movement) => (
          <span className="font-semibold text-text-heading">
            {Number(movement.quantity ?? 0)}
          </span>
        ),
      },
      {
        header: "Usuario responsable",
        key: "userName",
        render: (movement) => movement.userName ?? "N/A",
      },
    ],
    [],
  );

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError("");
      setProductsError("");

      const [movementsResult, productsResult] = await Promise.allSettled([
        listMovements({
          ...filters,
          page: pagination.page,
          pageSize: PAGE_SIZE,
        }),
        listInventory({
          page: 1,
          pageSize: PRODUCT_SELECTOR_PAGE_SIZE,
        }),
      ]);

      if (!isActive) {
        return;
      }

      if (movementsResult.status === "fulfilled") {
        const normalized = normalizePaginatedResponse(movementsResult.value);

        setMovements(normalized.items);
        setPagination(normalized.pagination);
      } else {
        setMovements([]);
        setLoadError(
          movementsResult.reason?.message || "No se pudo cargar el historial.",
        );
      }

      if (productsResult.status === "fulfilled") {
        setProducts(normalizeProductsResponse(productsResult.value));
      } else {
        setProducts([]);
        setProductsError(
          productsResult.reason?.message || "No se pudieron cargar los productos.",
        );
      }

      setIsLoading(false);
    }

    loadData();

    return () => {
      isActive = false;
    };
  }, [filters, pagination.page]);

  function updateFilter(name, value) {
    setSuccessMessage("");
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
    setSuccessMessage("");
    setFilters(INITIAL_FILTERS);
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
    }));
  }

  function openMovementModal(type) {
    setFormError("");
    setFormErrors({});
    setFormValues(INITIAL_FORM);
    setModalType(type);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setModalType(null);
    setFormError("");
    setFormErrors({});
  }

  function updateFormValue(name, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const validationErrors = validateMovementForm(formValues, modalType, selectedProduct);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError(USER_MESSAGES.requiredFields);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        productId: formValues.productId,
        quantity: Number(formValues.quantity),
      };

      if (modalType === MOVEMENT_TYPES.ENTRADA) {
        await createEntry(payload);
        setSuccessMessage("Entrada registrada correctamente.");
      } else {
        await createExit(payload);
        setSuccessMessage("Salida registrada correctamente.");
      }

      setModalType(null);
      setFormValues(INITIAL_FORM);
      await refreshData();
    } catch (error) {
      setFormError(error.message || USER_MESSAGES.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function refreshData() {
    setIsLoading(true);
    setLoadError("");
    setProductsError("");

    const [movementsResult, productsResult] = await Promise.allSettled([
      listMovements({
        ...filters,
        page: pagination.page,
        pageSize: PAGE_SIZE,
      }),
      listInventory({
        page: 1,
        pageSize: PRODUCT_SELECTOR_PAGE_SIZE,
      }),
    ]);

    if (movementsResult.status === "fulfilled") {
      const normalized = normalizePaginatedResponse(movementsResult.value);

      setMovements(normalized.items);
      setPagination(normalized.pagination);
    } else {
      setMovements([]);
      setLoadError(
        movementsResult.reason?.message || "No se pudo cargar el historial.",
      );
    }

    if (productsResult.status === "fulfilled") {
      setProducts(normalizeProductsResponse(productsResult.value));
    } else {
      setProducts([]);
      setProductsError(
        productsResult.reason?.message || "No se pudieron cargar los productos.",
      );
    }

    setIsLoading(false);
  }

  const hasFilters = Boolean(filters.productId || filters.type || filters.from || filters.to);
  const isEntryModalOpen = modalType === MOVEMENT_TYPES.ENTRADA;
  const isExitModalOpen = modalType === MOVEMENT_TYPES.SALIDA;
  const isMovementModalOpen = isEntryModalOpen || isExitModalOpen;
  const modalTitle = isEntryModalOpen ? "Registrar entrada" : "Registrar salida";
  const modalDescription = isEntryModalOpen
    ? "Aumenta el stock disponible del producto seleccionado."
    : "Descuenta unidades del stock disponible del producto seleccionado.";

  return (
    <PageContainer size="wide">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={Boolean(productsError)}
              onClick={() => openMovementModal(MOVEMENT_TYPES.ENTRADA)}
              type="button"
              variant="secondary"
            >
              Registrar entrada
            </Button>
            <Button
              disabled={Boolean(productsError)}
              onClick={() => openMovementModal(MOVEMENT_TYPES.SALIDA)}
              type="button"
              variant="danger"
            >
              Registrar salida
            </Button>
          </div>
        }
        description="Registra entradas y salidas, y consulta el historial más reciente."
        title="Movimientos de inventario"
      />

      {successMessage ? (
        <Alert title="Operación completada" variant="success">
          {successMessage}
        </Alert>
      ) : null}

      {loadError ? (
        <Alert title="No se pudo cargar" variant="error">
          {loadError}
        </Alert>
      ) : null}

      {productsError ? (
        <Alert title="Productos no disponibles" variant="warning">
          {productsError}
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
        className="lg:items-end"
      >
        <Select
          disabled={Boolean(productsError)}
          label="Producto"
          name="movement-product-filter"
          onChange={(event) => updateFilter("productId", event.target.value)}
          options={productOptions}
          placeholder="Todos los productos"
          value={filters.productId}
        />
        <Select
          label="Tipo"
          name="movement-type-filter"
          onChange={(event) => updateFilter("type", event.target.value)}
          options={[
            { label: "Entradas", value: MOVEMENT_TYPES.ENTRADA },
            { label: "Salidas", value: MOVEMENT_TYPES.SALIDA },
          ]}
          placeholder="Todos los tipos"
          value={filters.type}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-1">
          <Input
            label="Desde"
            name="movement-from-filter"
            onChange={(event) => updateFilter("from", event.target.value)}
            type="date"
            value={filters.from}
          />
          <Input
            label="Hasta"
            name="movement-to-filter"
            onChange={(event) => updateFilter("to", event.target.value)}
            type="date"
            value={filters.to}
          />
        </div>
      </FilterToolbar>

      {loadError && !isLoading ? (
        <EmptyState
          action={
            <Button onClick={refreshData} type="button" variant="secondary">
              Reintentar
            </Button>
          }
          description="Revisa la conexión con el API Gateway o intenta nuevamente."
          icon="!"
          title="Historial no disponible"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={movements}
            emptyMessage={USER_MESSAGES.noResults}
            loading={isLoading}
          />
          {!isLoading && movements.length > 0 ? (
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

      <Modal
        description={modalDescription}
        footer={
          <>
            <Button disabled={isSaving} onClick={closeModal} variant="secondary">
              Cancelar
            </Button>
            <Button form="movement-form" loading={isSaving} type="submit">
              Guardar
            </Button>
          </>
        }
        onOpenChange={closeModal}
        open={isMovementModalOpen}
        title={modalTitle}
      >
        <form className="space-y-5" id="movement-form" onSubmit={handleSubmit}>
          {formError ? (
            <Alert title="No se pudo guardar" variant="error">
              {formError}
            </Alert>
          ) : null}

          <FieldGroup columns={1}>
            <Select
              error={formErrors.productId}
              label="Producto"
              name="movement-product"
              onChange={(event) => updateFormValue("productId", event.target.value)}
              options={productOptions}
              placeholder="Selecciona un producto"
              value={formValues.productId}
            />
            {selectedProduct ? (
              <div className="rounded-lg border border-border-default bg-slate-50 px-4 py-3 text-sm text-text-body">
                <span className="font-semibold text-text-heading">
                  Stock disponible:
                </span>{" "}
                {Number(selectedProduct.availableStock ?? 0)}
              </div>
            ) : null}
            <Input
              error={formErrors.quantity}
              label="Cantidad"
              min="1"
              name="movement-quantity"
              onChange={(event) => updateFormValue("quantity", event.target.value)}
              placeholder="10"
              type="number"
              value={formValues.quantity}
            />
          </FieldGroup>
        </form>
      </Modal>
    </PageContainer>
  );
}

function normalizePaginatedResponse(data) {
  if (Array.isArray(data)) {
    return {
      items: sortMovements(data),
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
    items: sortMovements(items),
    pagination: {
      page: Number(pagination.page) || 1,
      pageSize: Number(pagination.pageSize) || PAGE_SIZE,
      totalItems: Number(pagination.totalItems) || items.length,
      totalPages:
        Number(pagination.totalPages) || Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    },
  };
}

function normalizeProductsResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.items) ? data.items : [];
}

function sortMovements(items) {
  return [...items].sort((left, right) =>
    String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? "")),
  );
}

function validateMovementForm(values, type, selectedProduct) {
  const errors = {};
  const quantity = Number(values.quantity);

  if (!values.productId) {
    errors.productId = "Selecciona un producto.";
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.quantity = "La cantidad debe ser un entero mayor a 0.";
  }

  if (
    type === MOVEMENT_TYPES.SALIDA &&
    selectedProduct &&
    Number.isInteger(quantity) &&
    quantity > Number(selectedProduct.availableStock ?? 0)
  ) {
    errors.quantity = "La salida no puede superar el stock disponible.";
  }

  return errors;
}

function getMovementVariant(type) {
  return type === MOVEMENT_TYPES.ENTRADA ? "success" : "danger";
}

function formatMovementType(type) {
  return type === MOVEMENT_TYPES.ENTRADA ? "Entrada" : "Salida";
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
