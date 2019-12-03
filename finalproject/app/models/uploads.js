/* 사진 업로드 스키마 선언[1] */

//strict 모드 선언 : 엄격한 문법 검사 키워드
'use strict';

/* mongoose, Schema 모듈 참조 */
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

console.log('call : /models/uploads.js');


const UploadSchema = new Schema({
	relatedId: { type : Schema.ObjectId}, 
	type: { type : String},
	filename: { type : String},
	originalname: { type : String},
	size: { type : Number},
	createdAt  : { type : Date, default : Date.now }
});


UploadSchema.path('relatedId').required(true, 'Article title cannot be blank');
UploadSchema.path('filename').required(true, 'Article body cannot be blank');
UploadSchema.path('originalname').required(true, 'Article body cannot be blank');
UploadSchema.path('size').required(true, 'Article body cannot be blank');

mongoose.model('Upload', UploadSchema);
