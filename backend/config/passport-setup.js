const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Model ของ User
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
        let user = await User.findOne({ googleId: profile.id });

        // ถ้าไม่เจอผู้ใช้ ให้สร้างผู้ใช้ใหม่
        if (!user) {
          user = await new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profileImage: profile.photos[0].value,
            role: 'tenant', // ค่า default หรือกำหนดตามเงื่อนไข
          }).save();
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
