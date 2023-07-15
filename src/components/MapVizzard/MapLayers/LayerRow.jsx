import { useContext, useEffect, useState } from "react";
import styles from "./MapLayers.module.css";
import polygon from "../assets/polygon.svg";
import point from "../assets/point.svg";
import raster from "../assets/raster.svg";
import mask from "../assets/mask.svg";
import show from "../assets/show.svg";
import hide from "../assets/hide.svg";
import up from "../assets/up.svg";
import down from "../assets/down.svg";
import removeIcon from "../assets/remove.svg";

const LayerRow = ({ row, update, activeLayer, setActiveLayer }) => {
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const addHover = () => setHovered(true);
  const removeHover = () => setHovered(false);

  const clickRow = (e) => {
    if (e.target.nodeName == "IMG") return;
    if (setActiveLayer) setActiveLayer(row.id);
  };

  const moveBack = () => {
    row.zIndex = row.zIndex - 1.001;
    update(row, row.id);
  };

  const moveForward = () => {
    row.zIndex = row.zIndex + 1.001;
    update(row, row.id);
  };

  const remove = () => {
    update("remove", row.id);
  };

  const toggleVisibility = () => {
    if (row.visible == 1) {
      row.visible = 0;
    } else {
      row.visible = 1;
    }
    row.ts = Math.random();
    update(row, row.id);
  };

  let icon;
  if (row.type == "osm") {
    icon = <img className={styles.MapLayers_raster} src={raster} />;
  } else if (row.type == "mask") {
    icon = <img className={styles.MapLayers_point} src={mask} />;
  } else if (row.type == "symbol") {
    icon = <img className={styles.MapLayers_point} src={point} />;
  } else if (row.type == "polygon") {
    icon = <img className={styles.MapLayers_polygon} src={polygon} />;
  } else {
    icon = <img className={styles.MapLayers_raster} src={raster} />;
  }
  let showIcon;
  if (row.visible) {
    showIcon = <img src={show} />;
  } else {
    showIcon = <img src={hide} />;
  }

  let activeClass = "";
  if (activeLayer == row.id) {
    activeClass = styles.active;
  }

  return (
    <div
      className={
        hovered
          ? `${styles.MapLayers_row} ${styles.hovered}`
          : styles.MapLayers_row
      }
      onClick={clickRow}
      onMouseEnter={addHover}
      onMouseLeave={removeHover}
    >
      <div className={styles.MapLayers_icon_container}>
        <div className={styles.MapLayers_icon}>{icon}</div>
      </div>
      <div className={`${styles.MapLayers_title} ${activeClass}`}>
        {row.name}
      </div>
      <div className={styles.MapLayers_buttons}>
        <div className={styles.MapLayers_buttons_forward} onClick={moveForward}>
          <img src={up} />
        </div>
        <div className={styles.MapLayers_buttons_back} onClick={moveBack}>
          <img src={down} />
        </div>
        <div className={styles.MapLayers_buttons_remove} onClick={remove}>
          <img src={removeIcon} />
        </div>
        <div
          className={
            !row.visible
              ? `$(styles.MapLayers_buttons_show) $(MapLayers_buttons_hidden)`
              : styles.MapLayers_buttons_show
          }
          onClick={toggleVisibility}
        >
          {showIcon}
        </div>
      </div>
    </div>
  );
};

export default LayerRow;