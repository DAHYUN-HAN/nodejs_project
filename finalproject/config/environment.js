console.log('call : /config/environment.js');

module.exports = {
    PORT:4500,//포트번호
    DATABASE:"mongodb://localhost:27017/libraryDB",
    SERVICEKEY:"spIogpzyHT653IuGRUeM7ATfWrT7y25rWagxWFC/GX5i4Brt2D1gfv++O8RAeQILa61XvGKz1WhM9sqK+H9qyw==",
    MONGO_SESSION_COLLECTION_NAME:"sessions",
    SESSION_SECRET:"your_secret", //세션 암호화에 사용할 값 ->랜덤 숫자를 넣으면 됨.
    API_URL:"http://openapi-lib.sen.go.kr/openapi/service/lib/openApi",
 //   PAGINATION:{
 //       PAGE_SIZE:10
 //   }
};