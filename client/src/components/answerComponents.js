import React from 'react';
import axios from 'axios';
import { pluralOrNot, formattedDate } from './fakestackoverflow.js';
import { AskQuestion, sortAnsByDate, QuestionTag, PrevButton, NextButton } from './questionComponents.js'
import { CommentSection } from './commentComponents.js';

export class AnswersPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fromIndex: 0,
            toIndex: 4,
            votes: props.question.votes,
            comments: props.question.comments
        }
        this.handleDecIndices = this.handleDecIndices.bind(this);
        this.handleIncIndices = this.handleIncIndices.bind(this);
        this.handleQuesUpvote = this.handleQuesUpvote.bind(this);
        this.handleQuesDownvote = this.handleQuesDownvote.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
    }

    handleNewComment(comment){
        let question = this.props.question;
        axios.post('http://localhost:8000/create/comment', comment, {withCredentials:true})
            .then((comm) => {
                return axios.post('http://localhost:8000/update/question/comments', {updateQuestion: question, comment: comm.data}, {withCredentials:true})
            })
            .then((ques) => {
                let newState = Object.assign({}, this.state);
                newState.comments = ques.data.comments;
                this.setState(() => {return newState});
            })
    }

    handleDecIndices(){
        this.setState((prevState) => {return {
            fromIndex: prevState.fromIndex - 5,
            toIndex: prevState.toIndex - 5
        }});
    }

    handleIncIndices(){
        this.setState((prevState) => {return {
            fromIndex: prevState.fromIndex + 5,
            toIndex: prevState.toIndex + 5
        }});
    }

    handleQuesUpvote(){
        let user = this.props.user;
        let question = this.props.question;
        if (user.rep >= 50 || user.admin === true){
            axios.post('http://localhost:8000/update/user/rep', {updateUser: question.asked_by, incrNum: 5}, {withCredentials:true})
                .then((user) => {
                    return axios.post('http://localhost:8000/update/question/votes', {updateQuestion: question, incrNum: 1}, {withCredentials:true})
                })
                .then((ques) => {
                    let newState = Object.assign({}, this.state);
                    newState.votes = ques.data.votes;
                    this.setState(() => {return newState});
                })
        }
    }

    handleQuesDownvote(){
        let user = this.props.user;
        let question = this.props.question;
        if (user.rep >= 50 || user.admin === true){
            axios.post('http://localhost:8000/update/user/rep', {updateUser: question.asked_by, incrNum: -10}, {withCredentials:true})
                .then((user) => {
                    return axios.post('http://localhost:8000/update/question/votes', {updateQuestion: question, incrNum: -1}, {withCredentials:true})
                })
                .then((ques) => {
                    let newState = Object.assign({}, this.state);
                    newState.votes = ques.data.votes;
                    this.setState(() => {return newState});
                })
        }
    }

    render(){
        let question = this.props.question;
        let currentQType = this.props.currentQType;
        let guestLogin = this.props.guestLogin;
        let fromIndex = this.state.fromIndex;
        let toIndex = this.state.toIndex;
        let user = this.props.user;

        sortAnsByDate(question);
        let answersList = question.answers.map((answer) => {
            return <Answer key={answer._id} currentQType={currentQType} 
            answer={answer} guestLogin={guestLogin} user={user} />;
        });
        let displayedA = [];
        for (let i = fromIndex; i < answersList.length; i++){
            displayedA.push(answersList[i]);
            if (i === toIndex){
                break;
            }
        }

        let questionText = question.text;
        let questionTextArr = [];
        let regex = /\[.*?\]\(.*?\)/g;
        let hyperLinksArr = questionText.match(regex);
        let keyCounter = 0;
        if (hyperLinksArr !== null) {
            for (let i = 0; i < hyperLinksArr.length; i++) {
                let hyperlink = hyperLinksArr[i];
                let hyperlinkName = hyperlink.substring(1, hyperlink.indexOf("(") - 1);
                let hyperlinkDest = hyperlink.substring(hyperlink.indexOf("(") + 1, hyperlink.length - 1);
                let hyperlinkIndex = questionText.indexOf(hyperlink);
                questionTextArr.push(questionText.substring(0, hyperlinkIndex));
                let hyperlinkElem = <a key={keyCounter} href={hyperlinkDest} rel="noreferrer" target="_blank">{hyperlinkName}</a>;
                questionTextArr.push(hyperlinkElem);
                keyCounter += 1;
                questionText = questionText.substring(hyperlinkIndex + hyperlink.length);
            }
        }
        questionTextArr.push(questionText);

        let tagsList = question.tags.map((tag) => <QuestionTag key={tag._id} tagObject={tag} />);
        return (
            <main id="homepage">
                <div id="answers-header">
                    <div id="upper-question-header">
                        <div id="current-question-title">{question.title}</div>
                        <AskQuestion guestLogin={guestLogin} onTabClick={this.props.changeToDefaultTab} currentQType={currentQType} />
                    </div>
                    <div id="lower-question-header">
                        <VotingBox guestLogin={guestLogin} 
                            upvote={this.handleQuesUpvote} downvote={this.handleQuesDownvote} />
                        <div className="question-stats">
                            <div className="question-answers">{pluralOrNot(question.answers.length, "answer")}</div>
                            <div className="question-views">{pluralOrNot(question.views, "view")}</div>
                            <div className="question-votes">{pluralOrNot(this.state.votes, "vote")}</div>
                        </div>
                        <div id="question-body">{questionTextArr}</div>
                        <div className="question-metadata">
                            <div className="question-username">{question.asked_by.username}</div>
                            <div className="question-date">asked {formattedDate(question.ask_date_time)}</div>
                        </div>
                    </div>
                    <div className="question-tags">{tagsList}</div>
                    <CommentSection comments={this.state.comments} user={user}
                        handleNewComment={this.handleNewComment} guestLogin={guestLogin}/>
                </div>
                <div id="answers-section">
                    {displayedA}
                </div>
                <div className="next-prev">
                    <PrevButton fromIndex={fromIndex} list={answersList} onTabClick={this.handleDecIndices}/>
                    <NextButton toIndex={toIndex} list={answersList} onTabClick={this.handleIncIndices}/>
                </div>
                <div id="answers-footer">
                    <AnswerQuestion question={question} guestLogin={guestLogin}
                        onTabClick={this.props.changeToDefaultTab} currentQType={currentQType} />
                </div>
            </main>
        );   
    }
}


