import React from 'react';
import { pluralOrNot, formattedDate } from './fakestackoverflow.js';
import axios from 'axios';

export class QuestionsPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            fromIndex: 0,
            toIndex: 4
        }
        this.handleDecIndices = this.handleDecIndices.bind(this);
        this.handleIncIndices = this.handleIncIndices.bind(this);
    }

    handleDecIndices(){
        this.setState((prevState) => {
            return {
                fromIndex: prevState.fromIndex - 5,
                toIndex: prevState.toIndex - 5
            }
        });
    }

    handleIncIndices(){
        this.setState((prevState) => {
            return {
                fromIndex: prevState.fromIndex + 5,
                toIndex: prevState.toIndex + 5
            }
        });
    }

    render(){
        let dataModel = this.props.dataModel;
        let currentQType = this.props.currentQType;
        let allQuestions = dataModel.questions;
        let searchWords = this.props.searchWords;
        let searchTags = this.props.searchTags;
        let guestLogin = this.props.guestLogin;
        let fromIndex = this.state.fromIndex;
        let toIndex = this.state.toIndex;
        let questionList = [];
        let upperQuestionsPara = "All Questions";
        if (currentQType === "newest") {
            if (searchWords.length === 0 && searchTags.length === 0) {
                sortQNewest(allQuestions);
                questionList = allQuestions.map((question) => {
                    return <Question key={question._id} question={question}
                        currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />
                });

            }
            else {
                let filteredQuestions = findQuestions(searchWords, searchTags, allQuestions, dataModel, currentQType);
                if (filteredQuestions.length === 0) {
                    questionList = <NoQuestionsElement />
                }
                else {
                    questionList = filteredQuestions.map((question) =>
                        <Question key={question._id} question={question}
                            currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />);
                }
                upperQuestionsPara = "Search Results";
            }
        }
        else if (currentQType === "active") {
            if (searchWords.length === 0 && searchTags.length === 0) {
                sortQNewestAns(allQuestions);
                questionList = allQuestions.map((question) =>
                    <Question key={question._id} question={question}
                        currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />);
            }
            else {
                let filteredQuestions = findQuestions(searchWords, searchTags, allQuestions, dataModel, currentQType);
                if (filteredQuestions.length === 0) {
                    questionList = <NoQuestionsElement />
                }
                else {
                    questionList = filteredQuestions.map((question) =>
                        <Question key={question._id} question={question}
                            currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />);
                }
                upperQuestionsPara = "Search Results";
            }
        }
        else if (currentQType === "unanswered") {
            let unansweredQuestions = allQuestions.filter(question => question.answers.length === 0);
            if (searchWords.length === 0 && searchTags.length === 0) {
                questionList = unansweredQuestions.map((question) =>
                    <Question key={question._id} question={question}
                        currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />);
            }
            else {
                let filteredQuestions = findQuestions(searchWords, searchTags, unansweredQuestions, dataModel, currentQType);
                if (filteredQuestions.length === 0) {
                    questionList = <NoQuestionsElement />
                }
                else {
                    questionList = filteredQuestions.map((question) =>
                        <Question key={question._id} question={question}
                            currentQType={currentQType} changeToDefaultTab={this.props.changeToDefaultTab} />);
                }
                upperQuestionsPara = "Search Results";
            }
        }

        let displayedQ = [];
        let totalQuestions = pluralOrNot(0, "question");
        if (Array.isArray(questionList)) {
            totalQuestions = pluralOrNot(questionList.length, "question");
            for (let i = fromIndex; i < questionList.length; i++){
                displayedQ.push(questionList[i]);
                if (i === toIndex){
                    break;
                }
            }
        }
        else{
            displayedQ = questionList;
        }

        return (
            <main id="homepage">
                <div id="questions-header">
                    <div id="upper-questions-header">
                        <p>{upperQuestionsPara}</p>
                        <AskQuestion guestLogin={guestLogin} onTabClick={this.props.changeToDefaultTab} currentQType={currentQType} />
                    </div>
                    <div id="lower-questions-header">
                        <p id="total-questions">{totalQuestions}</p>
                        <QuestionSelector currentQType={currentQType} changeCurrentQType={this.props.changeCurrentQType} />
                    </div>
                </div>
                <div id="questions-section">
                    {displayedQ}
                </div>
                <div className="next-prev">
                    <PrevButton fromIndex={fromIndex} list={questionList} onTabClick={this.handleDecIndices}/>
                    <NextButton toIndex={toIndex} list={questionList} onTabClick={this.handleIncIndices}/>
                </div>
            </main>
        );
    }
}


export function PrevButton(props){
    let fromIndex = props.fromIndex;
    let list = props.list;
    let displayName = "flex";
    if (!Array.isArray(list) || fromIndex <= 0) {
        displayName = "none";
    }
    return (
        <button className="prev-button" style={{display:displayName}} onClick={props.onTabClick}>{"<= Prev"}</button>
    );
}


