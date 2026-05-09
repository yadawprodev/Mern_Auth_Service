import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    isVerified: { type: Boolean, default: false },

    verifyOtp: { type: String },
    verifyOtpExpiresAt: { type: Date },

    resetOtp: { type: String },
    resetOtpExpiresAt: { type: Date },
  },
  { timestamps: true },
);

// save hashed password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.setVerifyOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.verifyOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.verifyOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  return otp;
};

userSchema.methods.setResetOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  return otp;
};

const User = mongoose.model('User', userSchema);

export default User;
