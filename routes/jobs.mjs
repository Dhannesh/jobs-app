import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
  updateJob,
} from "../controllers/jobs.mjs";

export const jobsRouter = Router();

jobsRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);
jobsRouter.route("/").get(getAllJobs).post(createJob);
