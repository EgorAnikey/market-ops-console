import { geoArea } from "d3-geo";
import type { Feature, Geometry, Polygon } from "geojson";

export function mainland<P>(feature: Feature<Geometry, P>): Feature<Geometry, P> {
  if (feature.geometry.type !== "MultiPolygon") return feature;
  const polygons: Polygon[] = feature.geometry.coordinates.map((coordinates) => ({
    type: "Polygon",
    coordinates,
  }));
  const largest = polygons.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
  return { ...feature, geometry: largest };
}
