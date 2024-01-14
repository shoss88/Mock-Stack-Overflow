
## Instructions to setup and run project
* Open one cmd prompt, turn on the mongodb server. (I personally enter "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db")
* Open another cmd prompt, turn on mongosh using mongosh.exe.
* Open git bash on the /client folder directory and npm install
* Enter: npm start, to start the client
* Open a separate git bash on the /server folder directory and npm install
* Enter: node init.js admin-user admin-pass, to populate the database with an admin user ("admin-user" and "admin-pass" can be substituted with any username or password for admin. The email for the admin is admin@mockso.com)
* Enter: npm start secret, to start the server ("secret" can be substituted with anything, this is the secret key for the session)
* Now both server and client should be running.


## Features Implemented:
* Additional libraries used: bcrypt, connect-mongo, and express-session

* All data is defined using mongoose schemas and are saved in a MongoDB backend database.

* There are two tabs, the questions tab (linking to the questions page) and the tags tab (linking to the tags page).

* The questions page (home/default page) showcases all questions saved in the model, 5 at a time (there are next and prev buttons to show next or previous 5 questions). There are three options for question display: newest (which sorts by the post date of the questions), active (which sorts by questions with the most recent answers), and unanswered (which shows only unanswered questions).

* Clicking on a question title displays the question's answers, 5 at a time (there are next and prev buttons to show next or previous 5 answers). There is an option to add an answer to the specific question. Hyperlinks are able to be added in each answer under the format \[name\](link).

* There is an ask question button that prompts for information to add a question to the data model. Hyperlinks are able to be added in the question details under the format \[name\](link).

* The tags page showcases currently existing tags and how many questions they are links to. Clicking on a tag box will display all questions using that tag. 

* The search bar allows for question filtering. Searching with any words will display all questions that contain at least one of the words within their title or text. Searching with a tag, which is formatted as \[tagname\], will display all questions that contain this tag. Words and tags can be both included in the search.

* Each question and answer has an additional comment section, where comments are shown 3 at a time (there are next and prev buttons to show next or previous 3 comments)

* Each question, answer, and comment can be upvoted. Questions and answers can be downvoted.

* Added new welcome page. User can register and create a new user object that is stored in the database. Passwords are hashed using bcrypt.

* The user can login and a new session will be created using express-session and stored using connect-mongo (MongoStore)

* Unregistered users can login as guest, but won't have full site permissions such as upvoting, creating comments, creating questions, creating answers, etc.

* Logged in users can logout, which will destroy the session as well.

* Refreshing will not logout users and will keep them logged in. 

* Users can see their own profile, including questions they created, tags they created, and questions they've answered. Admin users will see this as well as full user list, along with permission to delete any registered user.




