var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');//jade文件目录
app.set('view engine', 'jade');//设置视图模块引擎为jade

// app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));//网站静态文件目录
app.locals.moment = require('moment');
app.listen(port);//监听端口

console.log('imooc startted on port ' + port);

//index page
app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err) {
			console.log(err);
		}
		res.render('index', {
			title:'imooc 首页',
			movies:movies
			// movies: [{
			// 	title: '机械战警',
			// 	_id: 1,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			// },{
			// 	title: '机械战警',
			// 	_id: 2,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			// },{
			// 	title: '机械战警',
			// 	_id: 3,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			// },{
			// 	title: '机械战警',
			// 	_id: 4,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			// },{
			// 	title: '机械战警',
			// 	_id: 5,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			// },{
			// 	title: '机械战警',
			// 	_id: 6,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			// }]
		});
	});
});

//detail page
app.get('/movie/:id', function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		res.render('detail', {
			title:'imooc ' + movie.title,
			movie: movie
			// movie: {
			// 	doctor: '何塞·帕迪里亚',
			// 	country: '美国',
			// 	title: '机械战警',
			// 	year: 2014,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			// 	language: '英语',
			// 	flash: 'http://vod.kankan.com/v/74/74105/359218.shtml?id=731009&vfm=bdvtx#frp=v.baidu.com%2Fv',
			// 	summary: '2028年，专事军火开发的机器人公司Omni Corp生产了大量装备精良的机械战警，他们被投入到维和和惩治犯罪等行动中，取得显著的效果。罪犯横行的底特律市，嫉恶如仇、正义感十足的警察亚历克斯·墨菲（乔尔·金纳曼饰）遭到仇家暗算，身体受到毁灭性破坏。借助于Omni公司天才博士丹尼特·诺顿（加里·奥德曼饰）最前沿的技术，墨菲以机械战警的形态复活。数轮严格的测试表明，墨菲足以承担起维护社会治安的重任，他的口碑在民众中直线飙升，而墨菲的妻子克拉拉（艾比·考尼什饰）和儿子大卫却再难从他身上感觉亲人的温暖。感知到妻儿的痛苦，墨菲决心向策划杀害自己的犯罪头子展开反击。'
			// }
		});
	});
});



//admin page
app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title:'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			language: '',
			summary: ''
		}
	});
});

//admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id

	if(id) {
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title:'imooc 后台更新页',
				movie: movie
			});
		});
	}
});


//admin post movie
app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id)
			});
		});
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie) {
			if(err) {
				console.log(err);
			}

			res.redirect('/movie/' + movie._id);
		});
	}
});

//list page
app.get('/admin/list', function(req, res){
	Movie.fetch(function(err, movies){
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title:'imooc 列表页',
			movies: movies
			// movies: [{
			// 	title: '机械战警',
			// 	_id: 1,
			// 	doctor: '何塞·帕迪里亚',
			// 	country: '美国',
			// 	year: 2014,
			// 	poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			// 	language: '英语',
			// 	flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			// 	summary: '2028年，专事军火开发的机器人公司Omni Corp生产了大量装备精良的机械战警，他们被投入到维和和惩治犯罪等行动中，取得显著的效果。罪犯横行的底特律市，嫉恶如仇、正义感十足的警察亚历克斯·墨菲（乔尔·金纳曼饰）遭到仇家暗算，身体受到毁灭性破坏。借助于Omni公司天才博士丹尼特·诺顿（加里·奥德曼饰）最前沿的技术，墨菲以机械战警的形态复活。数轮严格的测试表明，墨菲足以承担起维护社会治安的重任，他的口碑在民众中直线飙升，而墨菲的妻子克拉拉（艾比·考尼什饰）和儿子大卫却再难从他身上感觉亲人的温暖。感知到妻儿的痛苦，墨菲决心向策划杀害自己的犯罪头子展开反击。'
			// }]
		});
	});
});

//list delete movie
app.delete('/admin/list', function(req, res) {
	var id = req.query.id;

	if(id) {
		Movie.remove({_id: id}, function(err,movie) {
			if(err) {
				console.log(err);
			}
			else {
				res.json({success: 1});
			}
		});
	}
});