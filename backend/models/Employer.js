import mongoose from 'mongoose';
const { Schema } = mongoose;


const Employer_Schema = new Schema({

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

    designation : {
        type : String

    },

    company_name : {
        type : String

    },
    
    country : {
        type : String

    },
    
    city : {
        type : String
    },

    company_type: {
        type: String
    },

    
    company_category : {
        type : String

    },

    account_id : String,

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


const Employer_Schema_Model = mongoose.model('employer', Employer_Schema);
export default Employer_Schema_Model;
