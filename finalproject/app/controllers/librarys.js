/* 라우팅 함수 선언[librarys] */

/* mongoose 모듈 참조 */
const mongoose = require('mongoose');
//mongoose.Promise = Promise;

/* Model 불러오기*/
const User = mongoose.model('User');
const Food = mongoose.model('Food');
const only = require('only');//object중 원하는 데이터만 sorting하여 리턴하는 helper 모듈

const {getCodeByName} = require('../../helper/utility');

var status = new Object();
status={"print":"메인화면", "link":"location.href ='/'"};

console.log('call : /controllers/librarys.js');

//도서관 정보 화면
exports.librarys = function (req, res) {
    const isLogin = req.isAuthenticated();
    var title = req.params.title;
    var code = getCodeByName(req.params.title);   
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('librarys/librarys', {//뷰 템플릿 랜더링(템플릿:index.hbs)
                title: title, code: code, isUserLogedIn: isLogin, user: user, status:status//students 객체를 템플릿에 바인딩
            });
        });
    } else {
        res.render('librarys/librarys', {//뷰 템플릿 랜더링(템플릿:index.hbs)
            title: title, code: code, isUserLogedIn: isLogin//students 객체를 템플릿에 바인딩
        });
    }
};

