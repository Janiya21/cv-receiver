import mongoose, {Document, ObjectId, Schema} from "mongoose";
import Vacancy from "./Vacancy";


export interface IApplicant extends Document{
    email: string;
    firstName: string;
    lastName: string;
    location: string;
    phoneNo: string;
    vacancies: mongoose.Schema.Types.ObjectId[];
}

const applicantchema: Schema = new Schema({
    email:{
        type:String,
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    location:{
        type:String,
    },
    phoneNo:{
        type:String,
    },
    vacancies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
    }],
}, { collection: 'applicants' })

const Applicant = mongoose.models.Applicant || mongoose.model<IApplicant>('Applicant', applicantchema);

export default Applicant;