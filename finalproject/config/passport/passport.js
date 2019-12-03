/*  사용할 인증 방식 등록
  - 인증 후 사용자 정보를 세션에 저장하거나 사용자 정보를 복원하는 모듈 */

/* 인증 방식 설정 파일 참조
   - 인증 방식별로 설정 파일을 만들어 스트래티지를 선언해야함
*/
const local = require('./local');//로컬 스트래티지
const LocalStrategy = require('passport-local').Strategy;

console.log('call : /config/passport/passport.js');

module.exports = function (passport) {

    /* 사용자 인증에 성공했을 때 호출되는 serializeUser() 콜백 함수는 
       전달받은 user.email 객체의 정보를 콘솔에 출력하고 done() 메소드를 호출함
       - done() 메소드의 두번째 파라미터로 user.email 객체를 전달하면,
         이 객체는 그 다음에 처리할 함수쪽으로 전달됨 
       - 즉, 인증을 통해 로그인에 성공하였다면 이쪽에서 어떤 사용자 정보를 세션에 저장할지 설정해줍니다.*/
    passport.serializeUser(function (user, done) {
        console.log('passport.serializeUser()  호출 : ' + user.email);
        done(null, user.email)//user.email을 세션에 저장하는 done()
    });

    /* 사용자 인증 이후 사용자 요청이 있을 때마다 호출됨 - 로그인 상태인 경우 */
    /* 사용자로부터 받은 세션정보와 실제 DB의 데이터와 비교하여줍니다.*/
    /* 세션값과 나의 값을 체크해줌으로써 보안을 위한 기능입니다. */
    passport.deserializeUser(function (email, done) {
        console.log('passport.deserializeUser()  호출 : ' + email);
        const profile = {email: email};
        done(null, profile);//세션 상태인지를 계속 체크해서 필요한 처리
    });

    // 사용하기 위해 참조한 인증방식을 미들웨어로 등록
    passport.use(local);
};
