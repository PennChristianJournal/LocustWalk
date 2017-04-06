
import { Router } from 'express'
const router = new Router();
import Article from '../../models/article'

function makeQuery(req) {
    var q = {
        is_published: req.query.published,
        is_featured: req.query.featured,
        parent: req.query.parent,
        _id: req.query._id,
        slug: req.query.slug
    };

    for (let name in q) {
        if (q.hasOwnProperty(name)) {
            if (typeof q[name] === "undefined") {
                delete q[name];
            }
        }
    }
    return q;
}

router.get('/', (req, res) => {
    req.query.is_published = true;

    Article.queryPaginated(req.query, (err, articles) => {
        if (err) {
            console.log(err);
            res.send([]);
        } else {
            res.send(articles);
        }
    });
});

router.get('/count', (req, res) => {
    Article.count(makeQuery(req), (err, count) => {
        if (err) {
            console.log(err);
        }
        res.send(count);
    });
});

export default router