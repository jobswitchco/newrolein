import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    senderType: {
      type: String,
      enum: ['employer', 'professional'],
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    readBy: [
  {
    readerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    readAt: {
      type: Date,
      required: true,
    },
  },
],


  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, sentAt: 1 });

const MESSAGE = mongoose.model('message', MessageSchema);
export default MESSAGE;
