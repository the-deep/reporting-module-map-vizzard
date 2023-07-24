import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import styles from './ColorPicker.module.css';

function ColorPicker({ color, setColor }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (c) => {
    setColor(c.rgb);
  };

  return (
    <div>
      <div className={styles.swatch} onClick={handleClick} role="presentation">
        <div className={styles.color} style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }} />
      </div>
      {displayColorPicker ? (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={handleClose} role="presentation" />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;

export function rgba(rgb) {
  if (rgb && typeof rgb !== 'undefined' && rgb.a > 0) {
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
  }
  return null;
}
