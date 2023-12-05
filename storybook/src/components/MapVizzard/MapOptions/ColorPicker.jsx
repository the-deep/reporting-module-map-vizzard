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

  const presetColors = [
    { color: '#be2126', title: 'iMMAP Primary' },
    { color: '#6d6e71', title: 'iMMAP Grey' },
    { color: '#193661', title: 'iMMAP Secondary' },
    { color: '#BE9D27', title: 'iMMAP Complementary 1' },
    { color: '#35712F', title: 'iMMAP Complementary 2' },
    { color: '#29B29C', title: 'iMMAP Complementary 3' },
    { color: '#E84E15', title: 'iMMAP Complementary 4' },
    { color: '#0D7260', title: 'iMMAP Complementary 5' },
    { color: '#49352E', title: 'iMMAP Complementary 6' },
    { color: '#418FDE', title: 'UNOCHA Primary' },
    { color: '#E56A54', title: 'UNOCHA Secondary' },
    { color: '#999999', title: 'UNOCHA Neutral' },
    { color: '#1a3ed0', title: 'DEEP Primary' },
    { color: '#00125b', title: 'DEEP Secondary' },
    { color: '#008eff', title: 'DEEP Tertiary' },
    { color: '#ff6720', title: 'DFS Primary' },
  ];

  return (
    <div>
      <div className={styles.swatch} onClick={handleClick} role="presentation">
        <div className={styles.color} style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }} />
      </div>
      {displayColorPicker ? (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={handleClose} role="presentation" />
          <SketchPicker color={color} onChange={handleChange} presetColors={presetColors} />
        </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;

export function rgba(rgb) {
  if (rgb && typeof rgb !== 'undefined' && rgb.a >= 0) {
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
  }
  return null;
}
