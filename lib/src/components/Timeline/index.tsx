import React, {
    useRef,
    useMemo,
    useEffect,
} from 'react';
import { Timeline as TL } from '@knight-lab/timelinejs';

import styles from './styles.module.css';

interface TimelineData {
    date: string;
    category: string;
    title: string;
    details: string;
    source: string;
    link: string;
}

const timelineOptions = {
    scale_factor: 1.4,
    timenav_position: 'top',
    height: '500',
    width: '100%',
    lang: 'en',
    start_at_end: true,
    font: 'Roboto Slab',
};

export interface Props {
    data: TimelineData[],
}

function Timeline(props: Props) {
    const { data } = props;

    const dummyRef = useRef<HTMLDivElement>(null);

    const finalEvents = useMemo(
        () => data.map((datum) => (
            {
                start_date: new Date(datum.date),
                display_date: (new Date(datum.date)).toDateString(),
                group: datum.category,
                text: {
                    headline: datum.title,
                    text: datum.details,
                },
            }
        )),
        [data],
    );

    useEffect(() => {
        // eslint-disable-next-line no-new
        new TL(
            dummyRef.current,
            { events: finalEvents },
            timelineOptions,
        );
    }, [finalEvents]);

    return (
        <div
            className={styles.myContainer}
        >
            <div ref={dummyRef} />
        </div>
    );
}

export default Timeline;
