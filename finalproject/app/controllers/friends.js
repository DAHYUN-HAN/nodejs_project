/* 라우팅 함수 선언[friends] */
/* mongoose 모듈 참조 */
const mongoose = require('mongoose');

/* Model 불러오기*/
const User = mongoose.model('User');
const Food = mongoose.model('Food');
const Groupstudy = mongoose.model('Groupstudy');
const Study = mongoose.model('Study');
const Messages = mongoose.model('Messages');
const only = require('only');

var status = new Object();
status={"print":"메인화면", "link":"location.href ='/'"};

console.log('call : /controllers/friends.js');

//friends 요청 시 Food, Study, GroupStudy 모델에서 정보를 가져와서 화면에 보여줌.
exports.friends = function (req, res) {
    const isLogin = req.isAuthenticated();
    Food.count(function(totalCount) {
        var page = parseInt(req.body.pageNo);
        
        //body에 pageNo 정보가 없는 경우는 정보의 첫번째 페이지 이므로 1로 세팅.
        if(!page) {
            page = 1;
        }
        var pageArray = setpage(totalCount, page);
        var print = setprint(pageArray, page);   
        var last5 = (parseInt(totalCount/50)*5);
        
        //페이지 넘버를 5개씩 스킵하는 화살표 비활성화 여부 판단
        if(page <= 5) {
            var first1 = "disabled";
            var second = "";
            if(last5 < 5){
                var first1 = "disabled";
                var second = "disabled";
            }
        } else if(page > last5) {
            var first1 = "";
            var second = "disabled";
        } else {
            var first1 = "";
            var second = "";
        }
        
        Food.list10(page, function (foods) {
            Study.count(function(totalCount) {
                var page2 = parseInt(req.body.pageNo2);
                if(!page2) {
                    page2 = 1;
                }
                
                var pageArray2 = setpage(totalCount, page2);
                var print2 = setprint(pageArray2, page2);        
                var last52 = (parseInt(totalCount/50)*5);
                
                if(page2 <= 5) {
                    var first2 = "disabled";
                    var second2 = "";
                    if(last52 < 5){
                        var first2 = "disabled";
                        var second2 = "disabled";
                    }
                } else if(page2 > last52) {
                    var first2 = "";
                    var second2 = "disabled";
                } else {
                    var first2 = "";
                    var second2 = "";
                }
                
                Study.list10(page2, function (studys) {
                    Groupstudy.count(function(totalCount) {
                        var page3 = parseInt(req.body.pageNo3);
                        if(!page3) {
                            page3 = 1;
                        }
                        var pageArray3 = setpage(totalCount, page3);
                        var print3 = setprint(pageArray3, page3);  
                        var last53 = (parseInt(totalCount/50)*5);
                        
                        if(page3 <= 5) {
                            var first3 = "disabled";
                            var second3 = "";
                            if(last53 < 5){
                                var first3 = "disabled";
                                var second3 = "disabled";
                            }
                        }
                        
                        else if(page3 > last52) {
                            var first3 = "";
                            var second3 = "disabled";
                        }   
                        else {
                            var first3 = "";
                            var second3 = "";
                        }
                        
                        Groupstudy.list10(page3, function (groupstudys) {
                            if(isLogin) {
                                User.load(req.user.email, function (user) {
                                    res.render('friends/friends', {
                                        foods: foods, studys: studys, groupstudys: groupstudys, isUserLogedIn: isLogin, user: user, status:status, print: print, pageNo: page, second: second, first1: first1, print2: print2, pageNo2: page2, first2: first2, second2: second2, pageNo3: page3, first3: first3, second3: second3, print3: print3, pageNo3: page3
                                    });
                                });
                            } else {
                                res.render('friends/friends', {
                                    foods: foods, studys: studys, groupstudys: groupstudys, isUserLogedIn: isLogin, status:status, print: print, pageNo: page, second: second, first1: first1, print2: print2, pageNo2: page2, first2: first2, second2: second2, pageNo3: page3, first3: first3, second3: second3, print3: print3, pageNo3: page3
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};

//혼밥 메이트 관련 쪽지
exports.foodmessage = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        Food.load(req.params.email, function (food) { //쪽지를 받는 사람 정보가 필요함.
            User.load(req.user.email, function (user) { //쪽지를 보내는 사람 정보가 필요함.
                res.render('friends/message', {
                    isUserLogedIn: isLogin, user: user, status:status, db:food
                });
            });
        });
    } else {
        req.flash('message', "로그인이 필요합니다."); //쪽지 보내기는 로그인이 되어 있는 경우에만 사용 가능.
        res.redirect('/login');
    }
};

//공부 메이트 관련 쪽지
exports.studymessage = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        Study.load(req.params.email, function (study) {
            User.load(req.user.email, function (user) {
                res.render('friends/message', {
                    isUserLogedIn: isLogin, user: user, status:status, db:study
                });
            });
        });
    } else {
        req.flash('message', "로그인이 필요합니다.");
        res.redirect('/login');
    }
};

//스터디 관련 쪽지
exports.groupstudymessage = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        Groupstudy.load(req.params.email, function (groupstudy) {
            User.load(req.user.email, function (user) {
                res.render('friends/message', {
                    isUserLogedIn: isLogin, user: user, status:status, db:groupstudy
                });
            });
        });
    } else {
        req.flash('message', "로그인이 필요합니다.");
        res.redirect('/login');
    }
};

//쪽지 보내기를 실행하면 쪽지 내용, 수신자, 발신자를 DB에 저장한다.
exports.sendmessage = function (req, res) {
    const messages = new Messages(only(req.body, 'content receiver sender'));
    messages.save(function (err, result) {
        if (err) {
            res.sendStatus(400)
        }
        res.redirect('/friends');
    });
};

//혼밥 메이트 구하는 글 작성
exports.writefood = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('friends/writefood', {
                isUserLogedIn: isLogin, user: user, status:status
            });
        });
    } else {
        res.render('friends/writefood', {
            isUserLogedIn: isLogin
        });
    }
};

//공부 메이트 구하는 글 작성
exports.writestudy = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('friends/writestudy', {
                isUserLogedIn: isLogin, user: user, status:status
            });
        });
    } else {
        res.render('friends/writestudy', {
            isUserLogedIn: isLogin
        });
    }
};

//스터디 메이트 구하는 글 작성
exports.writegroupstudy = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('friends/writegroupstudy', {
                isUserLogedIn: isLogin, user: user, status:status
            });
        });
    } else {
        res.render('friends/writegroupstudy', {
            isUserLogedIn: isLogin
        });
    }
};

