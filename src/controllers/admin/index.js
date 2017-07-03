
import path from 'path';
import {Router} from 'express';
const router = new Router();
import StaticContent from '../../models/StaticContent';

import auth from './auth';
auth(router);

import {defineAdminPageRoute} from '../helpers';

import formidable from 'express-formidable';
router.use(formidable());

const AdminViews = path.join(__dirname, '../../react/views/admin');

import AdminHome from '../../react/views/admin/index';

defineAdminPageRoute(router, '/', AdminHome, path.join(AdminViews, 'index.js'), function(req, res, store, render) {
  render();
});



router.post('/', function(req,res){
  var name = {
    name: req.fields.name,
    contentMD: req.fields.markdown,
    contentHTML: req.fields.html


  }
console.log(req);
var newDocument = new StaticContent(name);
newDocument.save(function (err) {

});
  res.redirect('back');



});
router.get('/', function(req,res){

StaticContent.findOne({}, function(err,obj) { console.log(obj); });
res.redirect('back');



});

import ArticlesController from './articles';
router.use('/articles', ArticlesController);



export default router;
