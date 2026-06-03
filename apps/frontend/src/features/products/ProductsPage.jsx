"use client";

import { useEffect, useMemo, useState } from "react";

import { Pagination, StatusCell, Table } from "@/components/data-display";
import { Alert, ConfirmDialog, EmptyState } from "@/components/feedback";
import { FilterToolbar } from "@/components/forms";
import { PageContainer, PageHeader } from "@/components/layout";
import { Badge, Button, Input, Modal, SearchInput, Select } from "@/components/ui";
import { useAuthSession } from "@/features/auth/AuthSessionContext";
import {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  updateProduct,
} from "@/services/productsService";
import { USER_MESSAGES } from "@/utils/messages";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  categoryId: "",
  search: "",
  sku: "",
};

const INITIAL_FORM = {
  categoryId: "",
  expirationDate: "",
  minimumStock: "",
  name: "",
  sku: "",
};

export function ProductsPage() {
  const { role } = useAuthSession();
  const canManageProducts = hasPermission(role, PERMISSIONS.MANAGE_PRODUCTS);
  const canDeleteProducts = hasPermission(role, PERMISSIONS.DELETE_PRODUCTS);

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [formError, setFormError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: category.name, value: category.id })),
    [categories],
  );

  const columns = useMemo(() => {
    const baseColumns = [
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
        header: "Stock",
        key: "availableStock",
        render: (product) => (
          <StatusCell
            helperText={`Mínimo: ${formatMinimumStock(product.minimumStock)}`}
            variant={getStockVariant(product)}
          >
            {formatStock(product.availableStock)}
          </StatusCell>
        ),
      },
      {
        header: "Vencimiento",
        key: "expirationDate",
        render: (product) => formatDate(product.expirationDate),
      },
    ];

    if (canManageProducts || canDeleteProducts) {
      baseColumns.push({
        className: "text-right",
        header: "Acciones",
        key: "actions",
        render: (product) => (
          <div className="flex justify-end gap-2">
            {canManageProducts ? (
              <Button onClick={() => openEditModal(product)} size="sm" variant="secondary">
                Editar
              </Button>
            ) : null}
            {canDeleteProducts ? (
              <Button
                disabled={!canDeleteProduct(product)}
                onClick={() => openDeleteDialog(product)}
                size="sm"
                variant="danger"
              >
                Eliminar
              </Button>
            ) : null}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [canDeleteProducts, canManageProducts]);

  useEffect(() => {
    let isActive = true;

    async function loadInitialData() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [productsData, categoriesData] = await Promise.all([
          listProducts({
            ...filters,
            page: pagination.page,
            pageSize: PAGE_SIZE,
          }),
          listCategories(),
        ]);
        const normalizedProducts = normalizeProductsResponse(productsData);
        const normalizedCategories = normalizeCategoriesResponse(categoriesData);

        if (isActive) {
          setProducts(normalizedProducts.items);
          setPagination(normalizedProducts.pagination);
          setCategories(normalizedCategories);
        }
      } catch (error) {
        if (isActive) {
          setProducts([]);
          setLoadError(error.message || "No se pudieron cargar los productos.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

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

  function openCreateModal() {
    setSelectedProduct(null);
    setFormValues(INITIAL_FORM);
    setFormErrors({});
    setFormError("");
    setModalMode("create");
  }

  function openEditModal(product) {
    setSelectedProduct(product);
    setFormValues({
      categoryId: product.category?.id ?? "",
      expirationDate: product.expirationDate ?? "",
      minimumStock:
        product.minimumStock === null || product.minimumStock === undefined
          ? ""
          : String(product.minimumStock),
      name: product.name ?? "",
      sku: product.sku ?? "",
    });
    setFormErrors({});
    setFormError("");
    setModalMode("edit");
  }

  function openDeleteDialog(product) {
    if (!canDeleteProduct(product)) {
      return;
    }

    setSelectedProduct(product);
    setFormError("");
    setModalMode("delete");
  }

  function closeModal() {
    if (isSaving || isDeleting) {
      return;
    }

    setModalMode(null);
    setSelectedProduct(null);
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

    const validationErrors = validateProductForm(formValues, modalMode);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError(USER_MESSAGES.requiredFields);
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildProductPayload(formValues);

      if (modalMode === "create") {
        await createProduct({
          ...payload,
          sku: formValues.sku.trim().toUpperCase(),
        });
        setSuccessMessage(USER_MESSAGES.productCreated);
      } else {
        await updateProduct(selectedProduct.id, payload);
        setSuccessMessage(USER_MESSAGES.productUpdated);
      }

      setModalMode(null);
      setSelectedProduct(null);
      await refreshCurrentPage();
    } catch (error) {
      setFormError(error.message || USER_MESSAGES.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!canDeleteProducts || !selectedProduct || !canDeleteProduct(selectedProduct)) {
      return;
    }

    setIsDeleting(true);
    setSuccessMessage("");

    try {
      await deleteProduct(selectedProduct.id);
      setSuccessMessage(USER_MESSAGES.productDeleted);
      setModalMode(null);
      setSelectedProduct(null);
      await refreshCurrentPage();
    } catch (error) {
      setFormError(error.message || "No se pudo eliminar el producto.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function refreshCurrentPage() {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await listProducts({
        ...filters,
        page: pagination.page,
        pageSize: PAGE_SIZE,
      });
      const normalized = normalizeProductsResponse(data);

      setProducts(normalized.items);
      setPagination(normalized.pagination);
    } catch (error) {
      setProducts([]);
      setLoadError(error.message || "No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }

  const hasFilters = Boolean(filters.search || filters.sku || filters.categoryId);
  const isProductModalOpen = modalMode === "create" || modalMode === "edit";
  const isDeleteDialogOpen = modalMode === "delete";
  const modalTitle = modalMode === "create" ? "Registrar producto" : "Editar producto";
  const modalDescription =
    modalMode === "create"
      ? "Crea un producto con SKU único, categoría y stock mínimo opcional."
      : "Actualiza los datos editables. El SKU no se puede modificar.";

  return (
    <PageContainer size="wide">
      <PageHeader
        actions={
          canManageProducts ? (
            <Button onClick={openCreateModal}>Registrar producto</Button>
          ) : null
        }
        description="Registra, consulta y edita productos con categorías predefinidas."
        title="Productos"
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
          name="sku-filter"
          onChange={(event) => updateFilter("sku", event.target.value)}
          placeholder="ARR-500"
          value={filters.sku}
        />
        <Select
          label="Categoría"
          onChange={(event) => updateFilter("categoryId", event.target.value)}
          options={categoryOptions}
          placeholder="Todas las categorías"
          value={filters.categoryId}
        />
      </FilterToolbar>

      {loadError && !isLoading ? (
        <EmptyState
          action={
            <Button onClick={refreshCurrentPage} type="button" variant="secondary">
              Reintentar
            </Button>
          }
          description="Revisa la conexión con el API Gateway o intenta nuevamente."
          icon="!"
          title="Productos no disponibles"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={products}
            emptyMessage={USER_MESSAGES.noResults}
            loading={isLoading}
          />
          {!isLoading && products.length > 0 ? (
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
            <Button form="product-form" loading={isSaving} type="submit">
              Guardar
            </Button>
          </>
        }
        onOpenChange={closeModal}
        open={isProductModalOpen}
        title={modalTitle}
      >
        <form className="space-y-5" id="product-form" onSubmit={handleSubmit}>
          {formError ? (
            <Alert title="No se pudo guardar" variant="error">
              {formError}
            </Alert>
          ) : null}

          <Input
            error={formErrors.name}
            label="Nombre"
            name="name"
            onChange={(event) => updateFormValue("name", event.target.value)}
            placeholder="Arroz 500g"
            value={formValues.name}
          />

          <Input
            disabled={modalMode === "edit"}
            error={formErrors.sku}
            helperText={
              modalMode === "edit"
                ? "El SKU no se puede modificar después de crear el producto."
                : "Debe ser único. También funciona como código único."
            }
            label="SKU"
            name="sku"
            onChange={(event) => updateFormValue("sku", event.target.value)}
            placeholder="ARR-500"
            value={formValues.sku}
          />

          <Select
            error={formErrors.categoryId}
            label="Categoría"
            name="categoryId"
            onChange={(event) => updateFormValue("categoryId", event.target.value)}
            options={categoryOptions}
            value={formValues.categoryId}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              error={formErrors.minimumStock}
              helperText="Déjalo vacío si el producto no debe generar alerta de stock bajo."
              label="Stock mínimo"
              min="0"
              name="minimumStock"
              onChange={(event) => updateFormValue("minimumStock", event.target.value)}
              placeholder="10"
              type="number"
              value={formValues.minimumStock}
            />
            <Input
              error={formErrors.expirationDate}
              helperText="Déjalo vacío si el producto no tiene vencimiento."
              label="Fecha de vencimiento"
              name="expirationDate"
              onChange={(event) => updateFormValue("expirationDate", event.target.value)}
              type="date"
              value={formValues.expirationDate}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        confirmLabel="Eliminar"
        description={
          selectedProduct
            ? `Esta acción eliminará "${selectedProduct.name}". Solo está permitida porque su stock actual es 0.`
            : ""
        }
        loading={isDeleting}
        onCancel={closeModal}
        onConfirm={handleDelete}
        onOpenChange={closeModal}
        open={isDeleteDialogOpen}
        title="Eliminar producto"
        variant="danger"
      >
        {formError ? (
          <Alert title="No se pudo eliminar" variant="error">
            {formError}
          </Alert>
        ) : null}
      </ConfirmDialog>
    </PageContainer>
  );
}

function normalizeProductsResponse(data) {
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
      totalPages: Number(pagination.totalPages) || Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    },
  };
}

function normalizeCategoriesResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.items) ? data.items : [];
}

function validateProductForm(values, mode) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  }

  if (mode === "create" && !values.sku.trim()) {
    errors.sku = "El SKU es obligatorio.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Selecciona una categoría.";
  }

  if (values.minimumStock !== "") {
    const minimumStock = Number(values.minimumStock);

    if (!Number.isInteger(minimumStock) || minimumStock < 0) {
      errors.minimumStock = "El stock mínimo debe ser un entero mayor o igual a 0.";
    }
  }

  return errors;
}

function buildProductPayload(values) {
  return {
    categoryId: values.categoryId,
    expirationDate: values.expirationDate || null,
    minimumStock: values.minimumStock === "" ? null : Number(values.minimumStock),
    name: values.name.trim(),
  };
}

function canDeleteProduct(product) {
  return Number(product?.availableStock) === 0;
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
