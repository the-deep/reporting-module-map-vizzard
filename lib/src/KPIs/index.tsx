import React from 'react';
import styles from './styles.module.css';
import externalLink from './external-link.svg';

export interface Props {
    data: {
        kpis: {
            title: string;
            subtitle: string;
            value: React.ReactNode;
            date: string;
            source: string;
            backgroundColor: string;
            color: string;
            primaryColor: string;
            url: string;
        }[],
    },
    isMobile: boolean,
    leftBorder: boolean
}

function KPIs({ data, isMobile, leftBorder }: Props) {
    let borderWidth = 0;
    if (leftBorder === true) borderWidth = 3;
    let cols = data.kpis.length;
    if (isMobile) cols /= 2;

    const render = data.kpis.map((d) => (
        <div
            // FIXME: Add key
            className={styles.item}
            key={`${d.title}${d.value}`}
            style={{ backgroundColor: d.backgroundColor, color: d.color }}
        >
            <div style={{
                borderLeft: `${borderWidth}px solid ${d.primaryColor}`,
                display: 'inline-block',
                width: 4,
                height: '95%',
                left: 0,
                top: 2,
                position: 'absolute',
            }}
            />
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
                <div className={styles.date}>
                    {d.date}
                </div>
                <div className={styles.source}>
                    <a href={d.url} target="_blank" rel="noreferrer">
                        <img className="kpi_external_link" src={externalLink} alt="Link to data souce" />
                        {d.source}
                    </a>
                </div>
            </div>
        </div>
    ));

    return (
        <div className={styles.container} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {render}
        </div>
    );
}

export default KPIs;
