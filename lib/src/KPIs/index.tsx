import React from 'react';

import { IoOpenOutline } from 'react-icons/io5';
import styles from './styles.module.css';

interface KpiData {
    title: string;
    titleStyle: React.CSSProperties;
    subtitle: string;
    subtitleStyle: React.CSSProperties;
    value: number;
    valueStyle: React.CSSProperties;
    date: string;
    source: string;
    url: string;
    sourceStyle: React.CSSProperties;
}

export interface Props {
    data: KpiData[],
}

// FIXME: Is this the correct way to get Kpi key?
function getKey(item: KpiData) {
    return `${item.title}:${item.value}`;
}

function KPIs(props: Props) {
    const {
        data,
    } = props;

    return (
        <div className={styles.container}>
            {data.map((kpi) => (
                <div
                    className={styles.item}
                    key={getKey(kpi)}
                >
                    <div className={styles.heading}>
                        <div
                            style={kpi.titleStyle}
                        >
                            {kpi.title}
                        </div>
                        <div
                            style={kpi.subtitleStyle}
                        >
                            {kpi.subtitle}
                        </div>
                    </div>

                    <div className={styles.value}>
                        {kpi.value !== 0 && (
                            <div
                                style={kpi.valueStyle}
                            >
                                {kpi.value}
                            </div>
                        )}
                        <div className={styles.right}>
                            <div className={styles.date}>
                                {kpi.date}
                            </div>

                            {kpi.url !== undefined && (
                                <a
                                    style={kpi.sourceStyle}
                                    className={styles.link}
                                    href={kpi.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <IoOpenOutline />
                                    {kpi.source}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KPIs;
