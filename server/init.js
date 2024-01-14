let User = require('./models/users')
const bcrypt = require('bcrypt');
let mongoose = require('mongoose');

const saltRounds = 10;
const adminUser = process.argv[2];
const adminPass = process.argv[3];
let mongoDB = "mongodb://127.0.0.1:27017/mock_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;


let userCreate = async function(username, email, password, admin, member_time, rep, asked_qs, created_tags, answered_qs){
    const salt = await bcrypt.genSalt(saltRounds);
    const passHash = await bcrypt.hash(password, salt);
    userDetail = {
        username: username,
        email: email,
        password: passHash,
        admin: admin,
        member_time: member_time,
        rep: rep,
        asked_qs: asked_qs,
        created_tags: created_tags,
        answered_qs: answered_qs
    }

    let user = new User(userDetail);
    return user.save();
}


const populate = async () => {
    let u1 = await userCreate(adminUser, "admin@mockso.com", adminPass, true, Date.now(), 100, [], [], []);

    if(db) db.close();
    console.log('done');
  }
  
  populate()
    .catch((err) => {
      console.log('ERROR: ' + err);
      if(db) db.close();
    });