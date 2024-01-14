import React from 'react';
import axios from 'axios';
import './stylesheets/App.css';
import { HeaderSection, SideBarSection, HomePageSection } from './components/fakestackoverflow.js'
import { WelcomePage, RegisterPage, LoginPage } from './components/welcomeComponents.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: { questions: [], tags: [], answers: [], users: [] },
            activeTab: "Questions",
            currentQType: "newest",
            searchValue: "",
            searchWords: [],
            searchTags: [],
            questionForAnsPage: null,
            modelChanged: false,
            currentPage: "Welcome",
            guestLogin: true,
            user: null,
            tag: null
        };

        this.handleChangeCurrentQType = this.handleChangeCurrentQType.bind(this);
        this.handleResetToDefaultPage = this.handleResetToDefaultPage.bind(this);
        this.handleSearchResults = this.handleSearchResults.bind(this);
        this.handleSearchValue = this.handleSearchValue.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        fetchData()
            .then((newDataModel) => {
                if (this.state.modelChanged) {
                    let newState = Object.assign({}, this.state);
                    newState.model = newDataModel;
                    newState.modelChanged = false;
                    this.setState(() => { return newState });
                }
            });
    }

    componentDidMount() {
        fetchData()
            .then((newDataModel) => {
                let newState = Object.assign({}, this.state);
                newState.model = newDataModel;
                this.setState(() => {return newState});
            });
    }

    handleChangeCurrentQType(qTypeName) {
        let newState = Object.assign({}, this.state);
        newState.currentQType = qTypeName;
        this.setState(() => {return newState});
    }

    handleResetToDefaultPage(tabName, qTypeName, question, user = this.state.user, tag = this.state.tag) {
        let newState = Object.assign({}, this.state);
        newState.activeTab = tabName;
        newState.currentQType = qTypeName;
        newState.searchValue = "";
        newState.searchWords = [];
        newState.searchTags = [];
        newState.questionForAnsPage = question;
        newState.modelChanged = true;
        newState.user = user;
        newState.tag = tag;
        this.setState(() => {return newState});
    }

    handleSearchResults(searchWords, searchTags, newSearchValue) {
        let newState = Object.assign({}, this.state);
        newState.searchValue = newSearchValue;
        newState.searchWords = searchWords;
        newState.searchTags = searchTags;
        newState.activeTab = "Questions";
        newState.currentQType = "newest";
        this.setState(() => {return newState});
    }

    handleSearchValue(newSearchValue) {
        let newState = Object.assign({}, this.state);
        newState.searchValue = newSearchValue;
        this.setState(() => {return newState});
    }

    handleChangePage(pageName, isGuest = this.state.guestLogin, 
        modelChanged = this.state.modelChanged, user = this.state.user){
        let newState = Object.assign({}, this.state);
        newState.activeTab = "Questions";
        newState.currentQType = "newest";
        newState.searchValue = "";
        newState.searchWords = [];
        newState.searchTags = [];
        newState.questionForAnsPage = null;
        newState.currentPage = pageName;
        newState.guestLogin = isGuest;
        newState.modelChanged = modelChanged;
        newState.user = user;
        this.setState(() => {return newState});
    }

    render() {
        let activeTab = this.state.activeTab;
        let dataModel = this.state.model;
        let currentQType = this.state.currentQType;
        let searchValue = this.state.searchValue;
        let searchWords = this.state.searchWords;
        let searchTags = this.state.searchTags;
        let questionForAnsPage = this.state.questionForAnsPage;
        let currentPage = this.state.currentPage;
        let user = this.state.user;
        let tag = this.state.tag;
        
        let site = null;
        if (currentPage === "Welcome"){
            site = 
            <section className="fakeso">
                <HeaderSection displaySearchBar={"none"} logoutStyle={"none"} profileStyle={"none"} changeSearchResults={this.handleSearchResults} 
                    currentQType={currentQType} changeToDefaultTab={this.handleResetToDefaultPage} 
                    changeSearchValue={this.handleSearchValue} searchValue={searchValue} />
                <WelcomePage dataModel={dataModel} changePage={this.handleChangePage} />
            </section>
        }
        else if (currentPage === "Register"){
            site = 
            <section className="fakeso">
                <HeaderSection displaySearchBar={"none"} logoutStyle={"none"} profileStyle={"none"} changeSearchResults={this.handleSearchResults} 
                    currentQType={currentQType} changeToDefaultTab={this.handleResetToDefaultPage} 
                    changeSearchValue={this.handleSearchValue} searchValue={searchValue} />
                <RegisterPage dataModel={dataModel} changePage={this.handleChangePage} />
            </section>
        }
        else if (currentPage === "Login"){
            site = 
            <section className="fakeso">
                <HeaderSection displaySearchBar={"none"} logoutStyle={"none"} profileStyle={"none"} changeSearchResults={this.handleSearchResults} 
                    currentQType={currentQType} changeToDefaultTab={this.handleResetToDefaultPage} 
                    changeSearchValue={this.handleSearchValue} searchValue={searchValue} />
                <LoginPage dataModel={dataModel} changePage={this.handleChangePage}/>
            </section>
        }
        else if (currentPage === "Home"){
            let guestLogin = this.state.guestLogin;
            let logoutStyle = "flex";
            let profileStyle = "flex";
            if (guestLogin){
                logoutStyle = "guest";
                profileStyle = "none";
            }
            site = 
            <section className="fakeso">
                <HeaderSection displaySearchBar={"flex"} logoutStyle={logoutStyle} profileStyle={profileStyle}
                    changePage={this.handleChangePage} changeSearchResults={this.handleSearchResults} currentQType={currentQType}
                    changeToDefaultTab={this.handleResetToDefaultPage} changeSearchValue={this.handleSearchValue} searchValue={searchValue} />
                <SideBarSection activeTab={activeTab} currentQType={currentQType} changeToDefaultTab={this.handleResetToDefaultPage} />
                <HomePageSection dataModel={dataModel} guestLogin={guestLogin} user={user}
                    activeTab={activeTab} currentQType={currentQType} questionForAnsPage={questionForAnsPage}
                    changeCurrentQType={this.handleChangeCurrentQType} changeToDefaultTab={this.handleResetToDefaultPage}
                    changeSearchValue={this.handleSearchValue} searchWords={searchWords}
                    searchTags={searchTags} changeSearchResults={this.handleSearchResults} tag={tag}/>
            </section>
        }

        return (
            site
        );
    }
}

async function fetchData() {
    const resQuestions = await axios.get('http://localhost:8000/questions', {withCredentials:true});
    const resTags = await axios.get('http://localhost:8000/tags', {withCredentials:true});
    const resAnswers = await axios.get('http://localhost:8000/answers', {withCredentials:true});
    const resUsers = await axios.get('http://localhost:8000/users', {withCredentials:true});
    return {
        questions: resQuestions.data,
        tags: resTags.data,
        answers: resAnswers.data,
        users: resUsers.data
    };
}

export default App;