export function NextButton(props){
    let toIndex = props.toIndex;
    let list = props.list;
    let displayName = "flex";
    if (!Array.isArray(list) || toIndex >= list.length - 1) {
        displayName = "none";
    }
    return (
        <button className="next-button" style={{display:displayName}} onClick={props.onTabClick}>{"Next =>"}</button>
    );
}


export class AskQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange() {
        this.props.onTabClick("New Question", this.props.currentQType, null);
    }

    render() {
        let guestLogin = this.props.guestLogin;
        let displayName = "flex";
        if (guestLogin){
            displayName = "none";
        }
        return (
            <button id="ask-question" style={{display: displayName}} onClick={this.handleTabChange}>Ask Question</button>
        );
    }
}


function QuestionSelector(props) {
    let currentQType = props.currentQType;
    let newestQClass = "question-type";
    let mostActiveQClass = "question-type";
    let unansweredQClass = "question-type";
    if (currentQType === "newest") {
        newestQClass += " active-type";
    }
    else if (currentQType === "active") {
        mostActiveQClass += " active-type";
    }
    else if (currentQType === "unanswered") {
        unansweredQClass += " active-type";
    }

    return (
        <div id="question-selector">
            <NewestQTab className={newestQClass} onTabClick={props.changeCurrentQType} />
            <MostActiveQTab className={mostActiveQClass} onTabClick={props.changeCurrentQType} />
            <UnansweredQTab className={unansweredQClass} onTabClick={props.changeCurrentQType} />
        </div>
    );
}


class NewestQTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleQTabChange = this.handleQTabChange.bind(this);
    }

    handleQTabChange() {
        this.props.onTabClick("newest");
    }

    render() {
        let className = this.props.className;
        return (
            <button id="newest-q" className={className} onClick={this.handleQTabChange}>Newest</button>
        );
    }
}


class MostActiveQTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleQTabChange = this.handleQTabChange.bind(this);
    }

    handleQTabChange() {
        this.props.onTabClick("active");
    }

    render() {
        let className = this.props.className;
        return (
            <button id="most-active-q" className={className} onClick={this.handleQTabChange}>Active</button>
        );
    }
}


class UnansweredQTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleQTabChange = this.handleQTabChange.bind(this);
    }

    handleQTabChange() {
        this.props.onTabClick("unanswered");
    }

    render() {
        let className = this.props.className;
        return (
            <button id="unanswered-q" className={className} onClick={this.handleQTabChange}>Unanswered</button>
        );
    }
}


export class Question extends React.Component {
    constructor(props) {
        super(props);
        this.handleQuestionClick = this.handleQuestionClick.bind(this);
    }

    handleQuestionClick() {
        let question = this.props.question;
        let currentQType = this.props.currentQType;
        axios.post('http://localhost:8000/update/question/views', { updateQuestion: question }, {withCredentials:true})
            .then((res) => {
                this.props.changeToDefaultTab("Answers", currentQType, res.data);
            });
    }

    render() {
        let question = this.props.question;
        let tagsList = question.tags.map((tag) => <QuestionTag key={tag._id} tagObject={tag} />);
        return (
            <div className="question-box" id={question._id}>
                <div className="question-stats">
                    <div className="question-answers">{pluralOrNot(question.answers.length, "answer")}</div>
                    <div className="question-views">{pluralOrNot(question.views, "view")}</div>
                    <div className="question-votes">{pluralOrNot(question.votes, "vote")}</div>
                </div>
                <div className="question-main">
                    <div className="question-title" onClick={this.handleQuestionClick}>{question.title}</div>
                    <div className="question-summary">{question.summary}</div>
                    <div className="question-tags">{tagsList}</div>
                </div>
                <div className="question-metadata">
                    <div className="question-username">{question.asked_by.username}</div>
                    <div className="question-date">asked {formattedDate(question.ask_date_time)}</div>
                </div>
            </div>
        );
    }
}


export function QuestionTag(props) {
    let tagName = props.tagObject.name;
    return (
        <div className="tag">{tagName}</div>
    );
}


