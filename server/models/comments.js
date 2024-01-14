// Comment Document Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema(
    {
        details: {
            type: String,
            required: true,
        },
        commented_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comm_date_time: {
            type: Date,
            default: Date.now
        },
        votes:{
            type: Number,
            default: 0
        }
    }
);

CommentSchema
    .virtual("url")
    .get(function () {
        return "posts/comment/" + this._id;
    });

let CommentModel = mongoose.model("Comment", CommentSchema);
module.exports = CommentModel;

module.exports.getAllComments = async () => {
    return await CommentModel.find({})
        .populate("commented_by")
        .exec();
}

module.exports.insertComment = async (body) => {
    const newComment = new CommentModel(body)
    return await newComment.save();
}

module.exports.updateVotes = async (comment, incrNum) => {
    return await CommentModel.findByIdAndUpdate(comment._id, { $inc: { votes: incrNum } }, { new: true })
        .populate("commented_by")
        .exec();
}