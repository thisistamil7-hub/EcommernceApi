const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        descriptiom: {
            type: String
        },
        image: {
            type: String,
            default: 'no-photo.jpg'
        }


    }, { timestamps: true }

)
module.exports = mongoose.model('Category', CategorySchema)