export class NewQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleInput: "",
            summaryInput: "",
            detailsInput: "",
            tagsInput: "",
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
        return (
            <main id="homepage">
                <div id="new-question-page-upper">
                    <div id="question-title">
                        <p className="entry-title">Question Title*</p>
                        <p className="entry-hint">Limit title to 100 characters or less.</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" placeholder="e.g: How do I add two integers?" />
                        <p className="error-message">{this.state.titleError}</p>
                    </div>
                    <div id="question-summary">
                        <p className="entry-title">Summary*</p>
                        <p className="entry-hint">Limit summary to 140 characters or less.</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" placeholder="e.g: This question is about inheritance" />
                        <p className="error-message">{this.state.summaryError}</p>
                    </div>
                    <div id="question-text">
                        <p className="entry-title">Question Text*</p>
                        <p className="entry-hint">Add question details.</p>
                        <textarea className="entry-box" onChange={this.handleInputChange} type="text" placeholder="e.g: I have two integer variables and I want to know how to add them in javascript"></textarea>
                        <p className="error-message">{this.state.detailsError}</p>
                    </div>
                    <div id="question-tag-entry">
                        <p className="entry-title">Tags*</p>
                        <p className="entry-hint">Add at most 5 tags, each separated by whitespace. Tags cannot be more than 10 characters. Hyphenated words count as one word.</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" placeholder="e.g: java-script integer addition" />
                        <p className="error-message">{this.state.tagsError}</p>
                    </div>
                </div>
                <div id="new-question-page-lower">
                    <PostQuestion user={user} dataModel={dataModel} inputsAndErrorMsgs={this.state} 
                        handleErrors={this.handleErrors} onTabClick={this.props.changeToDefaultTab} />
                    <p>* indicates mandatory fields</p>
                </div>
            </main>
        );
    }
}


class PostQuestion extends React.Component {
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
                        answers: [],
                        asked_by: user,
                        ask_date_time: Date.now(),
                        views: 0,
                        votes: 0
                    };
                    return axios.post('http://localhost:8000/create/question', newQuestion, {withCredentials:true});
                })
                .then((ques) => {
                    return axios.post('http://localhost:8000/update/user/asked', {updateUser: user, question: ques.data}, {withCredentials:true})
                })
                .then((user) => {
                    this.props.onTabClick("Questions", "newest", null, user.data);
                });
        }
        else {
            this.props.handleErrors(newErrorMsgs);
        }
    }

    render() {
        return (
            <button id="post-question" onClick={this.handlePostClick}>Post Question</button>
        );
    }
}


// Sort questions by their most recent ask date.
export function sortQNewest(allQuestions) {
    return allQuestions.sort(function (q1, q2) {
        if (q1.ask_date_time > q2.ask_date_time) {
            return -1;
        }
        else if (q1.ask_date_time < q2.ask_date_time) {
            return 1;
        }
        else {
            return 0;
        }
    });
}

// Sorts the answers of a question by most recent.
export function sortAnsByDate(question) {
    let sortedAns = question.answers.sort(function (a1, a2) {
        if (a1.ans_date_time > a2.ans_date_time) {
            return -1;
        }
        else if (a1.ans_date_time < a2.ans_date_time) {
            return 1;
        }
        else {
            return 0;
        }
    });
    return sortedAns;
}

// Sorts questions by their most recent answer.
export function sortQNewestAns(allQuestions) {
    return allQuestions.sort(function (q1, q2) {
        // First sort the answer ids within each question.
        let date1Arr = sortAnsByDate(q1);
        let date2Arr = sortAnsByDate(q2);
        // Now compare the gathered answer dates from the first element of each array.
        if (date2Arr.length === 0 && date1Arr.length !== 0) {
            return -1;
        }
        else if (date1Arr.length === 0 && date2Arr.length !== 0) {
            return 1;
        }
        else if (date1Arr.length === 0 && date2Arr.length === 0) {
            return 0;
        }
        else if (date1Arr[0].ans_date_time > date2Arr[0].ans_date_time) {
            return -1
        }
        else if (date1Arr[0].ans_date_time < date2Arr[0].ans_date_time) {
            return 1;
        }
        else {
            return 0;
        }
    });
}

// Uses search words to check for which questions contain them in their title or text, 
// and returns those questions in an array.
function findQuestions(searchWords, searchTags, allQuestions, model, sortMethod) {
    let searchedQuestions = [];
    for (let i = 0; i < searchWords.length; i++) {
        let searchWord = searchWords[i].toLowerCase();
        for (let j = 0; j < allQuestions.length; j++) {
            let question = allQuestions[j];
            if (!(searchedQuestions.map(sQues => sQues._id).includes(question._id)) &&
                (question.title.toLowerCase().includes(searchWord) || question.text.toLowerCase().includes(searchWord))) {
                searchedQuestions.push(question);
            }
        }
    }
    let allTags = model.tags;
    for (let i = 0; i < searchTags.length; i++) {
        let searchTag = searchTags[i].toLowerCase();
        let tagObject = allTags.find(tag => tag.name.toLowerCase() === searchTag);
        if (tagObject !== undefined) {
            for (let j = 0; j < allQuestions.length; j++) {
                let question = allQuestions[j];
                if (!(searchedQuestions.map(sQues => sQues._id).includes(question._id)) &&
                    question.tags.map(tag => tag._id).includes(tagObject._id)) {
                    searchedQuestions.push(question);
                }
            }
        }
    }
    if (sortMethod === "newest") {
        return sortQNewest(searchedQuestions);
    }
    else if (sortMethod === "active") {
        return sortQNewestAns(searchedQuestions);
    }
    else {
        return searchedQuestions;
    }
}

function NoQuestionsElement() {
    return (
        <p id="no-questions">No Questions Found</p>
    );
}