import express from "express";
const router = express.Router();

import {
  createPdfFile,
  deletePdfFile,
  getAllPdfFiles,
  updatePdfFile,
  showStats,
} from "../controllers/pdfFilesController.js";

import upload from "../utils/multer.js";

router.route("/").post(upload.single("pdf"), createPdfFile).get(getAllPdfFiles);

//remeber id
router.route("/stats").get(showStats);
router.route("/:id").delete(deletePdfFile).patch(updatePdfFile);

export default router;
