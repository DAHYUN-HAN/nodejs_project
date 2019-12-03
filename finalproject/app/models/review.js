const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;

console.log('call: /models/review.js');

const ReviewSchema = new Schema({
	title: {type: String, default: '', trim: true},//한줄평
	book: {type: String, default: '', trim: true},//책 제목
    author: {type: String, default: '', trim: true},//저자
    publisher: {type: String, default: '', trim: true},//출판사
    content: {type: String, default: '', trim: true},//내용
    user: {type: String, default: ''},//작성자 정보
	photo: {type : Schema.ObjectId, ref: 'Upload'},//사진
	createdAt: {type: Date, default: Date.now}//작성 시간
});


ReviewSchema.statics = {
    //선택한 글 정보
	load: function (_id, cb) {
		this.findOne({_id})
		    .populate('photo')
		    .exec(function (err, review) {
			    cb(review)
		    });
	},
    //10개 단위 글 정보
    list10: function (num, cb) {
		this.find({}).sort({createdAt: -1}).skip(10*(num-1)).limit(10).exec(function (err, reviews) {
			cb(reviews)
		});
	},
    //내가 작성한 글 전체 정보
    mylist: function (user, cb) {
		this.find({user}).sort({createdAt: -1}).exec(function (err, reviews) {
			cb(reviews)
		});
	},
    //내가 작성한 10개 단위 글 정보
    mylist10: function (user, num, cb) {
		this.find({user}).sort({createdAt: -1}).skip(10*(num-1)).limit(10).exec(function (err, reviews) {
			cb(reviews)
		});
	},
    //최근에 작성된 3개의 글 정보
    select: function (cb) {
		this.find({}).sort({createdAt: -1}).populate('photo').limit(3).exec(function (err, reviews) {
			cb(reviews)
		});
	},
    //DB에 저장된 데이터 개수
    count: function (cb) {
		this.find({}).count().exec(function (err, count) {
			cb(count)
		});
	},
    
    //DB에 저장된 내가 작성한 글 개수
    mycount: function (user, cb) {
		this.find({user}).count().exec(function (err, count) {
			cb(count)
		});
	},
}

ReviewSchema.path('title').required(true, '제목은 필수사항입니다');
ReviewSchema.path('book').required(true, '책 이름은 필수사항입니다');
ReviewSchema.path('author').required(true, '저자는 필수사항입니다.');
ReviewSchema.path('publisher').required(true, '출판사명은 필수사항입니다');
ReviewSchema.path('content').required(true, '내용은 필수사항입니다');

mongoose.model('Review', ReviewSchema);
