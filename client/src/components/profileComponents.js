import React from 'react';
import axios from 'axios';
import { formattedDate, pluralOrNot, parseSentence} from './fakestackoverflow';
import { Question, sortQNewest, PrevButton, NextButton} from './questionComponents';

export class ProfilePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fromIndex: 0,
            toIndex: 4,
            displayTags: "none",
            displayQuestions: "none"
        }
        this.handleDecIndices = this.handleDecIndices.bind(this);
        this.handleIncIndices = this.handleIncIndices.bind(this);
        this.handleCreatedTags = this.handleCreatedTags.bind(this);
        this.handleAnsweredQuestions = this.handleAnsweredQuestions.bind(this);
    }

    handleCreatedTags(){
        let newState = Object.assign({}, this.state);
        newState.displayTags = "flex";
        newState.displayQuestions = "none";
        this.setState(() => {return newState});
    }

    handleAnsweredQuestions(){
        let newState = Object.assign({}, this.state);
        newState.displayTags = "none";
        newState.displayQuestions = "flex";
        this.setState(() => {return newState});
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
    

    render(){
        let user = this.props.user;
        let dataModel = this.props.dataModel;
        let userAsked = user.asked_qs;
        let currentQType = this.props.currentQType;
        let fromIndex = this.state.fromIndex;
        let toIndex = this.state.toIndex;
        sortQNewest(userAsked);
        let questionTitles = userAsked.map((question) => {
            return <QuestionTitle key={question._id} question={question}
                currentQType={currentQType} onTabClick={this.props.changeToDefaultTab} />
        });
        if (questionTitles.length === 0){
            questionTitles = "No questions asked"
        }
        let isAdmin = "no";
        if (user.admin){
            isAdmin = "yes"
        }

        let allTags = user.created_tags;
        let tagsList = allTags.map((tag) => <UserTag key={tag._id} user={user} tag={tag} dataModel={dataModel} 
            onTabClick={this.props.changeSearchResults} onTabChange={this.props.changeToDefaultTab}/>);

        let userAnswered = user.answered_qs;
        sortQNewest(userAnswered);
        let questionList = userAnswered.map((question) =>
            <Question key={question._id} question={question}
                currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />);
        let displayedQ = [];
        for (let i = fromIndex; i < questionList.length; i++){
            displayedQ.push(questionList[i]);
            if (i === toIndex){
                break;
            }
        }

        let homepage = null;
        if (user.admin){
            let allUsers = dataModel.users;
            let userList = allUsers.filter((usr) => usr.email !== user.email).map((usr) => <UserBox key={usr._id} user={usr} onTabClick={this.props.changeToDefaultTab}/>)
            homepage = 
            <main id="homepage">
                <div className="user-info">
                    <div className="user-name">Username: {user.username}</div>
                    <div className="user-time">Member as of: {formattedDate(user.member_time)}</div>
                    <div className="user-rep">Repuation: {user.rep}</div>
                    <div className="is-admin">Admin: {isAdmin}</div>
                </div>
                <div className="member-list">
                    {userList}
                </div>
                <div className="user-asked">
                    Asked Questions:
                    {questionTitles}
                </div>
                <div className="user-menu">
                    <button id="created-tags-button" onClick={this.handleCreatedTags}>Created Tags</button>
                    <button id="questions-ansd-button" onClick={this.handleAnsweredQuestions}>Questions Answered</button>
                </div>
                <div id="tags-section-wrap" style={{display: this.state.displayTags}}>
                    <div id="total-tags">{pluralOrNot(allTags.length, "tag")}</div>
                    <div id="tags-section">
                        {tagsList}
                    </div>
                </div>
                <div id="asked-questions-section" style={{display: this.state.displayQuestions}}>
                    Answered {userAnswered.length} Questions:
                    {displayedQ}
                    <div className="next-prev">
                        <PrevButton fromIndex={fromIndex} list={questionList} onTabClick={this.handleDecIndices}/>
                        <NextButton toIndex={toIndex} list={questionList} onTabClick={this.handleIncIndices}/>
                    </div>
                </div>
            </main>
        }
        else{
            homepage = 
            <main id="homepage">
                <div className="user-info">
                    <div className="user-name">Username: {user.username}</div>
                    <div className="user-time">Member as of: {formattedDate(user.member_time)}</div>
                    <div className="user-rep">Repuation: {user.rep}</div>
                    <div className="is-admin">Admin: {isAdmin}</div>
                </div>
                <div className="user-asked">
                    Asked Questions:
                    {questionTitles}
                </div>
                <div className="user-menu">
                    <button id="created-tags-button" onClick={this.handleCreatedTags}>Created Tags</button>
                    <button id="questions-ansd-button" onClick={this.handleAnsweredQuestions}>Questions Answered</button>
                </div>
                <div id="tags-section-wrap" style={{display: this.state.displayTags}}>
                    <div id="total-tags">{pluralOrNot(allTags.length, "tag")}</div>
                    <div id="tags-section">
                        {tagsList}
                    </div>
                </div>
                <div id="asked-questions-section" style={{display: this.state.displayQuestions}}>
                    Answered {userAnswered.length} Questions:
                    {displayedQ}
                    <div className="next-prev">
                        <PrevButton fromIndex={fromIndex} list={questionList} onTabClick={this.handleDecIndices}/>
                        <NextButton toIndex={toIndex} list={questionList} onTabClick={this.handleIncIndices}/>
                    </div>
                </div>
            </main>
        }

        return(
            homepage
        );
    }
}

