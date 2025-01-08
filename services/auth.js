const User = require('../database/usermodel'); // Assuming your User model is in models/User.js

async function findUserByNamePasswordMobileEmail( mobile, email) {
    const user_email = await User.findOne({ email : email });
    const user_mobile = await User.findOne({mobile : mobile});
    console.log(user_email)
    console.log(user_mobile)
      if(user_email !== null||user_mobile!== null){ 
        // console.log(user)
        return true;
      }
      else{
      return false;
      }
}

module.exports = findUserByNamePasswordMobileEmail;