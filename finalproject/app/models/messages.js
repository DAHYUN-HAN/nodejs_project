const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;

const MessagesSchema = new Schema({
    content: {type: String, default: '', trim: true},//내용
    receiver: {type: String, default: '', trim: true},//받는 사람
    sender: {type: String, default: '', trim: true},//보내는 사람
	createdAt: {type: Date, default: Date.now}//작성 시간
});

MessagesSchema.statics = {
    //선택한 쪽지 정보
	load: function (_id, cb) {
		this.findOne({_id})
		    .exec(function (err, message) {
			    cb(message)
		    });
	},
    //전체 글 정보
	list: function (cb) {
		this.find({}).sort({createdAt: -1}).exec(function (err, messages) {
			cb(messages)
		});
	},
    //받는 사람 정보
    receivelist: function (receiver, cb) {
		this.find({receiver}).sort({createdAt: -1}).exec(function (err, messages) {
			cb(messages)
		});
	},
    //보내는 사람 정보
    sendlist: function (sender, cb) {
		this.find({sender}).sort({createdAt: -1}).exec(function (err, messages) {
			cb(messages)
		});
	},
}

MessagesSchema.path('receiver').required(true, '받는 사람은 필수사항입니다');
MessagesSchema.path('content').required(true, '내용은 필수사항입니다');
MessagesSchema.path('sender').required(true, '보내는 사람은 필수사항입니다');

mongoose.model('Messages', MessagesSchema);
