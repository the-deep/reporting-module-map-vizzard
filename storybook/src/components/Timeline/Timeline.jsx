import React, { useEffect } from 'react';
import { Timeline as TL } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import './Timeline.css';

function Timeline({
  data,
}) {
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

  // parse data
  const evt = data.map((d) => (
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
    // eslint-disable-next-line
    const timeline = new TL(
      'timeline-embed',
      events,
      timelineoptions,
    );
  }, []);

  return (
    <div id="timeline-embed" className="container" style={{ height: 500 }} />
  );
}

export default Timeline;
