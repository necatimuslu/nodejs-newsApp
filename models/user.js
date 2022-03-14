const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
      max: 64,
    },

    role: {
      type: Boolean,
      default: false,
    },
    image: {
      public_id: "",
      url: "",
    },
    resetCode: "",
  },
  { timestamps: true }
);

exports.User = mongoose.model("user", userSchema);
