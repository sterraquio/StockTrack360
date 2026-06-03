import { KpiCard, Pagination, StatusCell, Table } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { FieldGroup, FilterToolbar, FormActions } from "@/components/forms";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button, Card, Input, SearchInput, Select } from "@/components/ui";

const categoryOptions = [
  { label: "Todas las categorías", value: "all" },
  { label: "Alimentos y bebidas", value: "alimentos" },
  { label: "Aseo y limpieza", value: "aseo" },
  { label: "Papelería y oficina", value: "papeleria" },
];

const statusOptions = [
  { label: "Todos los estados", value: "all" },
  { label: "Activo", value: "activo" },
  { label: "Inactivo", value: "inactivo" },
];

const periodOptions = [
  { label: "Este mes", value: "month" },
  { label: "Últimos 7 días", value: "7-days" },
  { label: "Últimos 30 días", value: "30-days" },
];

const productColumns = [
  { key: "name", header: "Producto" },
  {
    key: "sku",
    header: "SKU",
    render: (row) => <span className="font-mono text-xs">{row.sku}</span>,
  },
  { key: "category", header: "Categoría" },
  {
    key: "status",
    header: "Estado",
    render: (row) => (
      <StatusCell helperText={row.helperText} variant={row.variant}>
        {row.status}
      </StatusCell>
    ),
  },
];

const productRows = [
  {
    id: "sample-product",
    category: "Predefinida",
    helperText: "Stock inicial 0",
    name: "Producto de referencia",
    sku: "SKU-000",
    status: "Base",
    variant: "neutral",
  },
];

const movementColumns = [
  { key: "date", header: "Fecha" },
  { key: "product", header: "Producto" },
  {
    key: "type",
    header: "Tipo",
    render: (row) => <StatusCell variant={row.variant}>{row.type}</StatusCell>,
  },
  { key: "quantity", header: "Cantidad" },
];

const movementRows = [
  {
    id: "sample-entry",
    date: "Pendiente",
    product: "Producto seleccionado",
    quantity: "0",
    type: "Entrada",
    variant: "success",
  },
  {
    id: "sample-exit",
    date: "Pendiente",
    product: "Producto seleccionado",
    quantity: "0",
    type: "Salida",
    variant: "danger",
  },
];

const alertRows = [
  {
    id: "sample-low-stock",
    category: "Inventario",
    name: "Producto con stock bajo",
    status: "Stock bajo",
    variant: "danger",
  },
  {
    id: "sample-expiration",
    category: "Vencimiento",
    name: "Producto próximo a vencer",
    status: "Por vencer",
    variant: "warning",
  },
];

const userRows = [
  {
    id: "sample-admin",
    email: "admin@stocktrack360.local",
    name: "Administrador",
    role: "ADMINISTRADOR",
    status: "Activo",
    variant: "success",
  },
  {
    id: "sample-user",
    email: "usuario@stocktrack360.local",
    name: "Encargado de inventario",
    role: "USUARIO",
    status: "Activo",
    variant: "info",
  },
];

function PlaceholderFilters({ pattern }) {
  if (pattern === "dashboard") {
    return (
      <FilterToolbar
        actions={<Button variant="secondary">Aplicar periodo</Button>}
      >
        <Select label="Periodo" options={periodOptions} />
      </FilterToolbar>
    );
  }

  if (pattern === "movements") {
    return (
      <Card title="Registro operativo" variant="form">
        <FieldGroup columns={2}>
          <Select label="Producto" options={categoryOptions} />
          <Input label="Cantidad" min="1" placeholder="0" type="number" />
        </FieldGroup>
        <FormActions className="mt-5">
          <Button variant="secondary">Registrar entrada</Button>
          <Button variant="danger">Registrar salida</Button>
        </FormActions>
      </Card>
    );
  }

  if (pattern === "alerts") {
    return (
      <Alert title="Estado de alertas" variant="warning">
        Las alertas usarán badges semánticos para stock bajo, vencidos y
        próximos a vencer.
      </Alert>
    );
  }

  if (pattern === "reports") {
    return (
      <FilterToolbar actions={<Button variant="secondary">Consultar</Button>}>
        <Select label="Reporte" options={periodOptions} />
        <Select label="Categoría" options={categoryOptions} />
      </FilterToolbar>
    );
  }

  if (pattern === "users") {
    return (
      <FilterToolbar actions={<Button>Registrar usuario</Button>}>
        <SearchInput label="Buscar por" placeholder="Nombre o correo..." />
        <Select label="Estado" options={statusOptions} />
      </FilterToolbar>
    );
  }

  return (
    <FilterToolbar actions={<Button variant="secondary">Limpiar filtros</Button>}>
      <SearchInput label="Buscar por" placeholder="Nombre o SKU..." />
      <Select label="Categoría" options={categoryOptions} />
    </FilterToolbar>
  );
}

function PlaceholderTable({ pattern }) {
  if (pattern === "movements") {
    return (
      <Card title="Historial de movimientos">
        <Table columns={movementColumns} data={movementRows} />
        <Pagination page={1} pageSize={10} totalItems={movementRows.length} />
      </Card>
    );
  }

  if (pattern === "alerts") {
    return (
      <Table
        columns={[
          { key: "name", header: "Producto" },
          { key: "category", header: "Tipo" },
          {
            key: "status",
            header: "Estado",
            render: (row) => (
              <StatusCell variant={row.variant}>{row.status}</StatusCell>
            ),
          },
        ]}
        data={alertRows}
      />
    );
  }

  if (pattern === "users") {
    return (
      <Card title="Usuarios registrados">
        <Table
          columns={[
            { key: "name", header: "Nombre" },
            { key: "email", header: "Correo" },
            {
              key: "role",
              header: "Rol",
              render: (row) => <StatusCell variant="neutral">{row.role}</StatusCell>,
            },
            {
              key: "status",
              header: "Estado",
              render: (row) => (
                <StatusCell variant={row.variant}>{row.status}</StatusCell>
              ),
            },
          ]}
          data={userRows}
        />
        <Pagination page={1} pageSize={10} totalItems={userRows.length} />
      </Card>
    );
  }

  if (pattern === "dashboard") {
    return (
      <Card title="Productos con mayor movimiento">
        <Table columns={productColumns} data={productRows} />
      </Card>
    );
  }

  return (
    <Card title={pattern === "reports" ? "Resultado del reporte" : "Listado base"}>
      <Table columns={productColumns} data={productRows} />
      <Pagination page={1} pageSize={10} totalItems={productRows.length} />
    </Card>
  );
}

export function ModulePlaceholder({
  actions,
  description,
  highlights = [],
  pattern = "default",
  title,
}) {
  return (
    <PageContainer size="wide">
      <PageHeader actions={actions} description={description} title={title} />
      <Alert variant="info">
        Este módulo debe construirse usando los componentes compartidos,
        mensajes estándar y estados obligatorios definidos en el design system.
      </Alert>
      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <KpiCard
            key={item.label}
            label={item.label}
            status={item.status}
            value={item.value}
            variant={item.variant ?? "neutral"}
          />
        ))}
      </div>
      <PlaceholderFilters pattern={pattern} />
      <PlaceholderTable pattern={pattern} />
      <EmptyState
        action={<Button variant="secondary">Revisar contrato API</Button>}
        description="Cuando el backend esté conectado, reemplaza este estado por loading, error, empty y datos reales según corresponda."
        title="Base visual lista para implementar"
      />
    </PageContainer>
  );
}
