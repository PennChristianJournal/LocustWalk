
import moment from 'moment'

export function articleHeading(article) {
    return article.heading_override || moment(article.date.toISOString()).format('MMM YYYY');
}