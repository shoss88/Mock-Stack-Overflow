import React from 'react';
import axios from 'axios';
import { QuestionsPage, NewQuestionPage } from './questionComponents.js'
import { AnswersPage, NewAnswerPage } from './answerComponents.js'
import { ProfilePage, ModifyQuestionPage, ModifyTagPage} from './profileComponents.js';
import TagsPage from './tagComponents.js'

export class HeaderSection extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(e) {
        this.props.changeSearchValue(e.target.value);
    }

    render() {
        let searchValue = this.props.searchValue;
        let searchBarStyle = this.props.displaySearchBar;
        let logoutStyle = this.props.logoutStyle;
        let profileStyle = this.props.profileStyle;
        let currentQType = this.props.currentQType;
        return (
            <header>
                <p id="title">Fake Stack Overflow</p>
                <input id="main-searchbar" type="text" placeholder="Search" value={searchValue} style={{display: searchBarStyle}}
                    onChange={this.handleSearchChange}
                    onKeyDown={(key) => {
                        if (key.code === "Enter") {
                            return parseSentence(searchValue, this.props.changeSearchResults);
                        }
                    }} />
                <Logout logoutStyle={logoutStyle} onTabClick={this.props.changePage}/>
                <Profile profileStyle={profileStyle} currentQType={currentQType} onTabClick={this.props.changeToDefaultTab}/>
            </header>
        );
    }
}


class Logout extends React.Component{
    constructor(props){
        super(props);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick(){
        axios.post('http://localhost:8000/logout', {}, {withCredentials:true})
            .then((res) => {
                this.props.onTabClick("Welcome", true);
            })
    }

    render(){
        let logoutStyle = this.props.logoutStyle;
        let displayName = "flex";
        let buttonText = "Logout";
        if (logoutStyle === "guest"){
            buttonText = "Logout (Guest)";
        }
        else if (logoutStyle === "none"){
            displayName = "none";
        }
        return <button id="logout" onClick={this.handleLogoutClick} style={{display: displayName}}>{buttonText}</button>;
    }
}

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.handleProfileClick = this.handleProfileClick.bind(this);
    }

    handleProfileClick(){
        this.props.onTabClick("Profile", this.props.currentQType, null);
    }

    render(){
        let profileStyle = this.props.profileStyle;
        return <button id="profile-button" onClick={this.handleProfileClick} style={{display: profileStyle}}>Profile</button>;
    }
}


export function SideBarSection(props) {
    let questionTabClass = "sidebar-tab";
    let tagTabClass = "sidebar-tab"
    if (props.activeTab === "Questions") {
        questionTabClass += " active-tab";
    }
    else if (props.activeTab === "Tags") {
        tagTabClass += " active-tab";
    }
    let currentQType = props.currentQType;
    return (
        <nav id="main-sidebar">
            <QuestionTab className={questionTabClass} onTabClick={props.changeToDefaultTab} currentQType={currentQType} />
            <TagTab className={tagTabClass} onTabClick={props.changeToDefaultTab} currentQType={currentQType} />
        </nav>
    );
}


class QuestionTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange() {
        this.props.onTabClick("Questions", this.props.currentQType, null);
    }

    render() {
        let className = this.props.className;
        return (
            <button id="question-tab" className={className} onClick={this.handleTabChange}>Questions</button>
        );
    }
}


class TagTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange() {
        this.props.onTabClick("Tags", this.props.currentQType, null);
    }

    render() {
        let className = this.props.className;
        return (
            <button id="tag-tab" className={className} onClick={this.handleTabChange}>Tags</button>
        );
    }
}


export function HomePageSection(props) {
    let activeTab = props.activeTab;
    let dataModel = props.dataModel;
    let currentQType = props.currentQType;
    let questionForAnsPage = props.questionForAnsPage;
    let guestLogin = props.guestLogin;
    let user = props.user;
    let tag = props.tag;
    let homePage = null;
    if (activeTab === "Questions") {
        homePage = <QuestionsPage user={user} dataModel={dataModel} currentQType={currentQType}
            searchWords={props.searchWords} searchTags={props.searchTags} guestLogin={guestLogin}
            changeCurrentQType={props.changeCurrentQType} changeToDefaultTab={props.changeToDefaultTab} />;
    }
    else if (activeTab === "New Question") {
        homePage = <NewQuestionPage user={user} dataModel={dataModel} changeToDefaultTab={props.changeToDefaultTab} />;
    }
    else if (activeTab === "Answers") {
        homePage = <AnswersPage user={user} question={questionForAnsPage} guestLogin={guestLogin}
            currentQType={currentQType} changeToDefaultTab={props.changeToDefaultTab} />;
    }
    else if (activeTab === "New Answer") {
        homePage = <NewAnswerPage user={user} question={questionForAnsPage}
            currentQType={currentQType} changeToDefaultTab={props.changeToDefaultTab} />;
    }
    else if (activeTab === "Tags") {
        homePage = <TagsPage user={user} dataModel={dataModel} currentQType={currentQType} guestLogin={guestLogin}
            changeToDefaultTab={props.changeToDefaultTab} changeSearchResults={props.changeSearchResults} />;
    }
    else if (activeTab === "Profile"){
        homePage = <ProfilePage user={user} dataModel={dataModel} guestLogin={guestLogin}
            currentQType={currentQType} changeToDefaultTab={props.changeToDefaultTab} changeSearchResults={props.changeSearchResults}/>;
    }
    else if (activeTab === "Modify Question"){
        homePage = <ModifyQuestionPage user={user} dataModel={dataModel} question={questionForAnsPage}
            currentQType={currentQType} changeToDefaultTab={props.changeToDefaultTab} />;
    }
    else if (activeTab === "Modify Tag"){
        homePage = <ModifyTagPage user={user} dataModel={dataModel} 
            currentQType={currentQType} changeToDefaultTab={props.changeToDefaultTab} tag={tag}/>;
    }

    return (
        homePage
    );
}


