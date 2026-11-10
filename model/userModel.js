const { Schema, model } = require("mongoose");
const userSechma = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      default: "pending",
    },
    phone: {
      type: Number,
    },

    image: {
      type: String,
      default: "",
    },
    method: {
      type: String,
      default: "",
    },
  },

  { timestamps: true },
);

userSechma.index({
  name: "text",
});

module.exports = model("users", userSechma);
