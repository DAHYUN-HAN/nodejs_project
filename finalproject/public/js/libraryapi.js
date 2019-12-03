
$(document).ready(function() {
    var dec = $('#libraryname').text();
    var newurl = "http://openapi.seoul.go.kr:8088/534d6b4767676b73313239724152544e/json/SeoulPublicLibraryInfo/1/173"
    
    //도서관 정보 가져오기
    fetch(newurl).then(function(response) {
        response.json().then((data) => {
            for(var i = 0; i <data.SeoulPublicLibraryInfo.row.length; i++) {
                if(data.SeoulPublicLibraryInfo.row[i].LBRRY_NAME == "서울특별시교육청"+dec) {
                    var name = dec + " 정보"
                    var address = data.SeoulPublicLibraryInfo.row[i].ADRES;
                    var trans = data.SeoulPublicLibraryInfo.row[i].TFCMN;
                    var holiday = data.SeoulPublicLibraryInfo.row[i].FDRM_CLOSE_DATE;
                    var borrow = data.SeoulPublicLibraryInfo.row[i].LON_GDCC;
                    var member = data.SeoulPublicLibraryInfo.row[i].MBER_SBSCRB_RQISIT;
                    var number = data.SeoulPublicLibraryInfo.row[i].TEL_NO;
                    var info = data.SeoulPublicLibraryInfo.row[i].LBRRY_INTRCN;
                    
                    //가져온 자료 출력
                    $('#libraryname').html(name);
                    $('#llocation').html(address);
                    $('#lway').html(trans);
                    $('#lholiday').html(holiday);
                    $('#lborrow').html(borrow);
                    $('#lsignin').html(member);
                    $('#ltel').html(number);
                    $('#linfo').html(info);
                }
            }
        });
    });
});
    