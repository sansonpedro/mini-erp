# 0004 - Icon libraries

Date: 2026-11-07
Status: accepted

The application keeps both icon libraries for now. `lucide-react` is used by the shadcn components generated in `src/components/ui`, while Phosphor is used by the application navigation and product-facing UI. Migrating all icons would add churn without changing the user experience, so no migration is justified at this stage.

If the application grows a shared icon layer, standardize new application icons on one library and migrate existing icons only when the affected feature is already being changed.
