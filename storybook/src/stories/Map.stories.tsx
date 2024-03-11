import { Map } from '@the-deep/reporting-module-components';

import defaultConfig from './default.json';
/*
import sudanMapConfig from './sudan.json';
import ukraineMapConfig from './ukraine.json';
import darfurMapConfig from './darfur.json';
*/

import heatmapData from './sudan-conflict-events-2023-sep-nov.json';
import symbolData from './sudan-active-bcp-2023-11.json';
import lineData from './sudan-disputed-boundaries.json';

// Story Config
export default {
  title: 'Map/Map',
  component: Map,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'number', description: 'Viewbox height in pixels', table: { type: { summary: 'number' } } },
    zoom: { control: 'number', description: 'Initial zoom level', table: { type: { summary: 'number' } } },
    center: { description: 'Viewbox centre coordinates', table: { type: { summary: 'array [lon,lat]' } } },
    mainTitle: { description: 'Main map title', table: { type: { summary: 'string' } } },
    subTitle: { description: 'Map sub-title', table: { type: { summary: 'string' } } },
    layers: { control: 'object', description: 'layers object', table: { type: { summary: 'JSON object' } } },
    showScale: { control: 'boolean', description: 'show scale', table: { type: { summary: 'boolean' } } },
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    ...defaultConfig.mapOptions,
    center: {
      lon: 30,
      lat: 16.8,
    },
    zoom: 5.6,
    layers: [
      {
        id: 1,
        name: 'OSM background',
        type: 'osm',
        visible: true,
        options: {
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 11,
        type: 'mapbox',
        visible: true,
        options: {
          opacity: 0.6,
          zIndex: 2,
          styleUrl: 'mapbox://styles/matthewsmawfield/clidxtx3j003p01r0cetzc9iv',
          accessToken: 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ',
        },
      },
      {
        id: 15,
        type: 'heatmap',
        visible: true,
        options: {
          data: heatmapData,

          blur: 4.5,
          fillPalette: 'Oranges',
          radius: 5,
          weighted: true,
          weightPropertyKey: 'fatalities',
          zIndex: 6,
          opacity: 0.83,
          scaleDataMax: 10,

          // Unused properties
          scale: 0.3,
          scaleType: 'fixed',
          scaleScaling: 'flannery',
          scaleDataMin: 0,
          showInLegend: true,
          legendSeriesTitle: 'ACLED conflict events',
          style: {
            strokeWidth: 1.2,
            stroke: {
              r: 190,
              g: 33,
              b: 38,
              a: 1,
            },
            fill: {
              r: 255,
              g: 255,
              b: 255,
              a: 0.1,
            },
            labelStyle: {
              fontWeight: 'normal',
              fontSize: 10,
              showHalo: true,
              color: {
                r: 0,
                g: 0,
                b: 0,
                a: 1,
              },
              fontFamily: 'Barlow Condensed',
            },
          },
        },
      },
      {
        id: 15,
        type: 'symbol',
        visible: true,
        options: {
          data: symbolData,

          id: 12,
          zIndex: 111,
          labelPropertyKey: 'map_label',
          opacity: 1,
          scale: 1,
          scaleType: 'fixed',
          showLabels: true,
          symbol: 'borderCrossingActive',
          symbolStyle: {
            strokeWidth: 1.4,
            stroke: '#000',
            fill: '#FFF',
          },
          labelStyle: {
            fontSize: 12,
            showHalo: true,
            color: {
              r: 0,
              g: 0,
              b: 0,
              a: 0.4,
            },
            fontFamily: 'Barlow Condensed',
          },

          // Unused properties
          showInLegend: true,
          legendSeriesTitle: 'Border crossing points - Active',
          name: 'Border crossings - Active',
          enableTooltips: true,
          tooltipsTitleColumn: 'map_label',
          ts: 0.19323252146233383,
        },
      },
      {
        id: 9,
        type: 'line',
        visible: true,
        options: {
          source: lineData,

          opacity: 1,
          zIndex: 111,
          style: {
            strokeType: 'dash',
            dashSpacing: 3,
            stroke: '#f00',
            strokeWidth: 2,
          },

          // Unused properties
          name: 'Disputed boundaries',
          showLabels: false,
          labelColumn: '',
          showInLegend: true,
          legendSeriesTitle: 'Disputed boundaries',
        },
      },
    ],
  },
};

/*
export const Sudan = {
  args: {
    ...sudanMapConfig.mapOptions,
    layers: sudanMapConfig.layers,
  },
};

export const Ukraine = {
  args: {
    ...ukraineMapConfig.mapOptions,
    layers: ukraineMapConfig.layers,
  },
};

export const Darfur = {
  args: {
    ...darfurMapConfig.mapOptions,
    layers: darfurMapConfig.layers,
  },
};
*/
