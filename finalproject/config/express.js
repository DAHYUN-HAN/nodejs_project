/* app을 구동하기 위한 config 
   - 익스프레스 설정
*/

/* 필요 모듈 참조 */
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const hbsHelper = require('handlebars-helpers');
const ENV = require("../config/environment");

//쿠키모듈
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

//세션모듈
const session = require('express-session');
const mongoStore = require('connect-mongo');

const flash = require('connect-flash');

console.log('call: /config/express.js');

/* app.js 파일에서 "app"을 인자로 받음 */
module.exports = function (app, passport) {
    //bodyParser 미들웨어 등록(bodyParser를 사용해 요청 파라미터 파싱)
	app.use(bodyParser.json());//application/json 파싱
	app.use(bodyParser.urlencoded({//application/x-www-form-urlencoded 파싱
		extended: true
	}));

    //이미지,css,html 등 Resource 파일의 공유를 위한 폴더 설정
	app.use(express.static('public')); 

    /* 뷰 템플릿 엔진 및 옵션 설정(뷰 템플릿으로 사용할 핸들바 옵션 설정)
       - 사용자에게 응답할 웹 문서의 기본 형태를 뷰 템플릿 파일로 만들어 사용하는 것을 권장
       - 뷰 템플릿을 사용하면 웹 문서의 기본 형태는 뷰 템플릿으로 만들고,
         DB에서 조회한 데이터를, 템플릿 안에 선언된 데이터 바인딩 부분에 넣기만 하면 됨
       - 이렇게 뷰 템플릿을 사용해 웹 문서를 자동으로 생성한 후 응답을 보내는 역할을 하는 것이
         뷰 템플릿 엔진임       
    */
	const hbs = exphbs.create({
		extname: '.hbs',
		partialsDir: __dirname + '/../app/views/partials',//파셜 파일 경로
		defaultLayout: __dirname + '/../app/views/layouts/default.hbs',//디폴트 레이아웃
		layoutsDir: __dirname + '/../app/views/layouts',//레이아웃 파일 경로
        helpers: hbsHelper,
	}); //사용할 뷰 엔진의 option 설정
    
    require('handlebars-helpers')(hbs);
    app.engine('.hbs', hbs.engine);
    
    /* 쿠기설정 */
    app.use(cookieParser()); //쿠키사용을 설정합니다.
    app.use(cookieSession({secret: ENV.SESSION_SECRET})); //세션값을 쿠키에 담습니다.

    /* 세션을 저장할 곳을 설정  */
    /* 실무에서는 일반적으로 메모리DB(etc. redis) 사용하지만 실습에선 mongodb를 이용 */

    /* 몽고디비를 이용 */
    /*app.use(session({
        secret: ENV.SESSION_SECRET, //자신에 맞게 secret을 설정
        store: new mongoStore({ //세션데이터를 몽고에 저장하기때문에 mongo 접속정보
            url: ENV.DATABASE,
            collection: ENV.MONGO_SESSION_COLLECTION_NAME,
        }),
    }));*/

    //======= passport 초기화(3) ============//
    /* passport 사용을 위한 설정
       - passport 모듈의 initialize()함수와 session() 함수를 호출했을 때
         반환되는 객체를 미들웨어로 사용하도록 설정
    */
    app.use(passport.initialize()); //패스포트 초기화
    app.use(passport.session()); //패스포트 세션설정    
    //flash 메세지 미들웨어 등록
    app.use(flash());
    
     //뷰 템플릿 정의
	app.set('view engine', '.hbs'); //사용할 뷰 엔진을 정의
	app.set('views',path.join(__dirname,'/../app/views')); //뷰가 있는 디렉토리를 정의
    

};