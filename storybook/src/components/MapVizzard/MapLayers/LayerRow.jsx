import { useState } from 'react';
import styles from './MapLayers.module.css';
import polygon from '../assets/polygon.svg';
import point from '../assets/point.svg';
import raster from '../assets/raster.svg';
import mask from '../assets/mask.svg';
import show from '../assets/show.svg';
import hide from '../assets/hide.svg';
import up from '../assets/up.svg';
import down from '../assets/down.svg';
import removeIcon from '../assets/remove.svg';

function LayerRow({
  row, update, activeLayer, setActiveLayer,
}) {
  const [hovered, setHovered] = useState(false);
  const addHover = () => setHovered(true);
  const removeHover = () => setHovered(false);

  const clickRow = (e) => {
    if (e.target.nodeName === 'IMG') return;
    if (setActiveLayer) setActiveLayer(row.id);
  };

  const moveBack = () => {
    const newRow = { ...row };
    newRow.zIndex -= 1.001;
    update(newRow, newRow.id);
  };

  const moveForward = () => {
    const newRow = { ...row };
    newRow.zIndex += 1.001;
    update(newRow, newRow.id);
  };

  const remove = () => {
    update('remove', row.id);
  };

  const toggleVisibility = () => {
    const newRow = { ...row };
    if (newRow.visible === 1) {
      newRow.visible = 0;
    } else {
      newRow.visible = 1;
    }
    newRow.ts = Math.random();
    update(newRow, newRow.id);
  };

  let icon;
  if (row.type === 'osm') {
    icon = <img className={styles.MapLayers_raster} src={raster} alt="" />;
  } else if (row.type === 'mask') {
    icon = <img className={styles.MapLayers_point} src={mask} alt="" />;
  } else if (row.type === 'symbol') {
    icon = <img className={styles.MapLayers_point} src={point} alt="" />;
  } else if (row.type === 'polygon') {
    icon = <img className={styles.MapLayers_polygon} src={polygon} alt="" />;
  } else {
    icon = <img className={styles.MapLayers_raster} src={raster} alt="" />;
  }
  let showIcon;
  if (row.visible) {
    showIcon = <img src={show} alt="" />;
  } else {
    showIcon = <img src={hide} alt="" />;
  }

  let activeClass = '';
  if (activeLayer === row.id) {
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
      role="presentation"
    >
      <div className={styles.MapLayers_icon_container}>
        <div className={styles.MapLayers_icon}>{icon}</div>
      </div>
      <div className={`${styles.MapLayers_title} ${activeClass}`}>
        {row.name}
      </div>
      <div className={styles.MapLayers_buttons}>
        <div className={styles.MapLayers_buttons_forward} onClick={moveForward} role="presentation">
          <img src={up} alt="" />
        </div>
        <div className={styles.MapLayers_buttons_back} onClick={moveBack} role="presentation">
          <img src={down} alt="" />
        </div>
        <div className={styles.MapLayers_buttons_remove} onClick={remove} role="presentation">
          <img src={removeIcon} alt="" />
        </div>
        <div
          className={
            !row.visible
              ? '$(styles.MapLayers_buttons_show) $(MapLayers_buttons_hidden)'
              : styles.MapLayers_buttons_show
          }
          onClick={toggleVisibility}
          role="presentation"
        >
          {showIcon}
        </div>
      </div>
    </div>
  );
}

export default LayerRow;
