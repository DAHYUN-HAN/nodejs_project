/* eslint-disable */

$(document).ready(function () {
    console.log('call: /public/index.js');
    
    //리뷰 삭제
    $(".btn-delete").click(function () {
        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/deletereview',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/review';
                }
            });
        })
    })
    
    //혼밥 글 삭제
    $(".food-delete").click(function () {
        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/deletefood',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/mypage';
                }
            });
        })
    })
    
    //혼공 글 삭제
    $(".study-delete").click(function () {
        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/deletestudy',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/mypage';
                }
            });
        })
    })
    
    //스터디 글 삭제
    $(".group-delete").click(function () {
        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/deletegroup',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/mypage';
                }
            });
        })
    })
    
    //쪽지 삭제
    $(".send-delete").click(function () {
        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/deletesend',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/mypage';
                }
            });
        })
    })

    //리뷰 저장
    $(".btn-submit").click(function () {
        console.log("submit 들어옴");
        var title = $("input[name='title']").val();
        var book = $("input[name='book']").val();
        var author = $("input[name='author']").val();
        var publisher = $("input[name='publisher']").val();
        var content = $("textarea[name='content']").val();

        if(!title){
            swal('경고', '글 제목을 확인해주세요.', 'error')
        }else if(!book){
            swal('경고', '책 제목을 확인해주세요.', 'error')
        }else if(!author){
            swal('경고', '작가 이름을 확인해주세요.', 'error')
        }else if(!publisher){
            swal('경고', '출판사명을 확인해주세요.', 'error')
        }else if(!content){
            swal('경고', '책의 내용을 확인해주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
    //쪽지 보내기(저장)
    $(".btn-send").click(function () {
        var content = $("textarea[name='content']").val();
        if(!content){
            swal('경고', '쪽지 내용을 확인해주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
    //혼밥 글 저장
    $(".btn-food-submit").click(function () {
        var location = $("input[name='location']").val();
        var food = $("input[name='food']").val();
        var content = $("input[name='content']").val();
        if(!location){
            swal('경고', '도서관 위치를 확인해주세요.', 'error')
        }else if(!food){
            swal('경고', '음식종류를 확인해주세요.', 'error')
        }else if(!content){
            swal('경고', '내용을 확인해주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
    //혼공 글 저장
    $(".btn-study-submit").click(function () {
        var location = $("input[name='location']").val();
        var target = $("input[name='target']").val();
        var content = $("input[name='content']").val();
        if(!location){
            swal('경고', '도서관 위치를 확인해주세요.', 'error')
        }else if(!target){
            swal('경고', '대상을 확인해주세요.', 'error')
        }else if(!content){
            swal('경고', '내용을 확인해주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
    //스터디 글 저장
    $(".btn-groupstudy-submit").click(function () {
        var location = $("input[name='location']").val();
        var subject = $("input[name='subject']").val();
        var content = $("input[name='content']").val();
        if(!location){
            swal('경고', '도서관 위치를 확인해주세요.', 'error')
        }else if(!subject){
            swal('경고', '주제를 확인해주세요.', 'error')
        }else if(!content){
            swal('경고', '내용을 확인해주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
    //도서 검색
    $(".btn-book-submit").click(function () {
        var title = $("input[name='title']").val();
        console.log(title);
        if(!title){
            swal('경고', '책 제목을 확인해주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
    //페이징 form의 페이지 클릭
    $(".pageclick").click(function () {
        var pageno = $(this).text();
        console.log(pageno);
        $("input[name='pageNo']").val(pageno);
        $(this).closest("form").submit();
    });
    
    
    $(".pageclickpre").click(function () {
        var pageno = $("input[name='pageNo']").val();
        var setpage = (parseInt((pageno-1)/5-1)*5+1);
        $("input[name='pageNo']").val(setpage);
        $(this).closest("form").submit();
    });
    
    $(".pageclickne").click(function () {
        var pageno = $("input[name='pageNo']").val();
        var setpage = (parseInt((pageno-1)/5+1)*5+1);
        $("input[name='pageNo']").val(setpage);
        $(this).closest("form").submit();
    });
    
    $(".pageclick2").click(function () {
        var pageno = $(this).text();
        console.log(pageno);
        $("input[name='pageNo2']").val(pageno);
        $(this).closest("form").submit();
    });
    
    
    $(".pageclickpre2").click(function () {
        var pageno = $("input[name='pageNo2']").val();
        var setpage = (parseInt((pageno-1)/5-1)*5+1);
        $("input[name='pageNo2']").val(setpage);
        $(this).closest("form").submit();
    });
    
    $(".pageclickne2").click(function () {
        var pageno = $("input[name='pageNo2']").val();
        var setpage = (parseInt((pageno-1)/5+1)*5+1);
        $("input[name='pageNo2']").val(setpage);
        $(this).closest("form").submit();
    });
    
     $(".pageclick3").click(function () {
        var pageno = $(this).text();
        console.log(pageno);
        $("input[name='pageNo3']").val(pageno);
        $(this).closest("form").submit();
    });
    
    
    $(".pageclickpre3").click(function () {
        var pageno = $("input[name='pageNo3']").val();
        var setpage = (parseInt((pageno-1)/5-1)*5+1);
        $("input[name='pageNo3']").val(setpage);
        $(this).closest("form").submit();
    });
    
    $(".pageclickne3").click(function () {
        var pageno = $("input[name='pageNo3']").val();
        var setpage = (parseInt((pageno-1)/5+1)*5+1);
        $("input[name='pageNo3']").val(setpage);
        $(this).closest("form").submit();
    });
    
    //회원가입
    $(".btnsingup").click(function () {

        var name = $("input[name='name']").val();
        var user_email = $("input[name='user_email']").val();
        var user_password = $("input[name='user_password']").val();

        if(!name){
            swal('경고', '이름은 빈칸일 수 없습니다.', 'error')
        }else{
            $(this).closest("form").submit();
        }
    });
    
});