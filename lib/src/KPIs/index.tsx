import React from 'react';

import styles from './styles.module.css';
import externalLink from './external-link.svg';

interface KpiData {
    title: string;
    subtitle: string;
    value: React.ReactNode;
    date: string;
    source: string;
    backgroundColor: string;
    color: string;
    primaryColor: string;
    url: string;
}

export interface Props {
    data: KpiData[],
    isMobile: boolean,
    leftBorder: boolean
}

// FIXME: Is this the correct way to get Kpi key?
function getKey(item: KpiData) {
    return `${item.title}:${item.value}`;
}

function KPIs(props: Props) {
    const {
        data,
        isMobile,
        leftBorder,
    } = props;

    const borderWidth = leftBorder === true
        ? 3
        : 0;
    const cols = isMobile
        ? data.length / 2
        : data.length;

    return (
        <div
            className={styles.container}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
            {data.map((kpi) => (
                <div
                    className={styles.item}
                    key={getKey(kpi)}
                    style={{
                        backgroundColor: kpi.backgroundColor,
                        color: kpi.color,
                    }}
                >
                    <div
                        style={{
                            borderLeft: `${borderWidth}px solid ${kpi.primaryColor}`,
                            display: 'inline-block',
                            width: 4,
                            height: '95%',
                            left: 0,
                            top: 2,
                            position: 'absolute',
                        }}
                    />
                    <div className={styles.title}>
                        {kpi.title}
                    </div>
                    <div className={styles.subtitle}>
                        {kpi.subtitle}
                    </div>
                    <div
                        className={styles.value}
                        style={{ color: kpi.primaryColor }}
                    >
                        {kpi.value}
                    </div>
                    <div className={styles.footerRow}>
                        <div
                            className={styles.date}
                            style={{
                                color: kpi.color,
                            }}
                        >
                            {kpi.date}
                        </div>
                        <div className={styles.source}>
                            <a
                                href={kpi.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    color: kpi.color,
                                }}
                            >
                                <img
                                    className="kpi_external_link"
                                    src={externalLink}
                                    alt="Link to data souce"
                                />
                                {kpi.source}
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KPIs;
