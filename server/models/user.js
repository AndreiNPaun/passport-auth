const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    provider: {
      google: [
        {
          _id: false,
          id: {
            type: String,
            required: true,
          },
          givenName: {
            type: String,
          },
          familyName: {
            type: String,
          },
          email: {
            type: String,
            lowercase: true,
          },
        },
      ],
      github: [
        {
          _id: false,
          id: {
            type: String,
            required: true,
          },
          givenName: {
            type: String,
          },
          familyName: {
            type: String,
          },
          email: {
            type: String,
            lowercase: true,
          },
          username: {
            type: String,
          },
        },
      ],
      microsoft: [
        {
          _id: false,
          id: {
            type: String,
            required: true,
          },
          givenName: {
            type: String,
          },
          familyName: {
            type: String,
          },
          email: {
            type: String,
            lowercase: true,
          },
        },
      ],
      linkedin: [
        {
          _id: false,
          id: {
            type: String,
            required: true,
          },
          givenName: {
            type: String,
          },
          familyName: {
            type: String,
          },
          email: {
            type: String,
            lowercase: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
