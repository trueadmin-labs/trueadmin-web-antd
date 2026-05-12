# TrueAdmin Web AntD

Ant Design components for TrueAdmin web applications.

This package is the Ant Design integration layer. It may depend on React, Ant Design, and Ant Design icons. It must not read application runtime config, endpoint URLs, permissions, generated plugin files, or project aliases.

## Exports

- `@trueadmin/web-antd/action`

Only components with stable, application-neutral APIs should move here. Project-specific data access, business workflow, menu facts, auth session policy, and provider wiring stay in the template application.
