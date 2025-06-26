import mongoose from 'mongoose';
const { Schema } = mongoose;


const JobLocations_Schema = new Schema({


    country: {
        type: String,
    },

     country_code: {
        type: String,
    },

     city: {
        type: String,
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


const JobLocations_Schema_Model = mongoose.model('job_locations', JobLocations_Schema);
export default JobLocations_Schema_Model;
