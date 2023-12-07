import React, { useEffect } from 'react';
import { Timeline as TL } from '@knight-lab/timelinejs';
import './Timeline.css';

export interface Props {
    data: {
        Date: string;
        Category: string;
        Details: string;
        Source: string;
        Link: string;
    }[],
}

function Timeline({ data }: Props) {
    const timelineoptions = {
    // initial_zoom: 2,
        scale_factor: 1.4,
        timenav_position: 'top',
        height: '500',
        width: '100%',
        lang: 'en',
        start_at_end: true,
        font: 'Roboto Slab',
    };

    // eslint-disable-next-line
    const evt = data.map((d:any) => (
        {
            start_date: new Date(d.Date),
            display_date: (new Date(d.Date)).toDateString(),
            group: d.Category,
            text: {
                headline: d['Main events'],
                text: d.Details,
            },
        }
    ));

    const events = { events: evt };

    useEffect(() => {
        new TL( // eslint-disable-line no-new
            'timeline-embed',
            events,
            timelineoptions,
        );
    });

    return (
        <div id="timeline-embed" className="container" style={{ height: 500 }} />
    );
}

export default Timeline;
