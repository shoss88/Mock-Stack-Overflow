// Answer Document Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AnswerSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        ans_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ans_date_time: {
            type: Date,
            default: Date.now
        },
        votes:{
            type: Number,
            default: 0
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }]
    }
);

AnswerSchema
    .virtual("url")
    .get(function () {
        return "posts/answer/" + this._id;
    });

let AnswerModel = mongoose.model("Answer", AnswerSchema);
module.exports = AnswerModel;

module.exports.getAllAnswers = async () => {
    return await AnswerModel.find({})
        .populate("ans_by")
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.insertAnswer = async (body) => {
    const newAnswer = new AnswerModel(body)
    return await newAnswer.save();
}

module.exports.updateVotes = async (answer, incrNum) => {
    return await AnswerModel.findByIdAndUpdate(answer._id, { $inc: { votes: incrNum } }, { new: true })
        .populate("ans_by")
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}

module.exports.updateComments = async (answer, comment) => {
    return await AnswerModel.findByIdAndUpdate(answer._id, { $push: { comments: comment } }, { new: true })
        .populate("ans_by")
        .populate({
            path: 'comments',
            populate: {
                path: 'commented_by'
            }
        })
        .exec();
}