import { Schema, model } from 'mongoose';

//REFERENCE: https://mongoosejs.com/docs/api/schema.html
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    /*  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }, */
  },
  { versionKey: false }
);

const User = model('users', userSchema);
export { User };
