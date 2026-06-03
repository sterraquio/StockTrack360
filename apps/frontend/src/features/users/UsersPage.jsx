"use client";

import { useEffect, useMemo, useState } from "react";

import { Table, Pagination, StatusCell } from "@/components/data-display";
import { Alert, EmptyState } from "@/components/feedback";
import { FilterToolbar } from "@/components/forms";
import { PageContainer, PageHeader } from "@/components/layout";
import { Badge, Button, Input, Modal, SearchInput, Select } from "@/components/ui";
import { createUser, listUsers, updateUser } from "@/services/usersService";
import { USER_MESSAGES } from "@/utils/messages";
import { ROLES } from "@/utils/permissions";

const PAGE_SIZE = 10;

const USER_ROLES = [
  { label: "Administrador", value: ROLES.ADMIN },
  { label: "Usuario operativo", value: ROLES.USER },
];

const USER_STATUSES = [
  { label: "Activo", value: "ACTIVE" },
  { label: "Inactivo", value: "INACTIVE" },
];

const INITIAL_FILTERS = {
  role: "",
  search: "",
  status: "",
};

const INITIAL_FORM = {
  email: "",
  name: "",
  password: "",
  role: ROLES.USER,
  status: "ACTIVE",
};

export function UsersPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const columns = useMemo(
    () => [
      {
        header: "Usuario",
        key: "name",
        render: (user) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-text-heading">{user.name}</span>
            <span className="text-xs text-text-muted">{user.email}</span>
          </div>
        ),
      },
      {
        header: "Rol",
        key: "role",
        render: (user) => (
          <Badge variant={user.role === ROLES.ADMIN ? "info" : "neutral"}>
            {getRoleLabel(user.role)}
          </Badge>
        ),
      },
      {
        header: "Estado",
        key: "status",
        render: (user) => (
          <StatusCell variant={user.status === "ACTIVE" ? "success" : "warning"}>
            {getStatusLabel(user.status)}
          </StatusCell>
        ),
      },
      {
        header: "Creado",
        key: "createdAt",
        render: (user) => formatDate(user.createdAt),
      },
      {
        className: "text-right",
        header: "Acciones",
        key: "actions",
        render: (user) => (
          <div className="flex justify-end">
            <Button onClick={() => openEditModal(user)} size="sm" variant="secondary">
              Editar
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await listUsers({
          ...filters,
          page: pagination.page,
          pageSize: PAGE_SIZE,
        });
        const normalized = normalizeUsersResponse(data);

        if (isActive) {
          setUsers(normalized.items);
          setPagination(normalized.pagination);
        }
      } catch (error) {
        if (isActive) {
          setUsers([]);
          setLoadError(error.message || "No se pudieron cargar los usuarios.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

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
    setSelectedUser(null);
    setFormValues(INITIAL_FORM);
    setFormErrors({});
    setFormError("");
    setModalMode("create");
  }

  function openEditModal(user) {
    setSelectedUser(user);
    setFormValues({
      email: user.email ?? "",
      name: user.name ?? "",
      password: "",
      role: isValidRole(user.role) ? user.role : ROLES.USER,
      status: isValidStatus(user.status) ? user.status : "ACTIVE",
    });
    setFormErrors({});
    setFormError("");
    setModalMode("edit");
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setModalMode(null);
    setSelectedUser(null);
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

    const validationErrors = validateUserForm(formValues, modalMode);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError(USER_MESSAGES.requiredFields);
      return;
    }

    setIsSaving(true);

    try {
      if (modalMode === "create") {
        await createUser({
          email: formValues.email.trim(),
          name: formValues.name.trim(),
          password: formValues.password,
          role: formValues.role,
          status: formValues.status,
        });
        setSuccessMessage("Usuario creado correctamente.");
      } else {
        await updateUser(selectedUser.id, {
          name: formValues.name.trim(),
          role: formValues.role,
          status: formValues.status,
        });
        setSuccessMessage("Usuario actualizado correctamente.");
      }

      setModalMode(null);
      setSelectedUser(null);
      await refreshCurrentPage();
    } catch (error) {
      setFormError(error.message || USER_MESSAGES.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function refreshCurrentPage() {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await listUsers({
        ...filters,
        page: pagination.page,
        pageSize: PAGE_SIZE,
      });
      const normalized = normalizeUsersResponse(data);

      setUsers(normalized.items);
      setPagination(normalized.pagination);
    } catch (error) {
      setUsers([]);
      setLoadError(error.message || "No se pudieron cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  }

  const hasFilters = Boolean(filters.search || filters.role || filters.status);
  const isModalOpen = modalMode === "create" || modalMode === "edit";
  const modalTitle = modalMode === "create" ? "Registrar usuario" : "Editar usuario";
  const modalDescription =
    modalMode === "create"
      ? "Crea una cuenta operativa con rol y estado inicial."
      : "Actualiza nombre, rol y estado. El correo no se puede modificar.";

  return (
    <PageContainer size="wide">
      <PageHeader
        actions={<Button onClick={openCreateModal}>Registrar usuario</Button>}
        description="Administra cuentas, roles y estados del equipo operativo."
        title="Usuarios"
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
          label="Buscar por"
          onChange={(value) => updateFilter("search", value)}
          placeholder="Nombre o correo..."
          value={filters.search}
        />
        <Select
          label="Rol"
          onChange={(event) => updateFilter("role", event.target.value)}
          options={USER_ROLES}
          placeholder="Todos los roles"
          value={filters.role}
        />
        <Select
          label="Estado"
          onChange={(event) => updateFilter("status", event.target.value)}
          options={USER_STATUSES}
          placeholder="Todos los estados"
          value={filters.status}
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
          title="Usuarios no disponibles"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={users}
            emptyMessage={USER_MESSAGES.noResults}
            loading={isLoading}
          />
          {!isLoading && users.length > 0 ? (
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
            <Button form="user-form" loading={isSaving} type="submit">
              Guardar
            </Button>
          </>
        }
        onOpenChange={closeModal}
        open={isModalOpen}
        title={modalTitle}
      >
        <form className="space-y-5" id="user-form" onSubmit={handleSubmit}>
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
            placeholder="Nombre completo"
            value={formValues.name}
          />

          <Input
            disabled={modalMode === "edit"}
            error={formErrors.email}
            helperText={
              modalMode === "edit"
                ? "El correo no se puede modificar después de crear el usuario."
                : null
            }
            label="Correo"
            name="email"
            onChange={(event) => updateFormValue("email", event.target.value)}
            placeholder="usuario@stocktrack360.local"
            type="email"
            value={formValues.email}
          />

          {modalMode === "create" ? (
            <Input
              error={formErrors.password}
              label="Contraseña"
              name="password"
              onChange={(event) => updateFormValue("password", event.target.value)}
              placeholder="Contraseña temporal"
              type="password"
              value={formValues.password}
            />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              error={formErrors.role}
              label="Rol"
              name="role"
              onChange={(event) => updateFormValue("role", event.target.value)}
              options={USER_ROLES}
              value={formValues.role}
            />
            <Select
              error={formErrors.status}
              label="Estado"
              name="status"
              onChange={(event) => updateFormValue("status", event.target.value)}
              options={USER_STATUSES}
              value={formValues.status}
            />
          </div>

        </form>
      </Modal>
    </PageContainer>
  );
}

function normalizeUsersResponse(data) {
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

function validateUserForm(values, mode) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  }

  if (mode === "create") {
    if (!values.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Ingresa un correo válido.";
    }

    if (!values.password) {
      errors.password = "La contraseña es obligatoria.";
    }
  }

  if (!isValidRole(values.role)) {
    errors.role = "Selecciona un rol válido.";
  }

  if (!isValidStatus(values.status)) {
    errors.status = "Selecciona un estado válido.";
  }

  return errors;
}

function getRoleLabel(role) {
  return USER_ROLES.find((option) => option.value === role)?.label ?? role;
}

function getStatusLabel(status) {
  return USER_STATUSES.find((option) => option.value === status)?.label ?? status;
}

function isValidRole(role) {
  return USER_ROLES.some((option) => option.value === role);
}

function isValidStatus(status) {
  return USER_STATUSES.some((option) => option.value === status);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "N/A";
  }
}
