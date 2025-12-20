import mongoose, { Schema, Document, Model } from "mongoose"

export interface Icategory extends Document {
    name: string;
    descriptiom?: string;
    image?: string;



}
const CategorySchema: Schema<Icategory> = new Schema(
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
 export const Category: Model<Icategory> = mongoose.model<Icategory>('Category', CategorySchema)

