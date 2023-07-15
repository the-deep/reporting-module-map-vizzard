import { useContext, useEffect } from "react";
import { Style, Icon, Fill, Stroke, Circle, Image, Text } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, get } from "ol/proj";
import MapContext from "../MapContext";

const addCircles = (d) => {
  const iconStyle = [
    new Style({
      image: new Circle({
        radius: d.style.radius,
        fill: new Fill({
          color: d.style.fill,
        }),
        stroke: new Stroke({
          color: d.style.stroke,
          width: d.style.strokeWidth,
        }),
      }),
    }),
    new Style({
      text: new Text({
        text: d.name,
        offsetY: 2,
        scale: 2,
        fill: new Fill({
          color: "#black",
        }),
      }),
    }),
  ];

  let features = d.data.map((item) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([item.lon, item.lat])),
    });
    feature.setStyle(iconStyle);
    return feature;
  });

  return features;
};

const addSymbols = (d) => {
  let scale = 0.9;
  let font = "11px Arial";

  if (d.symbol == "city") {
    scale = 0.6;
  }

  if (d.symbol == "settlement") {
    scale = 0.4;
    font = "10px Arial";
  }

  if (d.symbol == "capital") {
    scale = 0.9;
    font = "bold 11px Arial";
  }

  const showLabels = d.showLabels;

  let features = d.data.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat([item.lon, item.lat])),
    });

    const iconStyle = [
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          scale: scale,
          src: process.env.PUBLIC_URL + "/map-icons/" + d.symbol + ".svg",
        }),
      }),
    ];

    if (showLabels === true) {
      iconStyle.push(
        new Style({
          text: new Text({
            text: item.title,
            textAlign: "left",
            font: font,
            offsetY: 1,
            offsetX: 8,
            scale: 1,
            fill: new Fill({
              color: "#black",
            }),
          }),
        })
      );
    }

    feature.setStyle(iconStyle);
    return feature;
  });

  return features;
};

export { addCircles, addSymbols };