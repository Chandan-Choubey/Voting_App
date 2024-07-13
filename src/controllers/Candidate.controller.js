import { Candidate } from "../models/Candidate.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
const isAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return user.role === "admin";
};
const createCandidate = async (req, res) => {
  try {
    if (!isAdmin(req.user._id)) {
      throw new ApiError(403, "Unauthorized to create candidate");
    }
    const { name, party, age } = req.body;
    if (!name || !party || !age) {
      throw new ApiError(400, "All Fields are required");
    }
    console.log(req.user);
    console.log(name, party, age);

    const candidate = await Candidate.create({ name, party, age });
    if (!candidate) {
      throw new ApiError(400, "Candidate creation failed");
    }
    res
      .status(201)
      .json(new ApiResponse(201, candidate, "Candidate created successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const updateCandidate = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, party, age } = req.body;
    if (!name || !party || !age) {
      throw new ApiError(400, "All Fields are required");
    }
    if (!userId) {
      throw new ApiError(400, "Invalid candidate ID");
    }
    if (!isAdmin) {
      throw new ApiError(403, "Unauthorized to delete candidate");
    }
    const candidate = await Candidate.findByIdAndUpdate(userId, {
      name,
      party,
      age,
    });

    if (!candidate) {
      throw new ApiError(400, "Candidate not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, candidate, "Candidate Updated successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "Invalid candidate ID");
    }
    if (!isAdmin(req.user._id)) {
      throw new ApiError(403, "Unauthorized to delete candidate");
    }
    const candidate = await Candidate.findByIdAndDelete(userId);
    if (!candidate) {
      throw new ApiError(400, "Candidate not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, candidate, "Candidate deleted successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const voteCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;
    if (!candidateId) {
      throw new ApiError(400, "Invalid candidate ID");
    }
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new ApiError(400, "Candidate not found");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    if (user.isVoted) {
      throw new ApiError(400, "You have already voted");
    }
    if (user.role === "admin") {
      throw new ApiError(403, "Admin is not allowed to vote");
    }
    candidate.votes.push({ users: req.user._id });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();
    res
      .status(200)
      .json(new ApiResponse(200, candidate, "Vote Casted successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const getVoteCount = async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });
    console.log(candidate);
    if (!candidate) {
      throw new ApiError(400, "No candidates found");
    }
    const votedData = candidate.map((data) => {
      return {
        name: data.name,
        party: data.party,
        voteCount: data.voteCount,
      };
    });
    return res.status(200).json(new ApiResponse(200, votedData));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};
export {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  voteCandidate,
  getVoteCount,
};