//혼밥 메이트 글 DB에 저장
exports.storefood = function (req, res) {
    //form 으로부터 도서관 위치, 음식 종류, 내용, 작성자 정보를 가져와 객체 생성
    const food = new Food(only(req.body, 'location food content user'));
    food.save(function (err, result) {//생성된 객체를 DB에 저장
        if (err) {
            res.sendStatus(400)
        }
        res.redirect('/friends#food');//저장이 완료 되면 혼밥 글 목록을 보여줌
    });
};

//공부 메이트 글 DB에 저장
exports.storestudy = function (req, res) {
    //form 으로부터 도서관 위치, 공부 대상, 내용, 작성자 정보를 가져와 객체 생성
    const study = new Study(only(req.body, 'location target content user'));
    study.save(function (err, result) {//생성된 객체를 DB에 저장
        if (err) {
            res.sendStatus(400)
        }
        res.redirect('/friends#study');//저장이 완료 되면 공부 글 목록을 보여줌
    });
};

//스터디 모집 글 DB에 저장
exports.storegroupstudy = function (req, res) {
    //form 으로부터 도서관 위치, 스터디 주제, 내용, 작성자 정보를 가져와 객체 생성
    const groupstudy = new Groupstudy(only(req.body, 'location subject content user'));
    groupstudy.save(function (err, result) {//생성된 객체를 DB에 저장
        if (err) {
            res.sendStatus(400)
        }
        res.redirect('/friends#groupstudy');//저장이 완료 되면 스터디 글 목록을 보여줌
    });
};

function setpage(totalCount, page) {
    var last5 = (parseInt(totalCount/50)*5);
    var last = (parseInt((totalCount-1)/10)+1);
    
    if(page <= last5) {
        var defaultpage = (parseInt((page-1)/5)*5+1);
        var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3, defaultpage+4 ];
    } else {
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
    return pageArray;
}

function setprint(pageArray, page){
    var print = new Object();
    for(var i=0; i<pageArray.length; i++) {
        if(page == pageArray[i]) {
            print[i] = { "page": pageArray[i], "Status": "active" };
        } else {
            print[i] = { "page": pageArray[i], "Status": "" };
        }
    }
    return print;
}