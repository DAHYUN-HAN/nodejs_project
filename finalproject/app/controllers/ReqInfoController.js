const libraryList = require('../../config/libraryData');
const {getCodeByName} = require('../../helper/utility');
const {API_URL, SERVICEKEY} = require('../../config/environment');
const request = require('request-promise');
const only = require('only');
const mongoose = require('mongoose');
const User = mongoose.model('User');

console.log('call : /controllers/ReqInfoController.js');

//도서 검색
module.exports.bookresult = async function (req, res) {
    const libraryResult = await request.get({
        url: API_URL,
        timeout: 10000,
        json: true,
        qs: {
            'serviceKey': SERVICEKEY,
            'title': req.body.title,
            'manageCd': req.body.manageCd,
            'numOfRows': req.body.numOfRows,
            'pageNo': req.body.pageNo,
            '_type': "json",
        },
    }).then((result) => {        
        return result.response.body //api 통신에 성공하면 정보를 libraryResult에 저장
    }).catch(e => {
        console.error("request Error : " + e)
    });
    
    //검색된 전체 도서 갯수를 통해 페이징 구현
    var last5 = (parseInt(libraryResult.totalCount/50)*5);
    var last = ((parseInt((parseInt(libraryResult.totalCount))-1)/10)+1);

    var page = parseInt(req.body.pageNo);
    if(page <= last5) {
        var defaultpage = (parseInt((page-1)/5)*5+1);
        var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3, defaultpage+4 ];
    }
    else {
        var etc = last-last5;
        var defaultpage = (parseInt((page-1)/5)*5+1);
        switch(etc) {
            case 1:
                var pageArray = [ defaultpage];
                break;
            case 2:
                var pageArray = [ defaultpage, defaultpage+1];
                break;
            case 3:
                var pageArray = [ defaultpage, defaultpage+1, defaultpage+2];
                break;
            case 4:
                var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3];
                break;
        }
    }
    
    var print = new Object();
    for(var i=0; i<pageArray.length; i++) {
        if(parseInt(req.body.pageNo) == pageArray[i]) {
            print[i] = { "page": pageArray[i], "Status": "active" };
        } else {
            print[i] = { "page": pageArray[i], "Status": "" };
        }
    }
    if(parseInt(req.body.pageNo) <= 5) {
        var first = "disabled";
        var second = "";
    } else if(parseInt(req.body.pageNo) > last5) {
        var first = "";
        var second = "disabled";
    } else {
        var first = "";
        var second = "";
    }
    
    const isLogin = req.isAuthenticated();    
    if(isLogin) {
        User.load(req.user.email, function (user) {
            var status = new Object();
            status={"print":"메인화면", "link":"location.href ='/'"};
            res.render('librarys/bookresult', {
                libraryResult: libraryResult, title: req.body.title, manageCd: req.body.manageCd, print: print, pageNo: req.body.pageNo, first: first, second: second, library: req.body.library, isUserLogedIn: isLogin, user: user, status:status
            });
        });
    } else {
        res.render('librarys/bookresult', {
            libraryResult: libraryResult, title: req.body.title, manageCd: req.body.manageCd, print: print, pageNo: req.body.pageNo, first: first, second: second, library: req.body.library, isUserLogedIn: isLogin
        });
    }
};

