const libraryList = require('../config/libraryData');

console.log('call : /helper/utlity.js');

//도서관 코드로 도서관 이름 가져오기
module.exports.getCodeByName = function(code){
    return libraryList.filter(function(data){
        return data.title == code;
    })[0].code;
};