import mongoose from 'mongoose';
const { Schema } = mongoose;


const ShortlistDetails_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

         employer: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "employer",
         },

         short_listed: {
            type: Boolean,
            default: false
        },

        invited: {
            type: Boolean,
            default: false
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


const ShortlistDetails_Schema_Model = mongoose.model('shortlist_candidates', ShortlistDetails_Schema);
export default ShortlistDetails_Schema_Model;
