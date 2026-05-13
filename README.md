# TrueAdmin Web AntD

Ant Design components for TrueAdmin web applications.

This package is the Ant Design integration layer. It may depend on React, Ant Design, and Ant Design icons. It must not read application runtime config, endpoint URLs, permissions, generated plugin files, or project aliases.

## Exports

- `@trueadmin/web-antd/action`
- `@trueadmin/web-antd/filter`
- `@trueadmin/web-antd/remote-select`

Only components with stable, application-neutral APIs should move here. Project-specific data access, business workflow, menu facts, auth session policy, and provider wiring stay in the template application.

## Boundary

Components in this package are reusable UI adapters. They can render Ant Design controls and expose behavior through props, but they cannot own TrueAdmin application facts.

Allowed examples:

- action buttons and confirm wrappers
- action overflow menus with caller-provided confirm and feedback behavior
- quick filters and tree filters
- remote option selectors with caller-provided fetching
- class name, style, render hook, and pass-through props for customization

Not allowed examples:

- reading `web/config`
- reading auth session, menu state, module registry, or plugin registry
- importing application aliases such as `@/`, `@core`, `@modules`, `@plugins`, or `@config`
- hard-coding admin API endpoints or business services

Admin-only workflows should stay in the admin template or a future admin-specific package. Cross-end components can move here only when their data access and business behavior are fully provided by the caller.
