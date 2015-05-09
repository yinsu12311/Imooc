//Model   ：  由Schema发布生成的模型
//具有抽象属性和行为的数据库操作对
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie', MovieSchema);//将Schema发布为Model

module.exports = Movie;