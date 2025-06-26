import mongoose from 'mongoose';
const { Schema } = mongoose;


const Skills_Schema = new Schema({


    name: {
        type: String,
    },

     color: {
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


const Skills_Schema_Model = mongoose.model('skills', Skills_Schema);
export default Skills_Schema_Model;
