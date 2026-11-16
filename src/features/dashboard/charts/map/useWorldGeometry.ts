"use client";

import { useQuery } from "@tanstack/react-query";
import type { Feature, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import { feature } from "topojson-client";

export type CountryFeature = Feature<Geometry, { name: string }> & { id: string };

async function loadCountries(): Promise<CountryFeature[]> {
  const [{ default: world }] = await Promise.all([import("world-atlas/countries-110m.json")]);
  const topology = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const collection = feature(topology, topology.objects.countries);
  return collection.features
    .filter((f) => f.properties.name !== "Antarctica")
    .map((f) => ({ ...f, id: f.id === undefined ? `name:${f.properties.name}` : String(f.id) }));
}

export function useWorldGeometry() {
  return useQuery({
    queryKey: ["world-geometry"],
    queryFn: loadCountries,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
