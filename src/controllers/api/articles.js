
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
    var query = Article.find(makeQuery(req));
    if (req.query.limit) query = query.limit(parseInt(req.query.limit));
    if (req.query.sort) query = query.sort({[req.query.sort]: -1});
    
    query.exec((err, articles) => {
        if (err) console.log(err);
        res.send(articles);
    });
});

export default router