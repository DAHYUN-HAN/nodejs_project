$(document).ready(function() {
    var selectlibrary = "";
    console.log("js파일 시작");
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = { 
        center: new kakao.maps.LatLng(37.55200494, 126.9801399), // 지도의 중심좌표
        level: 8 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
 
// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [
    {
        title: '강남도서관', 
        latlng: new kakao.maps.LatLng(37.51368143, 127.0468374)
    },
    {
        title: '강동도서관', 
        latlng: new kakao.maps.LatLng(37.53815107, 127.1434874)
    },
    {
        title: '강서도서관', 
        latlng: new kakao.maps.LatLng(37.5479003, 126.8599262)
    },
    {
        title: '개포도서관',
        latlng: new kakao.maps.LatLng(37.48308019, 127.063867)
    },
    {
        title: '고덕평생학습관',
        latlng: new kakao.maps.LatLng(37.55930391, 127.1579066)
    },
    {
        title: '고척도서관',
        latlng: new kakao.maps.LatLng(37.50534626, 126.8530515)
    },
    {
        title: '구로도서관',
        latlng: new kakao.maps.LatLng(37.49867236, 126.8911162)
    },
    {
        title: '남산도서관',
        latlng: new kakao.maps.LatLng(37.55255227, 126.9821555)
    },
    {
        title: '노원평생학습관',
        latlng: new kakao.maps.LatLng(37.63953995, 127.067837)
    },
    {
        title: '도봉도서관',
        latlng: new kakao.maps.LatLng(37.65253218, 127.0127628)
    },
    {
        title: '동대문도서관',
        latlng: new kakao.maps.LatLng(37.57348736, 127.0247655)
    },
    {
        title: '동작도서관',
        latlng: new kakao.maps.LatLng(37.50596898, 126.9401028)
    },
    {
        title: '마포평생학습관아현분관',
        latlng: new kakao.maps.LatLng(37.55416693, 126.9573466)
    },
    {
        title: '마포평생학습관',
        latlng: new kakao.maps.LatLng(37.5543222, 126.9242046)
    },
    {
        title: '서대문도서관',
        latlng: new kakao.maps.LatLng(37.58331954, 126.9408583)
    },
    {
        title: '송파도서관',
        latlng: new kakao.maps.LatLng(37.49999503, 127.1348515)
    },
    {
        title: '양천도서관',
        latlng: new kakao.maps.LatLng(37.53349939, 126.8757691)
    },
    {
        title: '어린이도서관',
        latlng: new kakao.maps.LatLng(37.57607257, 126.9683689)
    },
    {
        title: '영등포평생학습관',
        latlng: new kakao.maps.LatLng(37.52580934, 126.9071819)
    },
    {
        title: '용산도서관',
        latlng: new kakao.maps.LatLng(37.55200494, 126.9801399)
    },
    {
        title: '정독도서관',
        latlng: new kakao.maps.LatLng(37.58103147, 126.983694)
    },
    {
        title: '종로도서관',
        latlng: new kakao.maps.LatLng(37.5764504, 126.9664672)
    }
];

// 마커 이미지의 이미지 주소입니다
var imageSrc = './images/location.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(30, 44), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(15, 40)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    
    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35); 
    
    // 마커 이미지를 생성합니다    
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
    
    var libraryMarkers = [];
    createLibraryMarkers();
    
    function createMarker(position, title) {
        var marker = new kakao.maps.Marker({
            position:position,
            title:title,
            image:markerImage
        });
        return marker;
    }
    
    function createLibraryMarkers() {
        positions.forEach(function(i) {
            var marker = createMarker(i.latlng, i.title);
            
            libraryMarkers.push(marker);
            
            marker.setMap(map);
            
            daum.maps.event.addListener(marker, 'click', function(mouseEvent) {
                location.href = '/librarys/'+i.title;
            });
        })
    }
    
    
});