# Dependency security exceptions

Only findings that remain after the applied dependency overrides are listed
here.

## `deepmerge`

- Package: `deepmerge` 4.3.1
- Path: production (`@neondatabase/auth` → `@neondatabase/auth-ui` → `@daveyplate/better-auth-ui` → `@react-email/components` → `@react-email/render` → `html-to-text` → `deepmerge`); development (`shadcn` → `@shadcn/registry` → `deepmerge`)
- Severity: low
- Reason: prototype poisoning of returned objects (`GHSA-gcqx-w48m-w2h4`); the audit reports `>=4.3.2` as patched, but no published version at or above that range is available.
- Re-evaluate when a published `deepmerge >= 4.3.2` becomes available.

## `minimatch`

- Package: `minimatch` 3.1.5 and 10.2.6
- Path: development (`eslint` and `shadcn` tooling)
- Severity: moderate
- Reason: potential denial of service via globparts amplification (`GHSA-g3hv-75wg-m249`); the patched version is `11.0.1`, but the installed consumers use majors 3 and 10 and a global override would break ESLint 9 resolution.
- Re-evaluate when updating the dev tooling.
