import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import {
  FormControl,
} from '@mui/material';
import FontPicker from './FontPicker';
import styles from './MapOptions.module.css';
import settings from '../assets/settings.svg';

function OptionsMapGeneral({ mapOptions, updateMapOptions }) {
  const logos = [
    { name: 'Data Friendly Space', image: 'dfs' },
    { name: 'DEEP (small)', image: 'deepSmall' },
    { name: 'DEEP', image: 'deep' },
    { name: 'DRC', image: 'drc' },
    { name: 'iMMAP', image: 'immap' },
  ];

  const updateAttr = (attr, val) => {
    const mapOptionsClone = { ...mapOptions };
    mapOptionsClone[attr] = val;
    updateMapOptions(mapOptionsClone);
  };

  const updateFontStyle = (attr, val) => {
    const mapOptionsClone = { ...mapOptions };
    mapOptionsClone.fontStyle[attr] = val;
    updateMapOptions(mapOptionsClone);
  };

  const updateCenter = (attr, val) => {
    const mapOptionsClone = { ...mapOptions };
    mapOptionsClone.center[attr] = val;
    updateMapOptions(mapOptionsClone);
  };

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={settings} alt="" />
          </div>
          Map Options
        </h1>
      </div>

      <div className={styles.mapOptionsPanelBody}>
        <div className={styles.optionsPanel}>
          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Width (px)"
                variant="standard"
                value={mapOptions.width}
                type="number"
                size="medium"
                inputProps={{
                  step: 1,
                }}
                onChange={(e) => updateAttr('width', parseInt(e.target.value, 10))}
              />
            </FormControl>
          </div>

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Height (px)"
                variant="standard"
                value={mapOptions.height}
                type="number"
                size="small"
                inputProps={{
                  step: 1,
                }}
                onChange={(e) => updateAttr('height', parseInt(e.target.value, 10))}
              />
            </FormControl>
          </div>

          <hr />

          <FontPicker style={mapOptions.fontStyle} updateFontStyle={updateFontStyle} variant="general" />

          <hr />

          <div className={styles.optionRow} style={{ marginTop: 8 }}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Show header
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={mapOptions.showHeader}
                color="default"
                onChange={(e, val) => updateAttr('showHeader', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {mapOptions.showHeader && (
            <div>
              <div className={styles.optionRow}>
                <FormControl fullWidth>
                  <TextField
                    label="Main title"
                    variant="standard"
                    value={mapOptions.mainTitle}
                    onChange={(e) => updateAttr('mainTitle', e.target.value)}
                  />
                </FormControl>
              </div>

              <div className={styles.optionRow}>
                <FormControl fullWidth>
                  <TextField
                    label="Sub-title"
                    size="small"
                    variant="standard"
                    value={mapOptions.subTitle}
                    onChange={(e) => updateAttr('subTitle', e.target.value)}
                  />
                </FormControl>
              </div>
            </div>
          )}

          <div className={styles.optionRow}>
            <div className={styles.optionLabelSm}>Show logos</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  multiple
                  value={mapOptions.showLogos}
                  onChange={(e) => updateAttr('showLogos', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  { logos.map((logo) => (
                    <MenuItem key={logo.name} value={logo.name}>
                      <Checkbox size="small" checked={mapOptions.showLogos.indexOf(logo.name) > -1} />
                      <ListItemText size="small" primary={logo.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <hr />

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Center latitude"
                variant="standard"
                value={mapOptions.center.lat}
                type="number"
                inputProps={{
                  step: 0.1,
                }}
                onChange={(e) => updateCenter('lat', parseFloat(e.target.value))}
              />
            </FormControl>
          </div>

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Center longitude"
                variant="standard"
                value={mapOptions.center.lon}
                type="number"
                inputProps={{
                  step: 0.1,
                }}
                onChange={(e) => updateCenter('lon', parseFloat(e.target.value))}
              />
            </FormControl>
          </div>

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Initial zoom"
                variant="standard"
                value={mapOptions.zoom}
                type="number"
                inputProps={{
                  step: 0.05,
                }}
                onChange={(e) => updateAttr('zoom', parseFloat(e.target.value))}
              />
            </FormControl>
          </div>

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Minimum zoom extent"
                variant="standard"
                value={mapOptions.minZoom}
                type="number"
                inputProps={{
                  step: 0.05,
                }}
                onChange={(e) => updateAttr('minZoom', parseFloat(e.target.value))}
              />
            </FormControl>
          </div>

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Maximum zoom extent"
                variant="standard"
                value={mapOptions.maxZoom}
                type="number"
                inputProps={{
                  step: 0.05,
                }}
                onChange={(e) => updateAttr('maxZoom', parseFloat(e.target.value))}
              />
            </FormControl>
          </div>

          <hr />

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>Show zoom buttons</div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={mapOptions.enableZoomControls}
                color="default"
                onChange={(e, val) => updateAttr('enableZoomControls', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {mapOptions.enableZoomControls && (
          <div className={styles.optionRow}>
            <div className={styles.optionLabelSm}>Zoom buttons position</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.zoomControlsPosition}
                  onChange={(e, val) => updateAttr('zoomControlsPosition', val.props.value)}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  <MenuItem key="zoomControlsPositionBottomLeft" value="bottomLeft">Bottom left</MenuItem>
                  <MenuItem key="zoomControlsPositionBottomRight" value="bottomRight">Bottom right</MenuItem>
                  <MenuItem key="zoomControlsPositionTopRight" value="topRight">Top right</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          )}

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>Mousewheel zoom</div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={mapOptions.enableMouseWheelZoom}
                color="default"
                onChange={(e, val) => updateAttr('enableMouseWheelZoom', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>Double-click zoom</div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={mapOptions.enableDoubleClickZoom}
                color="default"
                onChange={(e, val) => updateAttr('enableDoubleClickZoom', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          <hr />

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>Show scale bar</div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={mapOptions.showScale}
                color="default"
                onChange={(e, val) => updateAttr('showScale', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {mapOptions.showScale && (
          <div className={styles.optionRow}>
            <div className={styles.optionLabelSm}>Scale position</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.scaleBarPosition}
                  onChange={(e, val) => updateAttr('scaleBarPosition', val.props.value)}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  <MenuItem key="scaleBarPositionBottomLeft" value="bottomLeft">Bottom left</MenuItem>
                  <MenuItem key="scaleBarPositionBottomRight" value="bottomRight">Bottom right</MenuItem>
                  <MenuItem key="scaleBarPositionTopRight" value="topRight">Top right</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          )}

          {mapOptions.showScale && (
          <div className={styles.optionRow}>
            <div className={styles.optionLabelSm}>Scale units</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.scaleUnits}
                  onChange={(e, val) => updateAttr('scaleUnits', val.props.value)}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  <MenuItem key="scaleUnit1" value="metric">metric (km)</MenuItem>
                  <MenuItem key="scaleUnit2" value="imperial">imperial (miles)</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          )}

          {mapOptions.showScale && (
          <div className={styles.optionRow}>
            <div className={styles.optionLabelSm}>Scale style</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.scaleBar}
                  onChange={(e, val) => updateAttr('scaleBar', (val.props.value === 'true'))}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  <MenuItem key="scaleBarFalse" value="false">Line</MenuItem>
                  <MenuItem key="scaleBarTrue" value="true">Bars</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          )}

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Show footer
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={mapOptions.showFooter}
                color="default"
                onChange={(e, val) => updateAttr('showFooter', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {mapOptions.showFooter && (
            <div>
              <div className={styles.optionRow}>
                <FormControl fullWidth>
                  <TextField
                    label="Sources"
                    variant="standard"
                    value={mapOptions.sources}
                    onChange={(e) => updateAttr('sources', e.target.value)}
                  />
                </FormControl>
              </div>
            </div>
          )}

          <hr />

        </div>
      </div>
    </div>
  );
}

export default OptionsMapGeneral;
