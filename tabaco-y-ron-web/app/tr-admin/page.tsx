"use client";

import Link from "next/link";

import { useAdmin } from "@/components/admin/AdminContext";
import { Card, PageHeader } from "@/components/admin/ui";
import useMarcasService from "@/hooks/use-marcas-service";
import useProductosService from "@/hooks/use-productos-service";
import useUsersService from "@/hooks/use-users-service";

function StatCard({
  label,
  value,
  href,
  loading,
}: {
  label: string;
  value: number | string;
  href: string;
  loading: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="group flex flex-col gap-2 p-6 transition-colors hover:border-line-strong">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream-mute">
          {label}
        </span>
        <span className="font-serif text-4xl text-gold">
          {loading ? "—" : value}
        </span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-gold">
          Gestionar →
        </span>
      </Card>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAdmin();
  const { useList: useProductos } = useProductosService();
  const { useList: useMarcas } = useMarcasService();
  const { useList: useUsers } = useUsersService();

  const productos = useProductos({ page: 1, page_size: 1 });
  const marcas = useMarcas();
  const users = useUsers();

  const totalSubcategorias = (marcas.data ?? []).reduce(
    (acc, m) => acc + m.subcategorias.length,
    0,
  );

  return (
    <div className="page">
      <PageHeader
        title={`Hola, ${user.nombre.split(" ")[0]}`}
        subtitle="Resumen del catálogo y accesos rápidos."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Productos"
          value={productos.data?.total ?? 0}
          href="/tr-admin/productos"
          loading={productos.isLoading}
        />
        <StatCard
          label="Marcas"
          value={marcas.data?.length ?? 0}
          href="/tr-admin/marcas"
          loading={marcas.isLoading}
        />
        <StatCard
          label="Subcategorías"
          value={totalSubcategorias}
          href="/tr-admin/marcas"
          loading={marcas.isLoading}
        />
        {isAdmin && (
          <StatCard
            label="Usuarios"
            value={users.data?.length ?? 0}
            href="/tr-admin/usuarios"
            loading={users.isLoading}
          />
        )}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="mb-2 font-serif text-xl text-cream">Tu rol</h2>
        <p className="text-sm leading-relaxed text-cream-mute">
          {isAdmin ? (
            <>
              Como <strong className="text-gold">administrador</strong> puedes gestionar el
              catálogo completo (productos, marcas y subcategorías) y administrar los usuarios del
              panel y sus roles.
            </>
          ) : (
            <>
              Como <strong className="text-gold">gestor</strong> puedes administrar el catálogo:
              productos, marcas y subcategorías. La gestión de usuarios está reservada a los
              administradores.
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
