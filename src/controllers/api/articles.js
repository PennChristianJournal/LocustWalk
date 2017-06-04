
import { Router } from 'express';
const router = new Router();
import Article from '../../models/article';

function makeQuery(query) {
  // TODO: Rename these in the views
  query.is_published = query.published;
  query.is_featured = query.featured;
  delete query.published;
  delete query.featured;
  var q = Object.assign({}, query, {is_published: true});

  for (let name in q) {
    if (q.hasOwnProperty(name)) {
      if (q[name] === undefined) {
        delete q[name];
      }
    }
  }
  return q;
}

router.get('/', (req, res) => {
  Article.queryPaginated(makeQuery(req.query), (err, articles) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(articles);
    }
  });
});

router.get('/count', (req, res) => {
  delete req.query.limit;
  delete req.query.sort;
  Article.count(makeQuery(req.query), (err, count) => {
    if (err) {
      console.log(err);
    }
    res.json(count);
  });
});

export default router;
