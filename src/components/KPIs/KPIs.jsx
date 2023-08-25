import React from 'react';
import styles from './KPIs.module.css';

function KPIs({
  data,
}) {
  const render = data.kpis.map((d) => (
    <div className={styles.item} style={{ backgroundColor: d.backgroundColor, color: d.color }}>
      <div className={styles.title}>
        {d.title}
      </div>
      <div className={styles.subtitle}>
        {d.subtitle}
      </div>
      <div className={styles.value}>
        {d.value}
      </div>
      <div className={styles.footerRow}>
        <div className={styles.date}>
          {d.date}
        </div>
        <div className={styles.source}>
          {d.source}
        </div>
      </div>
    </div>
  ));

  return (
    <div className={styles.container}>
      {render}
    </div>
  );
}

export default KPIs;