function VotingBox(props){
    let guestLogin = props.guestLogin;
    let displayName = "flex"
    if (guestLogin){
        displayName = "none";
    }
    return(
        <div className="voting-box" style={{display: displayName}}>
            <Upvote onTabClick={props.upvote}/>
            <Downvote onTabClick={props.downvote}/>
        </div>
    );
}


class Upvote extends React.Component {
    constructor(props){
        super(props);
        this.handleTabClick = this.handleTabClick.bind(this);
    }
    
    handleTabClick(){
        this.props.onTabClick();
    }

    render(){
        return(
            <button className="upvote" onClick={this.handleTabClick}>Upvote</button>
        )
    }
}

class Downvote extends React.Component {
    constructor(props){
        super(props);
        this.handleTabClick = this.handleTabClick.bind(this);
    }

    handleTabClick(){
        this.props.onTabClick();
    }

    render(){
        return(
            <button className="downvote" onClick={this.handleTabClick}>Downvote</button>
        )
    }
}


class Answer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            votes: props.answer.votes,
            comments: props.answer.comments
        }
        this.handleAnsUpvote = this.handleAnsUpvote.bind(this);
        this.handleAnsDownvote = this.handleAnsDownvote.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
    }

    handleNewComment(comment){
        let answer = this.props.answer;
        axios.post('http://localhost:8000/create/comment', comment, {withCredentials:true})
            .then((comm) => {
                return axios.post('http://localhost:8000/update/answer/comments', {updateAnswer: answer, comment: comm.data}, {withCredentials:true})
            })
            .then((ans) => {
                let newState = Object.assign({}, this.state);
                newState.comments = ans.data.comments;
                this.setState(() => {return newState});
            })
    }

    handleAnsUpvote(){
        let user = this.props.user;
        let answer = this.props.answer;
        if (user.rep >= 50 || user.admin === true){
            axios.post('http://localhost:8000/update/user/rep', {updateUser: answer.ans_by, incrNum: 5}, {withCredentials:true})
                .then((user) => {
                    return axios.post('http://localhost:8000/update/answer/votes', {updateAnswer: answer, incrNum: 1}, {withCredentials:true})
                })
                .then((ans) => {
                    let newState = Object.assign({}, this.state);
                    newState.votes = ans.data.votes;
                    this.setState(() => {return newState});
                })
        }
    }

    handleAnsDownvote(){
        let user = this.props.user;
        let answer = this.props.answer;
        if (user.rep >= 50 || user.admin === true){
            axios.post('http://localhost:8000/update/user/rep', {updateUser: answer.ans_by, incrNum: -10}, {withCredentials:true})
                .then((user) => {
                    return axios.post('http://localhost:8000/update/answer/votes', {updateAnswer: answer, incrNum: -1}, {withCredentials:true})
                })
                .then((ans) => {
                    let newState = Object.assign({}, this.state);
                    newState.votes = ans.data.votes;
                    this.setState(() => {return newState});
                })
        }
    }

    render(){
        let guestLogin = this.props.guestLogin;
        let user = this.props.user;
        let answer = this.props.answer;
        let answerText = answer.text;
        let answerTextArr = [];
        let regex = /\[.*?\]\(.*?\)/g;
        let hyperLinksArr = answerText.match(regex);
        let keyCounter = 0;
        if (hyperLinksArr !== null) {
            for (let i = 0; i < hyperLinksArr.length; i++) {
                let hyperlink = hyperLinksArr[i];
                let hyperlinkName = hyperlink.substring(1, hyperlink.indexOf("(") - 1);
                let hyperlinkDest = hyperlink.substring(hyperlink.indexOf("(") + 1, hyperlink.length - 1);
                let hyperlinkIndex = answerText.indexOf(hyperlink);
                answerTextArr.push(answerText.substring(0, hyperlinkIndex));
                let hyperlinkElem = <a key={keyCounter} href={hyperlinkDest} rel="noreferrer" target="_blank">{hyperlinkName}</a>;
                answerTextArr.push(hyperlinkElem);
                keyCounter += 1;
                answerText = answerText.substring(hyperlinkIndex + hyperlink.length);
            }
        }
        answerTextArr.push(answerText);

        return (
            <div className="full-answer">
                <div className="answer-box" id={answer._id}>
                    <VotingBox guestLogin={guestLogin} 
                        upvote={this.handleAnsUpvote} downvote={this.handleAnsDownvote}/>
                    <div className="answer-stats">
                        <div className="answer-votes">{pluralOrNot(this.state.votes, "vote")}</div>
                    </div>
                    <div className="answer-body">{answerTextArr}</div>
                    <div className="answer-metadata">
                        <div className="answer-username">{answer.ans_by.username}</div>
                        <div className="answer-date">answered {formattedDate(answer.ans_date_time)}</div>
                    </div>
                </div>
                <CommentSection comments={this.state.comments} user={user}
                handleNewComment={this.handleNewComment} guestLogin={guestLogin}/>
            </div>
        );
    }
}


