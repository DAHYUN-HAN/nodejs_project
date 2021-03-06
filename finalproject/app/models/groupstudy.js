const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;

console.log('call: /models/food.js');

const GroupstudySchema = new Schema({
	subject: {type: String, default: '', trim: true},//과목
    content: {type: String, default: '', trim: true},//내용
    location: {type: String, default: '', trim: true},//도서관 위치
    user: {type: String, default: ''},//작성자 정보
	createdAt: {type: Date, default: Date.now}//작성 시간
});


GroupstudySchema.statics = {
    //선택한 글 정보
	load: function (user, cb) {
		this.findOne({user})
		    .exec(function (err, db) {
			    cb(db)
		    });
	},
    //전체 글 정보
	list: function (cb) {
		this.find({}).sort({createdAt: -1}).exec(function (err, groups) {
			cb(groups)
		});
	},
    //10개 단위 글 정보
    list10: function (num, cb) {
		this.find({}).sort({createdAt: -1}).skip(10*(num-1)).limit(10).exec(function (err, groups) {
			cb(groups)
		});
	},
    //내가 작성한 글 전체 정보
    mygroup: function (user, cb) {
		this.find({user}).sort({createdAt: -1}).exec(function (err, groups) {
			cb(groups)
		});
	},
    //DB에 저장된 데이터 개수
    count: function (cb) {
		this.find({}).count().exec(function (err, count) {
			cb(count)
		});
	},
}

GroupstudySchema.path('subject').required(true, '주제는 필수사항입니다');
GroupstudySchema.path('content').required(true, '내용은 필수사항입니다');
GroupstudySchema.path('location').required(true, '도서관 위치는 필수사항입니다');

mongoose.model('Groupstudy', GroupstudySchema);
