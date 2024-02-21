import { useEffect } from "react";
import L from "leaflet"

export const Tooltip = ({
  geoPolygon,
  polygonLayer,
}) => {
  const formatGeoJson = (geoJson) => (JSON.stringify({
    features: [geoJson],
    type: "FeatureCollection",
  }))

  useEffect(() => {
    if (geoPolygon) {
      const areaStaticUrl = "http://gis01.rumap.ru/4898/areaStatistics"
      const guid = "93BC6341-B35E-4B34-9DFE-26796F64BBB7"
      fetch(`${areaStaticUrl}?guid=${guid}&geojson=${formatGeoJson(geoPolygon)}`)
        .then((res) => res.json())
        .then((data) => {
          const tooltip = L.tooltip({ permanent: true, direction: 'center' })
            .setContent(`Количество населения в данной области: ${data?.population_rs} человек`)
            .setLatLng(polygonLayer.getBounds().getCenter());
      
          polygonLayer.bindTooltip(tooltip).openTooltip();
        })
    }
  }, [geoPolygon])

  return <></>
}