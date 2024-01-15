import JobModel from "../models/Job.model.mjs";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.mjs";
import NotFoundError from "../errors/not-found.mjs";

export const getAllJobs = async (req, res) => {
  const userId = req.user.userId;
  const jobs = await JobModel.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

export const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await JobModel.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);
  res.status(StatusCodes.OK).json({ job });
};

export const createJob = async (req, res) => {
  // res.send("create a job");
  // console.log(req.user);
  req.body.createdBy = req.user.userId;
  const job = await JobModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const updateJob = async (req, res) => {
  const {
    body: { company, position, status },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "" || status === "")
    throw new BadRequestError("company/position/status cannot be empty");

  const job = await JobModel.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);
  res.status(StatusCodes.OK).json({ job });
};

export const deleteJob = async (req, res) => {
  const job = await JobModel.findByIdAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId,
  });
  if (!job) throw new NotFoundError(`No job with id ${req.params.id}`);
  res.status(StatusCodes.OK).send();
};
