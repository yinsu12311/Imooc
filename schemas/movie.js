//Schema  ：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	meta: {//时间记录 
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

MovieSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}
	next();
});

MovieSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {//只返回单个文档
		return this
			.findOne({_id: id})
			.exec(cb)
	},
	save: function(cb) {
		return this
			.save()
			.exec(cb);
	}
}

module.exports = MovieSchema;