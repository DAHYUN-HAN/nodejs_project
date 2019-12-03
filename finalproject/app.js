/* 파일 구조를 전형적인 MVC 패턴으로 구현
    - start page : index.hbs
*/

// 필요 모듈 참조
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

//사용자 인증 처리에 필요한 기본 기능을 제공하는 모듈
const passport = require('passport');

/* 'app/models' 폴더를 정적(static)폴더(공유폴더) 로 설정 */
const join = require('path').join;//파일 경로 조인
const models = join(__dirname, 'app/models');// 'app/models' 경로 설정

/* 익스프레스 객체 생성 */
const app = express();

/* 몽고디비연결 포트 번호 설정 */
const port = 4500;
app.use(express.static((__dirname,"public")));

mongoose.connect('mongodb://localhost:27017/libraryDB');

console.log('call: app.js');

/* models 폴더에 있는 모든 파일을  일괄참조(require) 처리*/
// filter() 메서드 : 조건에 만족하는 요소만 뽑아 새로운 배열 생성
fs.readdirSync(models)
  //.filter(file => ~file.search(/^[^\.].*\.js$/))//정규식 패턴에 일치하는 문자열을 찾아 반환
  .filter(file => ~file.indexOf('.js'))//".js"을포함하는 파일을 찾으면 truly 값 반환  
  .forEach(file => require(join(models, file)));//forEach문은 무조건 비동기방식으로 동작함
/* 간편하게 사용법
   - require('./app/models/student');
   - require('./app/models/uploads');
*/
 
/* express/routes 모듈 참조  
   - express/routes 모듈을 참조하고, 'app' 객체(익스프레스객체)를 
     해당 모듈의 함수의 매개변수로 전달함
*/
require('./config/passport/passport')(passport);
require('./config/express')(app,passport);
require('./config/routes')(app,passport);
require('./config/environment');

/* 익스프레스 서버 시작 */
app.listen(port, () => {
	console.log('Sever running on port : %s', port);
});