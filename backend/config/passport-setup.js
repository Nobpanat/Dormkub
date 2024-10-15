const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Model ของ User
const Role = require('../models/Role'); // Model ของ Role
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ค้นหาผู้ใช้ในฐานข้อมูลตาม googleId
        let user = await User.findOne({ googleId: profile.id }).populate('roles');
        // console.log("1 ",user);

        // ถ้าไม่เจอผู้ใช้ ให้สร้างผู้ใช้ใหม่
        if (!user) {
          // ค้นหาบทบาท tenant ในฐานข้อมูล
          const tenantRole = await Role.findOne({ code: 'TENANT' });
          // console.log(tenantRole);
          // console.log(tenantRole._id);
          if (!tenantRole) {
            return done(new Error('Tenant role not found'), null);
          }

          
          user = await new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profileImage: profile.photos[0].value,
            phoneNumber: '',
            roles: [tenantRole._id], // ค่า default หรือกำหนดตามเงื่อนไข
          }).save();

          // // populate roles ใหม่
          // user = await user.populate('roles');
          // console.log("2 ",user);
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize and Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // หา user ตาม id
    done(null, user); // ส่ง user กลับไปใน req.user
  } catch (err) {
    done(err, null);
  }
});
