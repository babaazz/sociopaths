import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "A user must have a first name"],
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: [true, "A user must have a last name"],
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      min: 2,
      max: 50,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: 6,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "A passowrd must contain an uppercase letter, a lowercase, a special character and a number",
      },
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password and confirmed password don't match",
      },
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    posts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "post",
      },
    ],
    viewedProfile: Number,
    impressions: Number,
    refreshToken: String,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

//User Methods
//Method to check if the password is matched
UserSchema.methods.isPasswordMatched = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

//Method to check if password has been changed after last login
UserSchema.methods.hasPasswordChangedAfterLastLogin = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAt = parseInt(this.passwordChangedAt.getTime()) / 1000;
    return passwordChangedAt > jwtTimeStamp;
  }
  return false;
};

//Schema Middlewares
//Hashing the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