// Given a number and a unit, if the number is > 1, make the unit plural, otherwise leave it. 
// Return as a combined string of num and unit.
export function pluralOrNot(num, unit) {
    if (num > 1 || num === 0) {
        unit += "s";
    }
    return num + " " + unit;
}

// Given a month index, return the abbreviated string version of itself.
function monthToStr(month) {
    let monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July",
        "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthStrings[month];
}

// Given a number, add 1 leading zero if it is < 10, otherwise leave it. Return as a string.
function addZero(num) {
    let str = "";
    if (num < 10) {
        str += 0;
    }
    return str + num;
}

// Given the current date and the comparing date, return the properly formatted date.
export function formattedDate(questionMillis) {
    let dateStr = "";
    let currentDate = new Date();
    let questionDate = new Date(questionMillis);
    let msDifference = currentDate - questionDate;
    if (Math.floor(msDifference / 1000) < 60) {
        let seconds = Math.floor(msDifference / 1000);
        dateStr += pluralOrNot(seconds, "second") + " ago";
    }
    else if (Math.floor(msDifference / 1000 / 60) < 60) {
        let minutes = Math.floor(msDifference / 1000 / 60);
        dateStr += pluralOrNot(minutes, "minute") + " ago";
    }
    else if (Math.floor(msDifference / 1000 / 60 / 60) < 24) {
        let hours = Math.floor(msDifference / 1000 / 60 / 60);
        dateStr += pluralOrNot(hours, "hour") + " ago";
    }
    else if (questionDate.getFullYear() !== currentDate.getFullYear()) {
        dateStr += monthToStr(questionDate.getMonth()) + " "
            + questionDate.getDate() + ", "
            + questionDate.getFullYear() + " at "
            + addZero(questionDate.getHours()) + ":" + addZero(questionDate.getMinutes());
    }
    else if (questionDate.getMonth() !== currentDate.getMonth() || questionDate.getDate() !== currentDate.getDate()) {
        dateStr += monthToStr(questionDate.getMonth()) + " "
            + questionDate.getDate() + " at "
            + addZero(questionDate.getHours()) + ":" + addZero(questionDate.getMinutes());
    }
    return dateStr;
}

// Checks the main searchbar for search words and tags. Filters and displays questions based on them.
export function parseSentence(sentence, changeSearchResults) {
    let searchBarSentence = sentence.trim();
    let searchWords = [];
    let searchTags = [];
    let word = "";
    let lookForSearchTag = false;
    for (let i = 0; i < searchBarSentence.length; i++) {
        let ch = searchBarSentence.charAt(i);
        if (!lookForSearchTag && !(/\s/.test(ch))) {
            if (ch === '[' && word.length === 0) {
                word += ch;
                lookForSearchTag = true;
            }
            else if (i === searchBarSentence.length - 1) {
                word += ch;
                searchWords.push(word);
                word = "";
            }
            else {
                word += ch;
            }
        }
        else if (lookForSearchTag && !(/\s/.test(ch))) {
            if ((ch === ']' && i === searchBarSentence.length - 1) ||
                (ch === ']' && i + 1 < searchBarSentence.length && searchBarSentence[i + 1] !== ']')) {
                searchTags.push(word.substring(1));
                word = "";
                lookForSearchTag = false;
            }
            else if (ch !== ']' && i === searchBarSentence.length - 1) {
                word += ch;
                searchWords.push(word);
                word = "";
                lookForSearchTag = false;
            }
            else {
                word += ch;
            }
        }
        else if (/\s/.test(ch) && word.length > 0) {
            searchWords.push(word);
            word = "";
            lookForSearchTag = false;
        }
    }
    if (searchBarSentence.length === 0) {
        changeSearchResults(searchWords, searchTags, searchBarSentence);
    }
    else {
        changeSearchResults(searchWords, searchTags, sentence);
    }
}