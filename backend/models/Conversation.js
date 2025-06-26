import mongoose from 'mongoose';
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: 'employer',
      required: true,
      index: true
    },
    professional: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

ConversationSchema.index({ employer: 1, professional: 1 }, { unique: true });

const CONVERSATION = mongoose.model('conversation', ConversationSchema);
export default CONVERSATION;
