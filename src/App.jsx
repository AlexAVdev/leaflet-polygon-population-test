import { useEffect, useState } from "react";
import L from "leaflet"
import { Tooltip } from "./Tooltip"
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw/dist/leaflet.draw-src.css';

export const App = () => {
  const [geoPolygon, setGeoPolygon] = useState(null)
  const [polygonLayer, setPolygonLayer] = useState(null)

  useEffect(() => {
    const map = L.map('map').setView([56.34542024730709, 37.513675689697266], 11);
    L.tileLayer('http://tile.digimap.ru/rumap/{z}/{x}/{y}.png?guid=93BC6341-B35E-4B34-9DFE-26796F64BBB7', {
      attribution: 'Map data &copy; <a href="http://maps.digimap.ru/">digimap.ru</a>'
    }).addTo(map);
    let editFeatureGroup = new L.FeatureGroup().addTo(map);
    
    const drawOptions = {
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#ff0000',
          },
        },
         
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false,
        rectangle: false,
      },
      edit: {
        edit: false,
        remove: false,
        featureGroup: editFeatureGroup,
      }
    };

    new L.Control.Draw(drawOptions).addTo(map);
    let editToolbar = new L.EditToolbar({
      featureGroup: editFeatureGroup
    })
    let editHandler = editToolbar.getModeHandlers()[0].handler
    editHandler._map = map

    map.on('draw:created', (event) => {
      const layer = event.layer;
      editFeatureGroup.addLayer(layer);
      editHandler.enable();
      setGeoPolygon(layer.toGeoJSON())
      setPolygonLayer(layer)

      layer.on('dblclick', (e) => {
        map.removeLayer(layer);
      })
    });

    map.on('draw:drawstart', (event) => {
      event.target.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          map.removeLayer(layer);
        }
      })
    });

    map.on('draw:editvertex', (event) => {
      const layer = event.poly
      setGeoPolygon(layer.toGeoJSON())
      setPolygonLayer(layer)
    });

    return () => map.remove();
  }, []);



  return <>
    <div id="map" style={{ height: '100vh' }} />;
    <Tooltip geoPolygon={geoPolygon} polygonLayer={polygonLayer} />
  </>
};
