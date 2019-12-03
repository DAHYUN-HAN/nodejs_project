/* 라우팅 함수 선언[main] */

/* mongoose 모듈 참조 */
const mongoose = require('mongoose');
//mongoose.Promise = Promise;

/* Model 불러오기*/
const User = mongoose.model('User');
const Review = mongoose.model('Review');
const Food = mongoose.model('Food');
const Groupstudy = mongoose.model('Groupstudy');
const Study = mongoose.model('Study');
const Messages = mongoose.model('Messages');
const only = require('only');//object중 원하는 데이터만 sorting하여 리턴하는 helper 모듈

var status = new Object();
status={"print":"메인화면", "link":"location.href ='/'"};//로그인을 했을 경우 어떤 화면에서든 메인화면으로 돌아올 수 있게 함

console.log('call : /controllers/main.js');

//웹 메인 화면 index. 주요 기능 집합 화면
exports.index = function (req, res) {
    const isLogin = req.isAuthenticated(); //로그인 여부 확인.
    var statusi = new Object(); //index 화면에서는 로그인시 마이페이지로 갈 수 있게 함.
    Review.select(function (reviews) { //작성된 리뷰들 중 3개만 추출하여 화면에 표시
        if(isLogin) {
            User.load(req.user.email, function (user) { //로그인 한 사용자 정보
                if(user.admin){//관리자가 로그인 했다면 관리자 모드로 연결할 수 있게 함.
                    statusi={"print":"관리자모드", "link":"location.href ='/adminpage'"};
                } else {//일반 사용자가 로그인 했다면 마이페이지로 연결할 수 있게 함.
                    statusi={"print":"개인서재", "link":"location.href ='/mypage'"};
                }
                res.render('main/index', {//index.hbs와 랜더링
                    reviews: reviews, isUserLogedIn: isLogin, user: user, status:statusi
                });
            });
        } else {
            res.render('main/index', {
                reviews: reviews, isUserLogedIn: isLogin
            });
        }
    });
};

//관리자 페이지
exports.adminpage = function (req, res) {
    const isLogin = req.isAuthenticated();
    Messages.list(function (messages) {
        if(isLogin) {
            User.load(req.user.email, function (user) {
                User.list(function (users) {
                    res.render('main/adminpage', {
                        messages:messages, isUserLogedIn: isLogin, user: user, status:status, users:users
                    });
                });
            });
        }
    });
};

//개인 서재 페이지
exports.mypage = function (req, res) {
    const isLogin = req.isAuthenticated();
    Messages.receivelist(req.user.email, function (receivemessages) { //받은 쪽지 목록
        Messages.sendlist(req.user.email, function (sendmessages) { //보낸 쪽지 목록
            if(isLogin) {
                User.load(req.user.email, function (user) {
                    Review.mylist(req.user.email, function (myreviews) { //내가 쓴 리뷰 목록
                        Food.myfood(req.user.email, function (myfoods) { //내가 쓴 밥 메이트 글 목록
                            Study.mystudy(req.user.email, function (mystudies) { //내가 쓴 공부 메이트 글 목록
                                Groupstudy.mygroup(req.user.email, function (mygroups) { //내가 쓴 스터디 모집 글 목록
                                    res.render('main/mypage', {
                                        receivemessages:receivemessages, sendmessages:sendmessages, isUserLogedIn: isLogin, user: user, status:status, myreviews:myreviews, myfoods:myfoods, mystudies:mystudies, mygroups:mygroups, alert: req.flash()
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    });
};

exports.deletefood = function (req, res) {
    // deletefood 컬렉션에서 해당 documents(레코드) 삭제
    Food.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
    });
};

exports.deletestudy = function (req, res) {
    // deletestudy 컬렉션에서 해당 documents(레코드) 삭제
    Study.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
    });
};

exports.deletegroup = function (req, res) {
    // deletegroup 컬렉션에서 해당 documents(레코드) 삭제
    Groupstudy.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
    });
};

exports.deletesend = function (req, res) {
    // students 컬렉션에서 해당 documents(레코드) 삭제
    Messages.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
    });
};

//마이페이지에서 확인한 쪽지에 답장을 보내는 경우 실행
exports.reply = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('friends/reply', {
                isUserLogedIn: isLogin, user: user, status:status, receiver:req.params.receiver, sender:req.params.sender
            });
        });
    }
};

//답장 정보 저장
exports.sendreplymessage = function (req, res) {
    const messages = new Messages(only(req.body, 'content receiver sender'));
    messages.save(function (err, result) {
        if (err) {
            res.sendStatus(400)
        }
        res.redirect('/mypage');
    });
};