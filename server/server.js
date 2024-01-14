let Questions = require("./models/questions");
let Tags = require("./models/tags");
let Answers = require("./models/answers");
let Users = require("./models/users");
let Comments = require("./models/comments");
const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const cors = require("cors");

const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log("App listening on port " + port);
});
let mongoose = require("mongoose");
let mongoDB = "mongodb://127.0.0.1:27017/mock_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

const secret = process.argv[2];
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  }));
app.use(
    session({
      secret: `${secret}`,
      cookie: {
        sameSite: false,
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/mock_so"})
    })
  );

app.get('/questions', (req, res) => {
    Questions.getAllQuestions()
        .then((question_list) => {
            res.send(question_list);
        });
});

app.get('/tags', (req, res) => {
    Tags.getAllTags()
        .then((tag_list) => {
            res.send(tag_list);
        });
});

app.get('/answers', (req, res) => {
    Answers.getAllAnswers()
        .then((answer_list) => {
            res.send(answer_list);
        });
});

app.get('/users', (req, res) => {
    Users.getAllUsers()
        .then((user_list) => {
            res.send(user_list);
        });
});

app.get('/comments', (req, res) => {
    Comments.getAllComments()
        .then((comment_list) => {
            res.send(comment_list);
        });
});

app.post('/create/question', (req, res) => {
    Questions.insertQuestion(req.body)
        .then((ques) => {
            res.send(ques)
        });
});

app.post('/create/tag', (req, res) => {
    Tags.insertTag(req.body)
        .then((tag) => {
            res.send(tag)
        });
});

app.post('/create/answer', (req, res) => {
    Answers.insertAnswer(req.body)
        .then((ans) => {
            res.send(ans)
        });
});

app.post('/create/user', async (req, res) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const passHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passHash;
    Users.insertUser(req.body)
        .then((user) => {
            res.send(user)
        });
});

app.post('/create/comment', (req, res) => {
    Comments.insertComment(req.body)
        .then((comm) => {
            res.send(comm)
        });
});

app.post('/modify/tag', (req, res) => {
    Tags.updateTag(req.body.updateTag, req.body.newTag)
        .then((tag) => {
            res.send(tag)
        });
});

app.post('/delete/tag', (req, res) => {
    Tags.deleteTag(req.body.deleteTag)
        .then((tag) => {
            res.send(tag)
        });
})

app.post('/modify/question', (req, res) => {
    Questions.updateQuestion(req.body.updateQuestion, req.body.newQuestion)
        .then((ques) => {
            res.send(ques)
        });
});

app.post('/delete/question', (req, res) => {
    Questions.deleteQuestion(req.body.deleteQuestion)
        .then((ques) => {
            res.send(ques)
        });
})

app.post('/update/question/views', (req, res) => {
    Questions.updateViews(req.body.updateQuestion)
        .then((ques) => {
            res.send(ques)
        });
});

app.post('/update/question/answers', (req, res) => {
    Questions.updateAnswers(req.body.updateQuestion, req.body.answer)
        .then((ques) => {
            res.send(ques)
        });
});

app.post('/update/question/votes', (req, res) => {
    Questions.updateVotes(req.body.updateQuestion, req.body.incrNum)
        .then((ques) => {
            res.send(ques)
        });
});

app.post('/update/question/comments', (req, res) => {
    Questions.updateComments(req.body.updateQuestion, req.body.comment)
        .then((ques) => {
            res.send(ques)
        });
});

app.post('/update/answer/votes', (req, res) => {
    Answers.updateVotes(req.body.updateAnswer, req.body.incrNum)
        .then((ans) => {
            res.send(ans)
        });
});

app.post('/update/answer/comments', (req, res) => {
    Answers.updateComments(req.body.updateAnswer, req.body.comment)
        .then((ans) => {
            res.send(ans)
        });
});

app.post('/update/comment/votes', (req, res) => {
    Comments.updateVotes(req.body.updateComment, req.body.incrNum)
        .then((comm) => {
            res.send(comm)
        });
});

app.post('/update/user/rep', (req, res) => {
    Users.updateRep(req.body.updateUser, req.body.incrNum)
        .then((user) => {
            res.send(user)
        });
});

app.post('/update/user/asked', (req, res) => {
    Users.updateAskedQ(req.body.updateUser, req.body.question)
        .then((user) => {
            res.send(user)
        });
});

app.post('/update/user/tags', (req, res) => {
    Users.updateCreatedTags(req.body.updateUser, req.body.tag)
        .then((user) => {
            res.send(user)
        });
});

app.post('/update/user/answered', (req, res) => {
    let questions = req.body.questions;
    if (questions.find(ques => ques._id === req.body.question._id) === undefined){
        Users.updateAnsweredQ(req.body.updateUser, req.body.question)
        .then((user) => {
            res.send(user)
        });
    }
    else{
        res.send(req.body.updateUser);
    }
});

app.post('/delete/user', (req, res) => {
    Users.deleteUser(req.body.deleteUser)
        .then((user) => {
            res.send(user)
        });
})

app.post('/welcome', (req, res) => {
    if (req.session.user) {
      res.send(req.session.user);
    }
    else {
        res.send(null);
    }
});

app.post('/login', async (req, res) => {
    const entryEmail = req.body.entryEmail;
    const entryPass = req.body.entryPass;
    const user = req.body.user;
    const verdict = await bcrypt.compare(entryPass, user.password);
    if (verdict) {
        req.session.user = entryEmail;
        res.send(true);
    }
    else {
        res.send(false);
    }
});

app.post('/login/guest', async (req, res) => {
    req.session.user = "guest";
    res.send(true);
});

app.post("/logout", (req, res) => {
    req.session.destroy(err => {
      res.send("done");
    });
  });


process.on("SIGTERM", terminate);
process.on("SIGINT", terminate);
function terminate() {
    server.close();
    db.close();
    console.log("Server closed. Database instance disconnected");
}