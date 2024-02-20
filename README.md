# DEEP Reporting Module Components

Map vizzard component of the DEEP Reporting module allowing users to create and design interactive maps and present geographic data on a map for reporting purposes using proportional symbols and choropleth polygons.

Built using JavaScript, React, OpenLayers and D3.js.

## Getting Started

Clone the repository

```bash
git clone git@github.com:the-deep/reporting-module-map-vizzard.git
```

Change into folder

```bash
cd reporting-module-map-vizzard
```

Install dependencies

```bash
yarn install
```

### Run linters

For library:

```bash
cd lib
yarn lint
yarn css-lint
yarn typecheck
```

For storybook:

```bash
yarn lint
# or
yarn lint:lenient
```

### Build and watch library

```bash
cd lib
yarn watch
```

### Run storybook

```bash
cd storybook
yarn storybook
```
