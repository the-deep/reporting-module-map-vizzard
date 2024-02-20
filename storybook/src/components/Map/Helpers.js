import moment from 'moment';

export function numberFormatter(number) {
  if (number === '-') return '-';
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(number);
}

export function getDaysArray(startDate, sd) {
  const dateArray = [];
  let currentDate = moment(startDate);
  const stopDate = moment(sd);
  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

export default numberFormatter;
