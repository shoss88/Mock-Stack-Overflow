// User Document Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            required: true
        },
        member_time: {
            type: Date,
            default: Date.now
        },
        rep: {
            type: Number,
            default: 0
        },
        asked_qs: [{
            type: Schema.Types.ObjectId,
            ref: "Question"
        }],
        created_tags: [{
            type: Schema.Types.ObjectId,
            ref: "Tag"
        }],
        answered_qs: [{
            type: Schema.Types.ObjectId,
            ref: "Question"
        }]
    }
);

UserSchema
    .virtual("url")
    .get(function () {
        return "posts/user/" + this._id;
    });

let UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;

module.exports.getAllUsers = async () => {
    return await UserModel.find({})
        .populate({
            path: 'asked_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .populate('created_tags')
        .populate({
            path: 'answered_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .exec();
}

module.exports.insertUser = async (body) => {
    const newUser = new UserModel(body);
    return await newUser.save();
}

module.exports.updateRep = async (user, incrNum) => {
    return await UserModel.findByIdAndUpdate(user._id, { $inc: { rep: incrNum } }, { new: true })
        .populate({
            path: 'asked_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .populate('created_tags')
        .populate({
            path: 'answered_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .exec();
}

module.exports.updateAskedQ = async (user, question) => {
    return await UserModel.findByIdAndUpdate(user._id, { $push: { asked_qs: question } }, { new: true })
        .populate({
            path: 'asked_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .populate('created_tags')
        .populate({
            path: 'answered_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .exec();
}

module.exports.updateCreatedTags = async (user, tag) => {
    return await UserModel.findByIdAndUpdate(user._id, { $push: { created_tags: tag } }, { new: true })
        .populate({
            path: 'asked_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .populate('created_tags')
        .populate({
            path: 'answered_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .exec();
}

module.exports.updateAnsweredQ = async (user, question) => {
    return await UserModel.findByIdAndUpdate(user._id, { $push: { answered_qs: question } }, { new: true })
        .populate({
            path: 'asked_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .populate('created_tags')
        .populate({
            path: 'answered_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .exec();
}

module.exports.deleteUser = async (user) => {
    return await UserModel.findByIdAndDelete(user._id)
        .populate({
            path: 'asked_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .populate('created_tags')
        .populate({
            path: 'answered_qs',
            populate: [
            {path: 'tags',},
            {
                path: 'answers',
                populate: [
                    {path: 'ans_by'}, 
                    {
                        path: 'comments',
                        populate: {
                            path: 'commented_by'
                        }
                    }]
            },
            {path: 'asked_by'},
            {
                path: 'comments',
                populate: {
                    path: 'commented_by'
                }
            }]
        })
        .exec();
}