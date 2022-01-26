DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'startupquickstart_read_write'
  ) THEN
    CREATE ROLE startupquickstart_read_write NOINHERIT;
  END IF;
END
$do$;

DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'startupquickstart_read_only'
  ) THEN
    CREATE ROLE startupquickstart_read_only;
  END IF;
END
$do$;

DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'startupquickstart'
  ) THEN
    CREATE ROLE startupquickstart;
  END IF;
END
$do$;

GRANT startupquickstart TO startupquickstart_read_write;
GRANT startupquickstart TO postgres;

DO
$do$
BEGIN
  CREATE USER startupquickstart_svc_app WITH PASSWORD 'startupquickstart_svc_app_pass';
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  ALTER USER startupquickstart_svc_app WITH PASSWORD 'startupquickstart_svc_app_pass';
END
$do$;

GRANT startupquickstart_read_write TO startupquickstart_svc_app;

GRANT pg_signal_backend TO startupquickstart_read_write, startupquickstart_read_only, startupquickstart;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

CREATE SCHEMA IF NOT EXISTS app;

GRANT USAGE ON SCHEMA app TO startupquickstart_read_write;
GRANT SELECT ON ALL TABLES IN SCHEMA app TO startupquickstart_read_write;

GRANT USAGE ON SCHEMA app TO startupquickstart_read_only;
GRANT SELECT ON ALL TABLES IN SCHEMA app TO startupquickstart_read_only;

GRANT USAGE, CREATE ON SCHEMA app TO startupquickstart;
GRANT ALL ON ALL TABLES IN SCHEMA app TO startupquickstart;

/* Default privileges for anything created as the owner role */
SET ROLE=startupquickstart;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT ON TABLES TO startupquickstart_read_write;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT ON TABLES TO startupquickstart_read_only;