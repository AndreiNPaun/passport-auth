const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
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
    provider: {
      google: {
        id: {
          type: String,
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
      github: {
        id: {
          type: String,
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
      microsoft: {
        id: {
          type: String,
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
      linkedin: {
        id: {
          type: String,
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
    },
  },
  { timestamps: true }
);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