class UserBox extends React.Component{
    constructor(props){
        super(props);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleDeleteClick(){
        let user = this.props.user;
        axios.post('http://localhost:8000/delete/user', { deleteUser: user }, {withCredentials:true})
            .then((res) => {
                this.props.onTabClick("Profile", "newest", null);
            });
    }

    render(){
        let user = this.props.user;
        return(
            <div className="user-box">
                <div className="user-box-name">{user.username}</div>
                <button className="delete-user" onClick={this.handleDeleteClick}>Delete</button>
            </div>
        )
    }
}

class QuestionTitle extends React.Component{
    constructor(props){
        super(props);
        this.handleTitleClick = this.handleTitleClick.bind(this);
    }

    handleTitleClick(){
        let currentQType = this.props.currentQType;
        let question = this.props.question;
        this.props.onTabClick("Modify Question", currentQType, question);
    }

    render(){
        let question = this.props.question;
        return(
            <div className="question-title" onClick={this.handleTitleClick}>{question.title}</div>
        )
    }
}


export class ModifyQuestionPage extends React.Component{
    constructor(props) {
        super(props);
        let question = props.question;
        let tagsStr = ""
        for (let i = 0; i < question.tags.length; i++){
            let tag = question.tags[i];
            tagsStr += (tag.name + " ");
        }
        this.state = {
            titleInput: question.title,
            summaryInput: question.summary,
            detailsInput: question.text,
            tagsInput: tagsStr,
            titleError: "",
            summaryError: "",
            detailsError: "",
            tagsError: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    handleInputChange(e) {
        let newState = Object.assign({}, this.state);
        let inputElem = e.target;
        if (inputElem.parentElement.id === "question-title") {
            newState.titleInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "question-summary") {
            newState.summaryInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "question-text") {
            newState.detailsInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "question-tag-entry") {
            newState.tagsInput = inputElem.value;
        }
        this.setState(() => {return newState});
    }

    handleErrors(errorMsgs) {
        let newState = Object.assign({}, this.state);
        newState.titleError = errorMsgs[0];
        newState.summaryError = errorMsgs[1];
        newState.detailsError = errorMsgs[2];
        newState.tagsError = errorMsgs[3];
        this.setState(() => {return newState});
    }

    render() {
        let dataModel = this.props.dataModel;
        let user = this.props.user;
        let question = this.props.question;
        return (
            <main id="homepage">
                <div id="new-question-page-upper">
                    <div id="question-title">
                        <p className="entry-title">Question Title*</p>
                        <p className="entry-hint">Limit title to 100 characters or less.</p>
                        <input className="entry-box" onChange={this.handleInputChange} value={this.state.titleInput} type="text" placeholder="e.g: How do I add two integers?" />
                        <p className="error-message">{this.state.titleError}</p>
                    </div>
                    <div id="question-summary">
                        <p className="entry-title">Summary*</p>
                        <p className="entry-hint">Limit summary to 140 characters or less.</p>
                        <input className="entry-box" onChange={this.handleInputChange} value={this.state.summaryInput} type="text" placeholder="e.g: This question is about inheritance" />
                        <p className="error-message">{this.state.summaryError}</p>
                    </div>
                    <div id="question-text">
                        <p className="entry-title">Question Text*</p>
                        <p className="entry-hint">Add question details.</p>
                        <textarea className="entry-box" onChange={this.handleInputChange} value={this.state.detailsInput} type="text" placeholder="e.g: I have two integer variables and I want to know how to add them in javascript"></textarea>
                        <p className="error-message">{this.state.detailsError}</p>
                    </div>
                    <div id="question-tag-entry">
                        <p className="entry-title">Tags*</p>
                        <p className="entry-hint">Add at most 5 tags, each separated by whitespace. Tags cannot be more than 10 characters. Hyphenated words count as one word.</p>
                        <input className="entry-box" onChange={this.handleInputChange} value={this.state.tagsInput} type="text" placeholder="e.g: java-script integer addition" />
                        <p className="error-message">{this.state.tagsError}</p>
                    </div>
                </div>
                <div id="new-question-page-lower">
                    <ModifyQuestion user={user} question={question} dataModel={dataModel} inputsAndErrorMsgs={this.state} 
                        handleErrors={this.handleErrors} onTabClick={this.props.changeToDefaultTab} />
                    <p>* indicates mandatory fields</p>
                    <DeleteQuestion user={user} question={question} dataModel={dataModel} onTabClick={this.props.changeToDefaultTab} />
                </div>
            </main>
        );
    }
}

class DeleteQuestion extends React.Component {
    constructor(props){
        super(props);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleDeleteClick(){
        let question = this.props.question;
        axios.post('http://localhost:8000/delete/question', { deleteQuestion: question }, {withCredentials:true})
            .then((res) => {
                this.props.onTabClick("Profile", "newest", null);
            });
    }

    render(){
        return (
            <button id="delete-question" onClick={this.handleDeleteClick}>Delete Question</button>
        );
    }
}


class ModifyQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.handlePostClick = this.handlePostClick.bind(this);
    }

    handlePostClick() {
        let titleInput = this.props.inputsAndErrorMsgs.titleInput;
        let summaryInput = this.props.inputsAndErrorMsgs.summaryInput;
        let detailsInput = this.props.inputsAndErrorMsgs.detailsInput;
        let tagsInput = this.props.inputsAndErrorMsgs.tagsInput;
        let titleError = this.props.inputsAndErrorMsgs.titleError;
        let summaryError = this.props.inputsAndErrorMsgs.summaryError;
        let detailsError = this.props.inputsAndErrorMsgs.detailsError;
        let tagsError = this.props.inputsAndErrorMsgs.tagsError;
        let user = this.props.user;
        let question = this.props.question;

        let newErrorMsgs = [];
        if (titleInput.trim().length === 0) {
            titleError = "*This field is mandatory. You must enter a title.";
        }
        else if (titleInput.trim().length > 100) {
            titleError = "*The question title cannot be more than 100 characters.";
        }
        else {
            titleError = "";
        }
        newErrorMsgs.push(titleError);

        if (summaryInput.trim().length === 0) {
            summaryError = "*This field is mandatory. You must enter a summary.";
        }
        else if (summaryInput.trim().length > 140){
            summaryError = "*The question summary cannot be more than 140 characters.";
        }
        else{
            summaryError = "";
        }
        newErrorMsgs.push(summaryError);

        if (detailsInput.trim().length === 0) {
            detailsError = "*This field is mandatory. You must enter question details.";
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

        let inputTagsArr = tagsInput.trim().split(/\s+/);
        let existingTags = [];
        let newTagNames = [];
        if (inputTagsArr.length === 1 && inputTagsArr[0].length === 0) {
            tagsError = "*This field is mandatory. You must enter relevant tags.";
        }
        else if (inputTagsArr.length > 5) {
            tagsError = "*You cannot add more than 5 tags.";
        }
        else if (inputTagsArr.some(tagStr => tagStr.length > 10)) {
            tagsError = "*A tag cannot be more than 10 characters.";
        }
        else {
            tagsError = "";
            let dataModel = this.props.dataModel;
            let allTags = dataModel.tags;
            for (let i = 0; i < inputTagsArr.length; i++) {
                let inputTag = inputTagsArr[i].toLowerCase();
                let tagObject = allTags.find(tag => tag.name.toLowerCase() === inputTag);
                if (tagObject === undefined) {
                    if (user.rep < 50 && user.admin === false){
                        tagsError = "*Must have at least 50 reputation points to create new tags.";
                        break;
                    }
                    else {
                        newTagNames.push(inputTagsArr[i]);
                    }
                }
                else {
                    existingTags.push(tagObject);
                }
            }
        }
        newErrorMsgs.push(tagsError);


        if (titleError.length === 0 && summaryError.length === 0
            && detailsError.length === 0 && tagsError.length === 0) {
            let promiseList = [];

            for (let i = 0; i < newTagNames.length; i++) {
                let newTag =
                {
                    name: inputTagsArr[i]
                };
                promiseList.push(axios.post('http://localhost:8000/create/tag', newTag, {withCredentials:true}));
            }

            const resolveEveryPost = async (promises) => {
                for (const promise of promises) {
                    let resTag = await promise;
                    let newUser = await axios.post('http://localhost:8000/update/user/tags', {updateUser: user, tag: resTag.data}, {withCredentials:true});
                    existingTags.push(resTag.data);
                }
            }

            resolveEveryPost(promiseList)
                .then(() => {
                    let newQuestion =
                    {
                        title: titleInput,
                        summary: summaryInput,
                        text: detailsInput,
                        tags: existingTags,
                        answers: question.answers,
                        asked_by: user,
                        ask_date_time: question.ask_date_time,
                        views: question.views,
                        votes: question.votes
                    };
                    return axios.post('http://localhost:8000/modify/question', {updateQuestion: question, newQuestion: newQuestion}, {withCredentials:true});
                })
                .then((ques) => {
                    this.props.onTabClick("Profile", "newest", null);
                });
        }
        else {
            this.props.handleErrors(newErrorMsgs);
        }
    }

    render() {
        return (
            <button id="modify-question" onClick={this.handlePostClick}>Modify Question</button>
        );
    }
}

class UserTag extends React.Component {
    constructor(props) {
        super(props);
        this.searchForTag = this.searchForTag.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleModifyClick = this.handleModifyClick.bind(this);
    }

    searchForTag() {
        let tag = this.props.tag;
        parseSentence("[" + tag.name + "]", this.props.onTabClick);
    }

    handleDeleteClick(){
        let tag = this.props.tag;
        let dataModel = this.props.dataModel;
        let allUsers = dataModel.users;
        let user = this.props.user;
        let userObj = allUsers.find((user) => {
            let tagObj = user.created_tags.find(userTag => userTag.name === tag.name);
            return !(tagObj === undefined);
        })
        if (userObj === undefined || userObj.email === user.email){
            axios.post('http://localhost:8000/delete/tag', {deleteTag: tag}, {withCredentials:true})
            .then((res) => {
                this.props.onTabChange("Profile", "newest", null);
            });
        }
    }

    handleModifyClick(){
        let tag = this.props.tag;
        let dataModel = this.props.dataModel;
        let allUsers = dataModel.users;
        let user = this.props.user;
        let userObj = allUsers.find((user) => {
            let tagObj = user.created_tags.find(userTag => userTag.name === tag.name);
            return !(tagObj === undefined);
        })
        if (userObj === undefined || userObj.email === user.email){
            this.props.onTabChange("Modify Tag", "newest", null, user, tag);
        }
    }

    render() {
        let tag = this.props.tag;
        let dataModel = this.props.dataModel;
        let allQuestions = dataModel.questions;
        let questionCount = 0;
        for (let i = 0; i < allQuestions.length; i++) {
            let question = allQuestions[i];
            if (question.tags.map(tag => tag._id).includes(tag._id)) {
                questionCount += 1;
            }
        }
        return (
            <div className="tag-box" id={tag._id}>
                <button className="delete-tag" onClick={this.handleDeleteClick}>delete</button>
                <button className="edit-tag" onClick={this.handleModifyClick}>edit</button>
                <div className="tag-name" onClick={this.searchForTag}>{tag.name}</div>
                <div className="questions-per-tag">{pluralOrNot(questionCount, "question")}</div>
            </div>
        );
    }
}

export class ModifyTagPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            nameInput: props.tag.name,
            nameError: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    handleInputChange(e) {
        let newState = Object.assign({}, this.state);
        let inputElem = e.target;
        if (inputElem.parentElement.id === "enter-tag-name") {
            newState.nameInput = inputElem.value;
        }
        this.setState(() => {return newState});
    }

    handleErrors(errorMsgs) {
        let newState = Object.assign({}, this.state);
        newState.nameError = errorMsgs[0];
        this.setState(() => {return newState});
    }

    render() {
        let currentQType = this.props.currentQType;
        let user = this.props.user;
        let tag = this.props.tag;
        return (
            <main id="homepage">
                <div id="new-answer-page-upper">
                    <div id="enter-tag-name">
                        <p className="entry-title">Tag Name*</p>
                        <p className="entry-hint">Modify Tag Name.</p>
                        <input className="entry-box" onChange={this.handleInputChange} value={this.state.nameInput} type="text" />
                        <p className="error-message">{this.state.nameError}</p>
                    </div>
                </div>
                <div id="new-answer-page-lower">
                    <ModifyTag inputsAndErrorMsgs={this.state} handleErrors={this.handleErrors} user={user}
                        onTabClick={this.props.changeToDefaultTab} currentQType={currentQType} tag={tag}/>
                    <p>* indicates mandatory fields</p>
                </div>
            </main>
        );
    }
}

class ModifyTag extends React.Component{
    constructor(props) {
        super(props);
        this.handlePostClick = this.handlePostClick.bind(this);
    }

    handlePostClick() {
        let nameInput = this.props.inputsAndErrorMsgs.nameInput;
        let nameError = this.props.inputsAndErrorMsgs.nameError;

        let newErrorMsgs = [];

        if (nameInput.trim().length === 0) {
            nameError = "*This field is mandatory. You must enter tag name.";
        }
        else if (nameInput.trim().length > 10) {
            nameError = "*Tags cannot be larger than 10 characters";
        }
        else if (nameInput.trim().includes(" ")){
            nameError = "*Tags cannot contain spaces";
        }
        else{
            nameError = "";
        }
        newErrorMsgs.push(nameError);

        if (nameError.length === 0) {
            let currentQType = this.props.currentQType;
            let tag = this.props.tag;

            let newTag =
            {
                name: nameInput
            };

            axios.post('http://localhost:8000/modify/tag', {updateTag: tag, newTag: newTag}, {withCredentials:true})
                .then((tag) => {
                    this.props.onTabClick("Profile", currentQType, null);
                });
        }
        else {
            this.props.handleErrors(newErrorMsgs);
        }

    }

    render() {
        return (
            <button id="modify-tag" onClick={this.handlePostClick}>Modify Tag</button>
        );
    }
}