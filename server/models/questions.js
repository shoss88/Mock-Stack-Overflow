// Question Document Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuestionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 50
        },
        summary:{
            type: String,
            required: true,
            maxLength: 140
        },
        text: {
            type: String,
            required: true,
        },
        tags: [{
            type: Schema.Types.ObjectId,
            ref: "Tag",
            required: true
        }],
        answers: [{
            type: Schema.Types.ObjectId,
            ref: "Answer"
        }],
        asked_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ask_date_time: {
            type: Date,
            default: Date.now
        },
        views: {
            type: Number,
            default: 0
        },
        votes: {
            type: Number,
            default: 0
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }]
    }
);

QuestionSchema
    .virtual("url")
    .get(function () {
        return "posts/question/" + this._id;
    });

let QuestionModel = mongoose.model("Question", QuestionSchema);
module.exports = QuestionModel;

module.exports.getAllQuestions = async () => {
    return await QuestionModel.find({})
        .populate('tags')
        .populate({
            path: 'answers',
            populate: {
                path: 'ans_by'
            }
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.insertQuestion = async (body) => {
    const newQuestion = new QuestionModel(body)
    return await newQuestion.save();
}

module.exports.updateAnswers = async (question, answer) => {
    return await QuestionModel.findByIdAndUpdate(question._id, { $push: { answers: answer } }, { new: true })
        .populate('tags')
        .populate({
            path: 'answers',
            populate: {
                path: 'ans_by'
            }
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.updateViews = async (question) => {
    return await QuestionModel.findByIdAndUpdate(question._id, { $inc: { views: 1 } }, { new: true })
        .populate('tags')
        .populate({
            path: 'answers',
            populate: [
                {path: 'ans_by'},
                {path: 'comments',
                populate: {
                    path: 'commented_by'
                }
                },
            ]
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.updateVotes = async (question, incrNum) => {
    return await QuestionModel.findByIdAndUpdate(question._id, { $inc: { votes: incrNum } }, { new: true })
        .populate('tags')
        .populate({
            path: 'answers',
            populate: [
                {path: 'ans_by'},
                {path: 'comments',
                populate: {
                    path: 'commented_by'
                }
                },
            ]
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.updateComments = async (question, comment) => {
    return await QuestionModel.findByIdAndUpdate(question._id, { $push: { comments: comment } }, { new: true })
        .populate('tags')
        .populate({
            path: 'answers',
            populate: [
                {path: 'ans_by'},
                {path: 'comments',
                populate: {
                    path: 'commented_by'
                }
                },
            ]
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.updateQuestion = async (question, newQuestion) => {
    return await QuestionModel.findByIdAndUpdate(question._id, newQuestion, { new: true })
        .populate('tags')
        .populate({
            path: 'answers',
            populate: [
                {path: 'ans_by'},
                {path: 'comments',
                populate: {
                    path: 'commented_by'
                }
                },
            ]
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.deleteQuestion = async (question) => {
    return await QuestionModel.findByIdAndDelete(question._id)
        .populate('tags')
        .populate({
            path: 'answers',
            populate: [
                {path: 'ans_by'},
                {path: 'comments',
                populate: {
                    path: 'commented_by'
                }
                },
            ]
        })
        .populate('asked_by')
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}