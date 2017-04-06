
import moment from 'moment';

export function articleHeading(article) {
  var date = new Date(article.date);
  return article.heading_override || moment(date.toISOString()).format('MMM YYYY');
}