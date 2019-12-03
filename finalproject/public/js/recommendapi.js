$(document).ready(function() {
    
    var result = Math.floor(Math.random() * 1363) + 1;
        
        var newurl = "http://openapi.seoul.go.kr:8088/534d6b4767676b73313239724152544e/json/SeoulLibRecommendInfo/" + result+"/"+(result+2)+"/"
        console.log(newurl);
    
        //도서 추천 자료 가져오기
    fetch(newurl).then(function(response) {
        response.json().then((data) => {
            var content0 = data.SeoulLibRecommendInfo.row[0].CNTENT
            var content1 = data.SeoulLibRecommendInfo.row[1].CNTENT
            var content2 = data.SeoulLibRecommendInfo.row[2].CNTENT
            
            var author0 = data.SeoulLibRecommendInfo.row[0].AUTHOR
            var author1 = data.SeoulLibRecommendInfo.row[1].AUTHOR
            var author2 = data.SeoulLibRecommendInfo.row[2].AUTHOR
            
            var book0 = data.SeoulLibRecommendInfo.row[0].BOOK_NM
            var book1 = data.SeoulLibRecommendInfo.row[1].BOOK_NM
            var book2 = data.SeoulLibRecommendInfo.row[2].BOOK_NM
            
            check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
                
            var lastcontent0 = "";
            var lastcontent1 = "";
            var lastcontent2 = "";
            var content0Array = content0.split('>'||'<');
            var content1Array = content1.split('>'||'<');
            var content2Array = content2.split('>'||'<');
                
            for(var i = 0; i < content0Array.length; i++) {
                if(check.test(content0Array[i])) {
                    lastcontent0 += content0Array[i] + "<br><br><br>";
                }
            }
            for(var i = 0; i < content1Array.length; i++) {
                if(check.test(content1Array[i])) {
                    lastcontent1 += content1Array[i] + "<br><br><br>";
                }
            }
            for(var i = 0; i < content2Array.length; i++) {
                if(check.test(content2Array[i])) {
                    lastcontent2 += content2Array[i] + "<br><br><br>";
                }
            }
                
            var sliceStr0 = lastcontent0.slice(0,-4);
            var sliceStr1 = lastcontent1.slice(0,-4);
            var sliceStr2 = lastcontent2.slice(0,-4);
            
            //가져온 자료 출력
            $('#Area0').html(sliceStr0);
            $('#Area1').html(sliceStr1);
            $('#Area2').html(sliceStr2);
                
            $('#bookname0').html(book0);
            $('#bookname1').html(book1);
            $('#bookname2').html(book2);
                
            $('#author0').html(book0 +" <span class='spansamll'>" + author0 + " 지음</span>");
            $('#author1').html(book1 +" <span class='spansamll'>" + author1 + " 지음</span>");
            $('#author2').html(book2 +" <span class='spansamll'>" + author2 + " 지음</span>");
        });
    });
});
    