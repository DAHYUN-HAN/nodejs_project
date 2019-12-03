/* 라우팅 함수 선언[reviews] */

/* mongoose 모듈 참조 */
const mongoose = require('mongoose');
//mongoose.Promise = Promise;

/* Model 불러오기*/
const User = mongoose.model('User');
const Review = mongoose.model('Review');
const Upload = mongoose.model('Upload');
const only = require('only');//object중 원하는 데이터만 sorting하여 리턴하는 helper 모듈

var status = new Object();
status={"print":"메인화면", "link":"location.href ='/'"};

console.log('call : /controllers/reviews.js');

//도서 리뷰 화면
exports.review = function (req, res) {
    const isLogin = req.isAuthenticated();
    Review.count(function(totalCount) {//저장된 전체 리뷰 개수
        var page = parseInt(req.body.pageNo);//보고싶은 리뷰 페이지 번호
        if(!page) {
            page = 1;//페이지 번호가 지정되지 않았다면 1페이지를 보여줌.
        }
        var pageArray = setpage(totalCount, page);//총 페이지 개수
        var print = setprint(pageArray, page);//현재 페이지 정보=active
        var last5 = (parseInt(totalCount/50)*5);//전체 페이지를 5 단위로 나누었을때 나오는 마지막 페이지 첫 시작 페이지
        
        if(page <= 5) {//만약 현재 페이지가 5페이지 이하라면 이전페이지로 넘어가는 버튼 비활성화.
            var first1 = "disabled";
            var second = "";
            if(last5 < 5){//만약 현재 페이지가 5페이지 이하이고, 마지막 페이지도 5페이지를 넘지 않는다면 다음페이지로 넘어가는 버튼 역시 비활성화.
                var first1 = "disabled";
                var second = "disabled";
            }
        } else if(page > last5) { //현재 페이지가 마지막 첫 페이지 이상이라면 다음 페이지 버튼 비활성화.
            var first1 = "";
            var second = "disabled";
        } else { //모두 아니라면 이전페이지, 다음 페이지 버튼 모두 활성화.
            var first1 = "";
            var second = "";
        }
        Review.list10(page, function (reviews) { //전체 리뷰를 현재 페이지에 들어갈 내용들로만 10개 가져오기.
            if(isLogin) {
                User.load(req.user.email, function (user) {
                    Review.mycount(req.user.email, function(mytotalCount) { //저장된 내가 작성한 리뷰 개수
                        var last52 = (parseInt(mytotalCount/50)*5);
                        var page2 = parseInt(req.body.pageNo2);
                        if(!page2) {
                            page2 = 1;
                        }
                        var pageArray2 = setpage(mytotalCount, page2);
                        var print2 = setprint(pageArray2, page2);   
                        if(page2 <= 5) {
                            var first2 = "disabled";
                            var second2 = "";
                            if(last52 < 5){
                                var first2 = "disabled";
                                var second2 = "disabled";
                            }
                        }
                        else if(page2 > last52) {
                            var first2 = "";
                            var second2 = "disabled";
                        }   
                        else {
                            var first2 = "";
                            var second2 = "";
                        }
                        //내가 작성한 리뷰를 현재 페이지에 들어갈 내용들로만 10개 가져오기.
                        Review.mylist10(req.user.email, page2, function (myreviews) {
                            res.render('reviews/review', {
                                reviews: reviews, isUserLogedIn: isLogin, user: user, status:status, myreviews:myreviews, print: print, pageNo: page, second: second, first1: first1, print2: print2, pageNo2: page2, first2: first2, second2: second2
                            });
                        });
                    });
                });
            } else {
                res.render('reviews/review', {
                    reviews: reviews, isUserLogedIn: isLogin, print: print, pageNo: page, first: first, second: second
                });
            }
        });
    });
};

//리뷰 작성 화면
exports.writereview = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('reviews/writereview', {
                isUserLogedIn: isLogin, user: user, status:status
            });
        });
    } else {
        res.render('reviews/writereview', {
            isUserLogedIn: isLogin
        });
    }
};

