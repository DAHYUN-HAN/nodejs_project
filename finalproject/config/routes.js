/* app을 구동하기 위한 라우팅 함수 등록
   - controllers 폴더에 있는
   AuthController.js
   friends.js
   librarys.js
   main.s
   ReqInfoController.js
   reviews.js
   참조
*/

const auth = require("../app/controllers/AuthController");

//관련 모듈 참조
const librarys = require('../app/controllers/librarys');
const friends =  require('../app/controllers/friends');
const main =  require('../app/controllers/main');
const reviews =  require('../app/controllers/reviews');
const ReqInfoController = require('../app/controllers/ReqInfoController');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

console.log('call: /config/routes.js');

/* multer.diskStorage() 메서드로 파일 업로드를 위한 multer 설정*/
const storage = multer.diskStorage({
	// 업로드할 폴더
	destination: './public/uploads/',
	/*저장할 파일명의 중복울 막기 위해 filename 속성으로 고유한 파일이름으로 변경 */
	filename: function (req, file, cb) {
        console.log("file: ", file);
        console.log("cb: ", cb);
        
		/* ObjectId()는 절대로 중복될 수 없도록 고안된 값(저장시 파일명 중복 방지)*/
		file.uploadedFile = {
			name: mongoose.Types.ObjectId(),
			ext: file.mimetype.split('/')[1]
		};
        //cb(null, 저장파일명)
		cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
	}
});

// multer 설정값을 바탕으로 초기화를 진행합니다. 
const uploads = multer({ storage: storage });

// 라우팅 함수 설정
/* app.js 파일에서 "app"을 인자로 받음 */
module.exports = function (app, passport){
	app.get('/', main.index);//홈페이지 메인 화면
    app.get('/mypage', main.mypage);//개인서재 화면
    app.get('/adminpage', main.adminpage);//관리자 화면
    app.post('/deletefood', main.deletefood);//혼밥 글 삭제
    app.post('/deletestudy', main.deletestudy);//혼공 글 삭제
    app.post('/deletegroup', main.deletegroup);//스터디 글 삭제
    app.post('/deletesend', main.deletesend);//보낸 쪽지 삭제
    app.post('/sendreplymessage', main.sendreplymessage);//쪽지 답장 보내기
    app.get('/reply/:receiver/:sender', main.reply);//쪽지 답장 보내기

    app.get('/writefood', friends.writefood);//혼밥 글 작성
    app.get('/writestudy', friends.writestudy);//혼공 글 작성
    app.get('/writegroupstudy', friends.writegroupstudy);//스터디 글 작성
    app.get('/foodmessage/:email', friends.foodmessage);//혼밥 쪽지 보내기
    app.get('/studymessage/:email', friends.studymessage);//혼공 쪽지 보내기
    app.get('/groupstudymessage/:email', friends.groupstudymessage);//스터디 쪽지 보내기
    app.get('/friends', friends.friends);//친구 구하기 화면
    app.post('/friends', friends.friends);
    app.post('/storefood', friends.storefood);//혼밥 글 저장
    app.post('/storestudy', friends.storestudy);//혼공 글 저장
    app.post('/storegroupstudy', friends.storegroupstudy);//스터디 글 저장
    app.post('/sendmessage', friends.sendmessage);//쪽지 보내기
    
    app.get('/librarys/:title', librarys.librarys);//선택한 도서관 정보 화면
    
    app.post('/review', reviews.review);//리뷰 목록 화면
    app.get('/review', reviews.review);
    app.get('/writereview', reviews.writereview);//리뷰 쓰기화면
	app.get('/readreview/:id', reviews.readreview);//리뷰 읽기화면
	app.post('/storereview', uploads.any(),reviews.storereview);//리뷰 저장
	app.get('/editreview/:id', reviews.editreview);//리뷰 수정하기
	app.post('/updatereview',uploads.any(),reviews.updatereview);//수정된 리뷰 저장
	app.post('/deletereview', reviews.deletereview);//리뷰 삭제를 위한 라우팅
    
    
    app.post('/bookresult', ReqInfoController.bookresult);//도서 검색 화면
    
    app.get('/login', auth.login);//로그인
    app.get('/signup', auth.signup);//회원가입
    app.get('/logout', auth.logout);//로그아웃
    app.get('/signout', auth.signout);//회원탈퇴
    
    /* form 유저로그인 */
    app.post("/login_user", passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect: '/login',
        failureFlash:true
    }),auth.checkUserLogin);
    
    /*회원 탈퇴*/
    app.post("/signout_user", passport.authenticate('local', {
        
        successRedirect : '/signout',
        failureRedirect: '/mypage#signout',
        failureFlash:true
    }));

    /* 유저생성*/
    app.post('/create', auth.create);
};