import mongoose from 'mongoose';
const { Schema } = mongoose;


const EmploymentDetails_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

    isCurrentEmployment: { type: Boolean },
    employmentType: { type: String },
    companyName: { type: String },
    hideCurrentCompany: { type: Boolean, default : false },
     jobRoleId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "roles",
         },
    fromYear: { type: Number }, 
    fromMonth: { type: String }, 
    toYear: { type: Number }, 
    toMonth: { type: String }, 
    ctc: { type: Number }, 
    currency: { type: String }, 
    noticePeriod : { type: String},
    totalExpInMonths : { type: Number},
     workLocation: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "job_locations",
         },
    
    is_del: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date
    }
});


const EmploymentDetails_Schema_Model = mongoose.model('employment_details', EmploymentDetails_Schema);
export default EmploymentDetails_Schema_Model;
