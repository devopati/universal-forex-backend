import express from "express";
const router = express.Router();

import {
  createPastPaper,
  deletePastPaper,
  getAllPastPapers,
  updatePastPaper,
  showStats,
} from "../controllers/pastPapersController.js";

import upload from "../utils/multer.js";

router
  .route("/")
  .post(upload.single("pastpaper"), createPastPaper)
  .get(getAllPastPapers);

//remeber id
router.route("/stats").get(showStats);
router.route("/:id").delete(deletePastPaper).patch(updatePastPaper);

export default router;
