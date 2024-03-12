import { Map } from '@the-deep/reporting-module-components';

/*
import defaultConfig from './default.json';
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
    title: { control: 'object', description: 'Title' },
    subTitle: { control: 'object', description: 'Subtitle' },
    zoom: { control: 'number', description: 'Zoom level', table: { type: { summary: 'number' } } },
    minZoom: { control: 'number', description: 'Minimum zoom level', table: { type: { summary: 'number' } } },
    maxZoom: { control: 'number', description: 'Maximum zoom level', table: { type: { summary: 'number' } } },
    center: { description: 'Viewbox centre coordinates', table: { type: { summary: 'array [lon,lat]' } } },
    layers: { control: 'object', description: 'layers object', table: { type: { summary: 'JSON object' } } },
    showScale: { control: 'boolean', description: 'show scale', table: { type: { summary: 'boolean' } } },
  },
};

export const Default = {
  args: {
    title: { children: 'This is Map' },
    subTitle: { children: 'This is the description of the map' },
    mapHeight: 400,
    maxZoom: 7,
    minZoom: 1,
    showScale: true,
    scaleUnits: 'metric',
    scaleBar: true,
    enableMouseWheelZoom: true,
    enableDoubleClickZoom: true,
    enableZoomControls: true,
    center: [31, 14],
    zoom: 4,
    layers: [
      {
        id: 1,
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
