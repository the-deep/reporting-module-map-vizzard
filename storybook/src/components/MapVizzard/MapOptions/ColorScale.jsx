import * as d3 from 'd3';
import * as d3ColorScale from 'd3-scale-chromatic';
import styles from './ColorScale.module.css';

function ColorScale({
  steps = 12,
  pow = 1,
  colorScale = 'PuBu',
  colorScaleType = 'continuous',
  containerClass = 'colorScaleDiv',
  inverted = false,
}) {
  let numSteps = steps;
  let fillPow = pow;
  let interpolator;
  let colorsArray;
  if (colorScaleType === 'continuous') numSteps = 50;
  if ((colorScaleType === 'steps') || (colorScaleType === 'categorised')) fillPow = 1;
  if (colorScaleType === 'categorised') {
    colorsArray = d3ColorScale[`scheme${colorScale}`];
  } else {
    interpolator = d3ColorScale[`interpolate${colorScale}`];
    colorsArray = Array.from({ length: numSteps }, (_, i) => interpolator(i * (1 / (numSteps))));
  }
  if (colorScale === '') return false;
  // eslint-disable-next-line

  if (inverted) colorsArray = [...colorsArray].reverse();

  const colorsArrayPow = d3.scalePow()
    .exponent(fillPow)
    .domain([0, numSteps]);

  const colorStrPow = colorsArray.map((c, i) => {
    const colorIndex = Math.ceil(colorsArrayPow(i) * (numSteps));
    return (colorsArray[colorIndex]);
  });

  const colorsString = colorStrPow.join(', ');
  const cssGradient = { background: `linear-gradient(90deg, ${colorsString})` };

  return (
    <div className={`${styles.colorScaleContainer} ${styles[containerClass]} `}>
      {(colorScaleType === 'steps' || colorScaleType === 'categorised') && (
        <div className={styles.colorScale}>
          {colorStrPow.map((c, i) => (
            <div key={`${i + c}`} className={styles.steps}>
              <div style={{ backgroundColor: c }} />
            </div>
          ))}
        </div>
      )}
      {colorScaleType === 'continuous' && (
        <div className={styles.colorScale} style={cssGradient} role="presentation" />
      )}
    </div>
  );
}

export default ColorScale;
