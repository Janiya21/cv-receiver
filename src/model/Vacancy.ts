import mongoose, {Document, Schema} from "mongoose";

export interface IVacancy extends Document{
    position: string;
    title: string;
    status: string;
    createDate: string;
    endDate: string;
    description: string;
    location:string;
}

const vacancySchema: Schema = new Schema({
    position:{
        type:String,
    },
    title:{
        type:String,
    },
    status:{
        type:String,
    },
    createDate:{
        type:String,
    },
    endDate:{
        type:String,
    },
    description:{
        type:String,
    },
    location:{
        type:String,
    }
})

const Vacancy = mongoose.models.Vacancy || mongoose.model<IVacancy>('Vacancy', vacancySchema);

export default Vacancy;