import React from 'react';
import styles from './styles.module.css';

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
        }[],
    },
}

function KPIs({ data }: Props) {
    const render = data.kpis.map((d) => (
        <div
            // FIXME: Add key
            className={styles.item}
            style={{ backgroundColor: d.backgroundColor, color: d.color }}
        >
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
