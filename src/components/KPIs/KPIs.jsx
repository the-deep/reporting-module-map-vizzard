import React from 'react';
import styles from './KPIs.module.css';
import externalLink from './external-link.svg';

function KPIs({
  data,
}) {
  const render = data.kpis.map((d) => (
    <div key={d.title} className={styles.item} style={{ backgroundColor: d.backgroundColor, color: d.color, fontFamily: 'Barlow Condensed' }}>
      <div className={styles.title}>
        {d.title}
      </div>
      <div className={styles.subtitle}>
        {d.subtitle}
      </div>
      <div className={styles.value} style={{ color: d.primaryColor }}>
        {d.value}
      </div>
      <div className={styles.footerRow}>
        <div className={styles.source}>
          <a href={d.url} target="_blank" rel="noreferrer">
            <img className="kpi_external_link" src={externalLink} alt="Link to data souce" />
            {d.source}
          </a>
        </div>
        <div className={styles.date}>
          {d.date}
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
