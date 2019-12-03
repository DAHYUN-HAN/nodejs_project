// 회원 가입 및 로그인 인증 */

const mongoose = require("mongoose");
const Review = mongoose.model('Review');
//User 모델을 가져온다.
const User = mongoose.model('User');

console.log('call : /controllers/Authcontroller.js');

//login 라우팅 함수 설정 */
module.exports.login = async function (req, res) {
    console.log("로그인 위치");
    //성공했다면 req.flash().message가 담깁니다.
    //실패했다면 자동으로 에러메세지가  req.flash().error로 세팅되어받습니다.
    Review.select(function (reviews) {
        res.render('main/index', {//뷰 템플릿 랜더링(템플릿:index.hbs)
            pageTitle: "로그인", alert: req.flash(), reviews: reviews//students 객체를 템플릿에 바인딩
        });
    });
};

//signup 라우팅 함수 설정 */
module.exports.signup = async function (req, res) {
    res.render("user/signup", {pageTitle: "회원가입", alert: req.flash()});
};

//logout 라우팅 함수 설정 */
module.exports.logout = async function (req, res) {
    req.logout();
    res.redirect('/login');
};

module.exports.signout = async function (req, res) {
    User.remove({ email: req.user.email }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.status(204).end();
    })
    req.logout();
    res.redirect('/');
};

//DB(users 컬렉션)에 이메일과 비밀번호, salt 저장 라우팅 함수 설정 */
module.exports.create = async function (req, res) {
    new User({
        name: req.body.name,
        email: req.body.user_email,
        password: req.body.user_password,
    }).save((err) => {// DB에 저장
        if (err) {
            req.flash('message', err.message);
            res.redirect('/signup');
        } else {
            req.flash('message', "회원가입성공");
            res.redirect('/login');
        }

    });
};
//requiresLogin 라우팅 함수 설정 */
// 인증을 통해 로그인 되어 있어여 다음을 실행하고,
// 아니면 '/login'으로 리다이렉트
// 예) app.get("/reqInfo", auth.requiresLogin,marketReqInfo.index);
module.exports.requiresLogin = async (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.redirect('/login');
};

//checkUserLogin 라우팅 함수 설정 ???? */
module.exports.checkUserLogin = async function (req, res) {
    /* 세션에 redirect가 저장되어 있다면 해당 페이지를 보여줍니다.*/
    /* 현재 샘플에선 구현이 되어있진 않지만 쇼핑몰의 경우 현재 보고 있는 상품을
    장바구니에 누른 후 로그인 요청창이 뜨는경우 로그인을 한 후에도 계속 보고있던 상품을 보도록합니다.
    아래 코드의 경우 sessions에 returnTo가 설정되어있다면 해당주소로, 없다면 rootpath('/')로 이동합니다.
     */
    const redirectTo = req.session.returnTo
        ? req.session.returnTo
        : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};


