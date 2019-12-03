// ========== User 모델 ==========//
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// ====== UserSchema 설정(4) ========//
const UserSchema = new Schema({
    name: {type: String, default: ''},//이름
    email: {type: String, default: ''},//이메일
    hashed_password: {type: String, default: ''},//비밀번호
    admin: {type: Boolean, default: false},//관리자여부
    image: {type: String, default: '/images/avatar.jpg'},//관리자는 프로필 사진이 초록색상.
    salt: {type: String, default: ''},
}, {
    timestamp: true,
});

UserSchema.statics = {
    //선택한 회원 정보
	load: function (email, cb) {
		this.findOne({email})
		    .exec(function (err, user) {
			    cb(user)
		    });
	},
    //전체 회원 정보
    list: function (cb) {
		this.find({}).sort({createdAt: -1}).exec(function (err, users) {
			cb(users)
		});
	},
}

// ======== email Validation(5) =======//
// path() 메소드는 컬럼 값을 확인하는데 사용되는 메소드로, 확인하고자 하는 컬럼값을 전달하면됨
// path() 메소드로 컬럼값을 확인한 후, validate() 메소드를 호출하면 그 값이 유효한지를 체크함
UserSchema.path('email').validate(async function (email, cb) {
    const User = mongoose.model('User');
    const userCount = await User.count({email: email}).exec();
    return (userCount === 0);
}, '이미 존재하는 이메일주소입니다.');

UserSchema.path('email').validate(function (email) {
    return email.length;
}, "이메일은 빈칸일 수 없습니다.");

UserSchema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length
}, "비밀번호는 빈칸일 수 없습니다.");


//============= 비밀번호 대조메소드, 난수발생메소드, 암호화저장 메소드 선언(6) ======//
UserSchema.methods = {

    /** authenticate 메소드 - 유저로부터 비밀번호를 받아 대조합니다. **/
    authenticate: function (plainText) {
        const tempEncy = this.encryptPassword(plainText);
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /** makeSalt 메소드 - 비밀번호 암호화를 위한 난수를 만듭니다. **/
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /** 만들어진 난수와 입력받은 비밀번호를 통해 공개키 암호화를 한 후 저장합니다. **/
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
};

/* ==== Virtual Column을 통해 패스워드를 저장하면 자동으로 
        salt와 hashed_password로  변환하여 저장(7) ======//*/
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

//모델 생성
mongoose.model('User', UserSchema);
