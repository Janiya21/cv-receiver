import mongoose, { Document, Schema } from "mongoose";

export interface IPosition extends Document {
    name: string;
    description: string;
}

const positionSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Position = mongoose.models.Position || mongoose.model<IPosition>("Position", positionSchema);

export default Position;