class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange() {
        this.props.onTabClick("New Answer", this.props.currentQType, this.props.question);
    }

    render() {
        let guestLogin = this.props.guestLogin;
        let displayName = "flex"
        if (guestLogin){
            displayName = "none";
        }
        return (
            <button id="answer-question" style={{display: displayName}} onClick={this.handleTabChange}>Answer Question</button>
        );
    }
}


export class NewAnswerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailsInput: "",
            detailsError: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    handleInputChange(e) {
        let newState = Object.assign({}, this.state);
        let inputElem = e.target;
        if (inputElem.parentElement.id === "answer-text") {
            newState.detailsInput = inputElem.value;
        }
        this.setState(() => {return newState});
    }

    handleErrors(errorMsgs) {
        let newState = Object.assign({}, this.state);
        newState.detailsError = errorMsgs[0];
        this.setState(() => {return newState});
    }

    render() {
        let question = this.props.question;
        let currentQType = this.props.currentQType;
        let user = this.props.user;
        return (
            <main id="homepage">
                <div id="new-answer-page-upper">
                    <div id="answer-text">
                        <p className="entry-title">Question Text*</p>
                        <p className="entry-hint">Add question details.</p>
                        <textarea className="entry-box" onChange={this.handleInputChange} type="text" placeholder="e.g: I think you could just use the + operator."></textarea>
                        <p className="error-message">{this.state.detailsError}</p>
                    </div>
                </div>
                <div id="new-answer-page-lower">
                    <PostAnswer inputsAndErrorMsgs={this.state} handleErrors={this.handleErrors} user={user}
                        onTabClick={this.props.changeToDefaultTab} question={question} currentQType={currentQType} />
                    <p>* indicates mandatory fields</p>
                </div>
            </main>
        );
    }
}


class PostAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.handlePostClick = this.handlePostClick.bind(this);
    }

    handlePostClick() {
        let detailsInput = this.props.inputsAndErrorMsgs.detailsInput;
        let detailsError = this.props.inputsAndErrorMsgs.detailsError;

        let newErrorMsgs = [];

        if (detailsInput.trim().length === 0) {
            detailsError = "*This field is mandatory. You must enter answer details.";
        }
        else {
            detailsError = "";
            let regex = /\[.*?\]\(.*?\)/g;
            let hyperLinksArr = detailsInput.match(regex);
            if (hyperLinksArr !== null) {
                for (let i = 0; i < hyperLinksArr.length; i++) {
                    let hyperlink = hyperLinksArr[i];
                    let hyperlinkName = hyperlink.substring(1, hyperlink.indexOf("(") - 1);
                    let hyperlinkDest = hyperlink.substring(hyperlink.indexOf("(") + 1, hyperlink.length - 1);
                    if (hyperlinkName.length === 0) {
                        detailsError = "*Hyperlink name cannot be empty.";
                        break;
                    }
                    else if (hyperlinkDest.length === 0) {
                        detailsError = "*Hyperlink destination cannot be empty.";
                        break;
                    }
                    else if (!hyperlinkDest.startsWith("https://") && !hyperlinkDest.startsWith("http://")) {
                        detailsError = "*Hyperlink destination must start with https:// or http://";
                        break;
                    }
                }
            }
        }
        newErrorMsgs.push(detailsError);

        if (detailsError.length === 0) {
            let question = this.props.question;
            let currentQType = this.props.currentQType;
            let user = this.props.user;

            let newAnswer =
            {
                text: detailsInput,
                ans_by: user,
                ans_date_time: Date.now(),
                votes: 0
            };

            let newQuestion = null;
            axios.post('http://localhost:8000/create/answer', newAnswer)
                .then((ans) => {
                    return axios.post('http://localhost:8000/update/question/answers', {updateQuestion: question, answer: ans.data}, {withCredentials:true})
                })
                .then((ques) => {
                    newQuestion = ques.data;
                    return axios.post('http://localhost:8000/update/user/answered', {updateUser: user, question: newQuestion, questions: user.answered_qs}, {withCredentials:true})
                    
                })
                .then((user) => {
                    this.props.onTabClick("Answers", currentQType, newQuestion, user.data);
                });
        }
        else {
            this.props.handleErrors(newErrorMsgs);
        }

    }

    render() {
        return (
            <button id="post-answer" onClick={this.handlePostClick}>Post Answer</button>
        );
    }
}