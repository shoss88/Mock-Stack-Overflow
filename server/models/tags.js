// Tag Document Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);

TagSchema
    .virtual("url")
    .get(function () {
        return "posts/tag/" + this._id;
    });

let TagModel = mongoose.model("Tag", TagSchema);
module.exports = TagModel;

module.exports.getAllTags = async () => {
    return await TagModel.find({})
        .exec();
}

module.exports.insertTag = async (body) => {
    const newTag = new TagModel(body)
    return await newTag.save();
}

module.exports.updateTag = async (tag, newTag) => {
    return await TagModel.findByIdAndUpdate(tag._id, newTag, { new: true })
        .exec();
}

module.exports.deleteTag = async (tag) => {
    return await TagModel.findByIdAndDelete(tag._id)
        .exec();
}