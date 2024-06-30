import mongoose, {Document, Schema} from "mongoose";

export interface IVacancy extends Document{
    id: string;
    role: string;
    sub: string;
    status: string;
    createDate: string;
    description: string;
}

const vacancySchema: Schema = new Schema({
    id:{
        type:String,
        required: true
    },
    role:{
        type:String,
        required: true
    },
    sub:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    createDate:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    }
})

const Vacancy = mongoose.models.Vacancy || mongoose.model<IVacancy>('Vacancy', vacancySchema);

export default Vacancy;