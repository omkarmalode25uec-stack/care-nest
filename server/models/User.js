import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a valid phone number'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['pilgrim', 'owner', 'admin'],
        message: '{VALUE} is not a valid role. Allowed roles are: pilgrim, owner, admin',
      },
      default: 'pilgrim',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    ownerVerificationStatus: {
      type: String,
      enum: ['not_submitted', 'pending', 'approved', 'rejected', 'changes_requested'],
      default: 'not_submitted',
    },
    ownerVerificationDocuments: [
      {
        docType: {
          type: String,
          enum: ['aadhaar', 'pan', 'electricity_bill', 'municipal_noc', 'other'],
          required: true,
        },
        title: { type: String, default: 'Identity / NOC Document' },
        fileName: { type: String, required: true },
        fileUrl: { type: String, default: '' },
        status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    rejectionReason: {
      type: String,
      default: '',
    },
    reviewComment: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
