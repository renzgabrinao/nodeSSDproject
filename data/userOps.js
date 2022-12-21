const { ObjectId } = require("mongodb");
const User = require("../models/User");
class UserOps {
    // Constructor
    UserOps() {}

    async getUsersBySearch(searchString) {
        const filter = {
            $or: [{ firstName: { $regex: searchString, $options: "i" } },
            { lastName: { $regex: searchString, $options: "i" } },
            { email: { $regex: searchString, $options: "i" } },
            { interests: { $regex: searchString, $options: "i" } }]
        };
        let users = await User.find(filter).sort({ firstName: 1 })
        return users
    }

    async getAllUsers() {
        console.log("getting all users")

        let users = await User.find()
        return users
    }

    async getUserById(id) {
        let user = await User.findById(id)
        return user
    }

    async getUserByEmail(email) {
        let user = await User.findOne({ email: email });
        if (user) {
            const response = { obj: user, errorMessage: "" };
            return response;
        } else {
            return null;
        }
    }

    async getUserByUsername(username) {
        let user = await User.findOne({ username: username });
        if (user) {
            const response = { obj: user, errorMessage: "" };
            return response;
        } else {
            return null;
        }
    }

    async updateUserById(userId, firstName, lastName, interests, picturePath) {
        const user = await User.findById(userId)
        user.firstName = firstName
        user.lastName = lastName
        user.interests = interests.split(",")
        user.picturePath = picturePath

        let result = await user.save()

        return {
            obj: result,
            errorMessage: ""
        }
    }

    async addCommentToUser(comment, selectedUser){
        let user = await User.findOne({ username: selectedUser.username })
        user.comments.push(comment);

        try { 
            let result = await user.save()
            console.log("updated user: ", result);
            const response = { user: result, errorMessage: "" };
            return response;
        } catch (error) {
            console.log("error saving user: ", result);
            const response = { user: user, errorMessage: error };
            return response;
        }
    }

    async deleteComment(commentId, userId){
        try {
            await User.updateOne({
                _id: ObjectId(userId)
            },
            {
                $pull: {
                    comments: {
                        _id: ObjectId(commentId)
                    }
                }
            })

            return ""
        } catch (error) {
            return error
        }
    }

    async deleteUserById(id) {
        let result = await User.findByIdAndDelete(id)
        return result
    }
}

module.exports = UserOps;

