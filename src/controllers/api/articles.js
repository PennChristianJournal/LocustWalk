
import { Router } from 'express'
const router = Router();
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
    var limit = parseInt(req.query.limit);
    var page = parseInt(req.query.page);
    var sort = req.query.sort;

    var query = Article.find(makeQuery(req));

    if (sort) query = query.sort({[sort]: -1});
    if (page) {
        query = query.skip(page * limit);
    }
    if (limit) query = query.limit(limit);

    query.exec((err, articles) => {
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