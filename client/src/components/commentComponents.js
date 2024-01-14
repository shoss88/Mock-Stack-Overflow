import React from 'react';
import axios from 'axios';
import { pluralOrNot } from './fakestackoverflow.js';
import { PrevButton, NextButton } from './questionComponents.js'

export class CommentSection extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fromIndex: 0,
            toIndex: 2,
            detailsInput: "",
            detailsError: ""
        }
        this.handleDecIndices = this.handleDecIndices.bind(this);
        this.handleIncIndices = this.handleIncIndices.bind(this);
        this.handleCommentError = this.handleCommentError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleDecIndices(){
        this.setState((prevState) => {return {
            fromIndex: prevState.fromIndex - 3,
            toIndex: prevState.toIndex - 3
        }});
    }

    handleIncIndices(){
        this.setState((prevState) => {return {
            fromIndex: prevState.fromIndex + 3,
            toIndex: prevState.toIndex + 3
        }});
    }

    handleInputChange(e) {
        let newState = Object.assign({}, this.state);
        let inputElem = e.target;
        newState.detailsInput = inputElem.value;
        this.setState(() => {return newState});
    }

    handleCommentError(){
        let detailsInput = this.state.detailsInput;
        let user = this.props.user;
        let detailsError = "";
        if (detailsInput.trim().length > 140){
            detailsError = "*Comment cannot be more than 140 characters."
        }
        else if (user.rep < 50 && user.admin === false){
            detailsError = "*Must have at least 50 reputation to comment."
        }

        if (detailsError.length === 0){
            let newComment = {
                details: detailsInput,
                commented_by: user,
                comm_date_time: Date.now(),
                votes: 0
            }
            this.props.handleNewComment(newComment);
        }
        else{
            let newState = Object.assign({}, this.state);
            newState.detailsError = detailsError;
            this.setState(() => {return newState});
        }
    }

    render(){
        let fromIndex = this.state.fromIndex;
        let toIndex = this.state.toIndex;
        let allComments = this.props.comments;
        let user = this.props.user;
        let guestLogin = this.props.guestLogin;

        sortCommNewest(allComments);
        let commentsList = allComments.map((comment) => {
            return <Comment key={comment._id} user={user} guestLogin={guestLogin} comment={comment}/>;
        });
        let displayedC = [];
        for (let i = fromIndex; i < commentsList.length; i++){
            displayedC.push(commentsList[i]);
            if (i === toIndex){
                break;
            }
        }

        let displayName = "flex"
        if (guestLogin){
            displayName = "none";
        }

        return(
            <div className="comment-section">
                {displayedC}
                <input className="comment-entry" style={{display: displayName}} type="text" 
                    placeholder="Enter a comment" onChange={this.handleInputChange}
                    onKeyDown={(key) => {
                        if (key.code === "Enter") {
                            return this.handleCommentError();
                        }
                    }} />
                <p className="comment-error">{this.state.detailsError}</p>
                <div className="next-prev">
                    <PrevButton fromIndex={fromIndex} list={commentsList} onTabClick={this.handleDecIndices}/>
                    <NextButton toIndex={toIndex} list={commentsList} onTabClick={this.handleIncIndices}/>
                </div>
            </div>
        )
    }
}

class Comment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            votes: props.comment.votes,
        }
        this.handleCommUpvote = this.handleCommUpvote.bind(this);
    }

    handleCommUpvote(){
        let comment = this.props.comment;
        axios.post('http://localhost:8000/update/comment/votes', {updateComment: comment, incrNum: 1}, {withCredentials:true})
            .then((comm) => {
                let newState = Object.assign({}, this.state);
                newState.votes = comm.data.votes;
                this.setState(() => {return newState});
            })
    }

    render(){
        let guestLogin = this.props.guestLogin;
        let user = this.props.comment.commented_by;
        let commentDetails = this.props.comment.details;
        return(
            <div className="comment">
                <Upvote guestLogin={guestLogin} onTabClick={this.handleCommUpvote}/>
                <div className="comment-votes">{pluralOrNot(this.state.votes, "vote")}</div>
                <div className="comment-details">{commentDetails}</div>
                <div className="comment-user">commented by {user.username}</div>
            </div>
        )
    }
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
        let guestLogin = this.props.guestLogin;
        let displayName = "flex"
        if (guestLogin){
            displayName = "none";
        }
        return(
            <button className="upvote" style={{display: displayName}} onClick={this.handleTabClick}>Upvote</button>
        )
    }
}

function sortCommNewest(allComments) {
    return allComments.sort(function (c1, c2) {
        if (c1.comm_date_time > c2.comm_date_time) {
            return -1;
        }
        else if (c1.comm_date_time < c2.comm_date_time) {
            return 1;
        }
        else {
            return 0;
        }
    });
}