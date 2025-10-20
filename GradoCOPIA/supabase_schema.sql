

-- 1) Profiles (usuarios)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text,
  role text NOT NULL DEFAULT 'Residente', -- 'Residente' | 'Administrador' | 'Comite'
  phone text,
  house text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2) Solicitudes (requests / certificates / reports)
CREATE TABLE IF NOT EXISTS solicitudes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  tipo text NOT NULL,
  detalle text NOT NULL,
  estado text NOT NULL DEFAULT 'Pendiente', -- Pendiente | Aprobado | Denegado | EnProceso
  archivo_url text, -- optional: storage path or external URL
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_solicitudes_profile ON solicitudes(profile_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_solicitudes_updated_at
BEFORE UPDATE ON solicitudes
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 3) Reservas (reservations of common spaces)
CREATE TABLE IF NOT EXISTS reservas (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  espacio text NOT NULL,
  fecha date NOT NULL,
  hora time NOT NULL,
  estado text NOT NULL DEFAULT 'Confirmada', -- Confirmada | Cancelada | Pendiente
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reservas_espacio_fecha ON reservas(espacio, fecha);

CREATE TRIGGER trg_reservas_updated_at
BEFORE UPDATE ON reservas
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 4) Pagos (payments / invoices)
CREATE TABLE IF NOT EXISTS pagos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  mes text NOT NULL,
  valor numeric(12,2) NOT NULL,
  estado text NOT NULL DEFAULT 'Pendiente', -- Pendiente | Pagado | Parcial
  referencia text,
  comprobante_url text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pagos_profile ON pagos(profile_id);

-- 5) Foro (forum messages)
CREATE TABLE IF NOT EXISTS foro_messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  mensaje text NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_foro_profile ON foro_messages(profile_id);

-- 6) Anuncios y Actividades
CREATE TABLE IF NOT EXISTS anuncios (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL, -- quien publicó
  titulo text NOT NULL,
  contenido text,
  fecha_inicio date,
  fecha_fin date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actividades (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo text NOT NULL,
  descripcion text,
  fecha date NOT NULL,
  lugar text,
  created_at timestamptz DEFAULT now()
);

-- 7) Attachments / archivos (enlace a supabase storage recommended)
CREATE TABLE IF NOT EXISTS attachments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name text NOT NULL,
  record_id bigint NOT NULL,
  storage_path text NOT NULL, -- e.g. "public/solicitudes/uuid/archivo.pdf"
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attachments_table_record ON attachments(table_name, record_id);

-- 8) Optional: Audit log (simple)
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

COMMIT;


