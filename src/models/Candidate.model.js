import mongoose from "mongoose";
const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    party: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    votes: [
      {
        users: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
        },
        votedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
