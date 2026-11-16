"use client";

import { Breadcrumbs } from "./Breadcrumbs";
import { ProductFilter } from "./ProductFilter";
import { FocusChip } from "./FocusChip";
import { ScopeAnnouncer } from "./ScopeAnnouncer";

export function ScopeBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Breadcrumbs />
      <ScopeAnnouncer />
      <div className="flex flex-wrap items-center gap-2">
        <FocusChip />
        <ProductFilter />
      </div>
    </div>
  );
}
