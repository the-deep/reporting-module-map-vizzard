import { useContext, useEffect, useState } from "react";
import styles from "./MapLayers.module.css";

const LayerRow = ({ row, update, activeLayer, setActiveLayer }) => {
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const addHover = () => setHovered(true);
  const removeHover = () => setHovered(false);

  const clickRow = (e) => {
    if(e.target.nodeName=='IMG') return;
    if(setActiveLayer) setActiveLayer(row.id);
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
    icon = (
      <img
        className={styles.MapLayers_raster}
        src={process.env.PUBLIC_URL + "/icons/raster.svg"}
      />
    );
  } else if (row.type == "mask") {
    icon = (
      <img
        className={styles.MapLayers_point}
        src={process.env.PUBLIC_URL + "/icons/mask.svg"}
      />
    );
  } else if (row.type == "symbol") {
    icon = (
      <img
        className={styles.MapLayers_point}
        src={process.env.PUBLIC_URL + "/icons/point.svg"}
      />
    );
  } else if (row.type == "polygon") {
    icon = (
      <img
        className={styles.MapLayers_polygon}
        src={process.env.PUBLIC_URL + "/icons/polygon.svg"}
      />
    );
  } else {
    icon = (
      <img
        className={styles.MapLayers_raster}
        src={process.env.PUBLIC_URL + "/icons/raster.svg"}
      />
    );
  }
  let showIcon;
  if (row.visible) {
    showIcon = <img src={process.env.PUBLIC_URL + "/icons/show.svg"} />;
  } else {
    showIcon = <img src={process.env.PUBLIC_URL + "/icons/hide.svg"} />;
  }

  let activeClass = "";
  if (activeLayer == row.id) {
    activeClass = styles.active;
  }

  return (
    <div
      className={hovered ? `${styles.MapLayers_row} ${styles.hovered}` : styles.MapLayers_row }
      onClick={clickRow}
      onMouseEnter={addHover}
      onMouseLeave={removeHover}
    >
      <div className={styles.MapLayers_icon_container}>
        <div className={styles.MapLayers_icon}>{icon}</div>
      </div>
      <div className={`${styles.MapLayers_title} ${activeClass}`}>{row.name}</div>
      <div className={styles.MapLayers_buttons}>
        <div className={styles.MapLayers_buttons_forward} onClick={moveForward}>
          <img src={process.env.PUBLIC_URL + "/icons/up.svg"} />
        </div>
        <div className={styles.MapLayers_buttons_back} onClick={moveBack}>
          <img src={process.env.PUBLIC_URL + "/icons/down.svg"} />
        </div>
        <div className={styles.MapLayers_buttons_remove} onClick={remove}>
          <img src={process.env.PUBLIC_URL + "/icons/remove.svg"} />
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