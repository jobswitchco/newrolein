import mongoose from 'mongoose';
const { Schema } = mongoose;


const Roles_Schema = new Schema({


    name: {
        type: String,
    },

     department: {
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


const Roles_Schema_Model = mongoose.model('roles', Roles_Schema);
export default Roles_Schema_Model;
