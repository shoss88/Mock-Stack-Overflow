import React from 'react';
import { pluralOrNot, parseSentence } from './fakestackoverflow.js';
import { AskQuestion } from './questionComponents.js'

export default function TagsPage(props) {
    let currentQType = props.currentQType;
    let guestLogin = props.guestLogin;
    let dataModel = props.dataModel;
    let allTags = dataModel.tags;
    let tagsList = allTags.map((tag) => <Tag key={tag._id} tag={tag} dataModel={dataModel}
        onTabClick={props.changeSearchResults} />);
    return (
        <main id="homepage">
            <div id="tags-header">
                <div id="total-tags">{pluralOrNot(allTags.length, "tag")}</div>
                <p>All Tags</p>
                <AskQuestion guestLogin={guestLogin} onTabClick={props.changeToDefaultTab} currentQType={currentQType} />
            </div>
            <div id="tags-section-wrap">
                <div id="tags-section">
                    {tagsList}
                </div>
            </div>
        </main>
    );
}

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.searchForTag = this.searchForTag.bind(this);
    }

    searchForTag() {
        let tag = this.props.tag;
        parseSentence("[" + tag.name + "]", this.props.onTabClick);
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
                <div className="tag-name" onClick={this.searchForTag}>{tag.name}</div>
                <div className="questions-per-tag">{pluralOrNot(questionCount, "question")}</div>
            </div>
        );
    }
}