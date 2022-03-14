const mongoose = require("mongoose");

const linkSchema = mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    urlPreview: {},
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

exports.Link = mongoose.model("link", linkSchema);