//선택한 리뷰 읽는 화면
exports.readreview = function (req, res) {
    const isLogin = req.isAuthenticated();
    Review.load(req.params.id, function (review) { //id를 토대로 읽고자 하는 리뷰 한개 가져오기.
    if(isLogin) {
        User.load(req.user.email, function (user) {
            if(review.user == req.user.email) { //작성자라면 게시글의 수정 및 삭제가 가능하게 함.
                var showstatus="showspan";
            } else if(user.admin){ //관리자라면 게시글의 수정 및 삭제가 가능하게 함.
                var showstatus="showspan";
            } else { //권한이 없다면 수정 및 삭제가 불가능하도록 수정 삭제 버튼을 숨김.
                var showstatus="hidespan";
            }
            res.render('reviews/readreview', {
                review: review, isUserLogedIn: isLogin, user: user, status:status, showstatus:showstatus
            });
        });
    } else {
        var showstatus="hidespan"; //로그인을 하지 않았다면, 글을 수정 및 삭제 할 수 있는 권한이 없음.
        res.render('reviews/readreview', {
            review: review, isUserLogedIn: isLogin, status:status, showstatus:showstatus
        });
    }
    });
};

//리뷰 저장
exports.storereview = function (req, res) {
    //form 으로부터 한줄평, 책 제목, 저자, 출판사, 내용, 작성자 정보를 가져옴.
    const review = new Review(only(req.body, 'title book author publisher content user'));
    //review DB에 저장
    review.save(function (err, result) {
        if (err) {
            /* Client Validation도 무시한 후 데이터가 들어온 경우 400코드 전송*/
            res.sendStatus(400)
        }
        /* 업로드한 파일이 있으면 */
        if (req.files.length > 0) {
            /* 업로드한 파일을 확인하여 데이터베이스에 저장 */
            req.files.forEach(function (file) {
                //업로드 모델(upload) 생성
                const upload = new Upload({
                    relatedId: result,
                    type: "review_photo",//업로드 파일 구분 카테고리
                    filename: file.filename,
                    originalname: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                });

                //데이터베이스에 사진 저장(uploads 컬렉션)
                upload.save(function (err, result) {
                    review.photo = result;
                    review.save();
                });
            });
        }
        res.redirect('/review'); //저장이 완료되면 review화면을 보여줌.
    });
};



// 리뷰 수정 화면
exports.editreview = function (req, res) {
    const isLogin = req.isAuthenticated();
    Review.load(req.params.id, function (review) {
    if(isLogin) {
        User.load(req.user.email, function (user) {
            res.render('reviews/editreview', {
                review: review, isUserLogedIn: isLogin, user: user, status:status
            });
        });
    } else {
        res.render('reviews/editreview', {
            review: review, isUserLogedIn: isLogin
        });
    }
    });
};

//리뷰가 수정이 되면 업데이트
exports.updatereview = function (req, res) {
    Review.load(req.body.id, function (review) {
        //필요한 정보를 가져와서 저장
        review.title = req.body.title;
        review.book = req.body.book;
        review.author = req.body.author;
        review.publisher = req.body.publisher;
        review.content = req.body.content;
        
        //리뷰 저장
        review.save(function (err, result) {
            if (err) {
                /* Client Validation도 무시한 후 데이터가 들어온 경우 400코드 전송*/
                res.sendStatus(400)
            }
            /* 업로드한 파일이 있으면 */
            if (req.files.length > 0) {
                /* 업로드한 파일을 확인하여 데이터베이스에 저장 */
                req.files.forEach(function (file) {
                    //업로드 모델(upload) 생성
                    const upload = new Upload({
                        relatedId: result,
                        type: "rreview_photo",
                        filename: file.filename,
                        originalname: file.originalname,
                        type: file.mimetype,
                        size: file.size,
                    });
                    //데이터베이스에 사진 저장(uploads 컬렉션)
                    upload.save(function (err, result) {
                        review.photo = result;
                        review.save();
                    });
                });
            }
            res.redirect('/review');
        })
    });
};

// 리뷰 삭제
exports.deletereview = function (req, res) {
    //Review DB에서 리뷰 삭제
    Review.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
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