'use strict';

import { Router } from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/server/renderer';
import StaticContent from '~/common/models/StaticContent'
const router = new Router();

import ArticlesController from './articles';
router.use('/articles', ArticlesController);

// serve static views
const views = ViewEngine.getViews('admin');
Object.keys(views).forEach(key => {
  const view = views[key];
  router.get(view.route, (req, res) => {

    Renderer.render(req, res, view);
  });
});


import formidable from 'express-formidable';
router.use(formidable());

router.post('/', function(req,res){
console.log(req.fields);
var currentPage =  new StaticContent({
  name: req.fields.name,
  contentMD: req.fields.markdown,
  contentHTML: req.fields.html
});
var query = {name: req.fields.name};



StaticContent.find({name: req.fields.name}, function(err, docs) {

    if(docs) {
        StaticContent.find({ name:req.fields.name }).remove().exec();

}
        var staticPage = new StaticContent(currentPage);
        staticPage.save(function (err) {
            if (err) {
                console.log("error");
            }
        })


        res.redirect('back');
  })
});
router.get('/deleteData', function(req,res){
StaticContent.remove({}, function(err, docs){
  if(err){
    throw err;
  }
})

})


router.get('/getStaticContent/:id', function(req,res){
  StaticContent.findOne({name: req.params.id}, function(err, docs){
    if(err){
      throw err;
    }
    res.send(docs);
  })
      })





router.get('/data', function(req,res){
  console.log("ASDAD");
var allData = {};
  StaticContent.find({}, function(err, docs) {
    if (!err){
        allData = docs;
        res.send(allData);

    } else {throw err;}
});

});

export default router;
