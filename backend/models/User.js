import mongoose from 'mongoose';
const { Schema } = mongoose;


const User_Schema = new Schema({

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
    },

    firstName : {
        type : String

    },

    lastName : {
        type : String

    },

     randomFirstName : {
        type : String

    },

    randomLastName : {
        type : String

    },

     applicantName : {
        type : String

    },

     openForJobs : {
        type : Boolean,
        default: true

    },

    employmentDetails: [{
               type: mongoose.Schema.Types.ObjectId,
               ref: "employment_details",
             }],

             skills: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "skills",
              }],


    work_email : {
        type : String

    },

    account_id : String,

    working_mail_verified : {
        type : Boolean,
        default: false
    }, 

    pref_company_type: { type : String},
    pref_job_type: { type : String},
      pref_job_locations: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "job_locations",
              }],
                  projects_worked_on: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "projects_worked",
              }],
    expected_ctcFrom: { type : Number},
    expected_ctcTo: { type : Number},
    currency: { type: String }, 
    mobile_number: { type : String},
    country: {type : String},

    account_delete_code: {type : Number},

    profileViews: [{
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'employer' },
  viewedAt: Date
}],

tabViewDurations: [{
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'employer' },
  viewedAt: Date,
  durations: {
    0: Number, // Employment
    1: Number, // Projects
    2: Number  // Preferences
  },
  totalDuration: Number
}],



    reset_pin:{
        type: Number
    },

    verify_pin:{
        type: Number
    },

      last_login: {
  type: Date
},

loginHistory: [{
  type: Date
}],

uanNumber: {
  type: String,
  default: ''
},

linkedinUrl: {
  type: String,
  default: ''
},

certifications: [
  {
    certificationName: {type: String},
    issuedBy: {type: String},
    issuedOn: {type: Date}
  }
],


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


const User_Schema_Model = mongoose.model('users', User_Schema);
export default User_Schema_Model;
