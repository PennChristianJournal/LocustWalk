
import { Router } from 'express';
const router = new Router();
import Article from '../../models/article';


function makeQuery(req, query) {
  var q = Object.assign({}, query, {
    is_published: query.is_published && !req.isAuthenticated(),
  });

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

  Article.queryPaginated(makeQuery(req, req.query), (err, articles) => {
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

  Article.count(makeQuery(req, req.query), (err, count) => {
    if (err) {
      console.log(err);
    }
    res.json(count);
  });
});

export default router;
