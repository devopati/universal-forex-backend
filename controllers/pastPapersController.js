import PastPapers from "../models/pastPapers.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import fs from "fs";
import { fileUploadHandler } from "../cloudinary/cloudinary.js";
import cloudinary from "cloudinary";

const createPastPaper = async (req, res) => {
  const {
    campus,
    program,
    school,
    department,
    unitCode,
    unitTitle,
    dateDone,
    isAnswered,
    price,
  } = req.body;

  // const { pastPaperFile } = req.file;
  const file = req.file;
  let pastPaperFile;
  try {
    const fileUploader = async (path) =>
      await fileUploadHandler(path, "PastPapers");
    const { path } = file;
    pastPaperFile = await fileUploader(path);
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("File not uploaded");
  }

  if (
    !campus ||
    !program ||
    !school ||
    !department ||
    !unitCode ||
    !unitTitle ||
    !dateDone ||
    !price ||
    !pastPaperFile
  ) {
    throw new BadRequestError("Please provide all values");
  }

  const pastPaperCreate = await PastPapers.create({
    campus,
    program,
    school,
    department,
    unitCode,
    unitTitle,
    dateDone,
    isAnswered,
    price,
    pastPaperFile,
  });

  res.status(StatusCodes.CREATED).json({
    pastPaperCreate: {
      campus: pastPaperCreate.campus,
      program: pastPaperCreate.program,
      school: pastPaperCreate.school,
      department: pastPaperCreate.department,
      unitCode: pastPaperCreate.unitCode,
      unitTitle: pastPaperCreate.unitTitle,
      dateDone: pastPaperCreate.dateDone,
      isAnswered: pastPaperCreate.isAnswered,
      price: pastPaperCreate.price,
      pastPaperFile: pastPaperCreate.pastPaperFile,
    },
  });
};

const getAllPastPapers = async (req, res) => {
  const getAllPastPapers = await PastPapers.find();
  res.json(getAllPastPapers);
};

const updatePastPaper = async (req, res) => {
  res.send("update job");
};

//delete pastpaper
const deletePastPaper = async (req, res) => {
  const pastPaper = await PastPapers.findById(req.params.id);
  if (pastPaper) {
    try {
      const paperCloudId = pastPaper.pastPaperFile.id;
      await cloudinary.uploader.destroy(paperCloudId);
      const deletePastPaper = await PastPapers.findByIdAndDelete(req.params.id);

      res
        .status(StatusCodes.OK)
        .json({ message: "Past Paper deleted successfully" });
    } catch (error) {
      res.status(500).json({
        err: "Past Paper deletion failed",
      });
      console.log(error);
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Past Paper does not exist",
    });
  }
};

const showStats = async (req, res) => {
  res.send("show stats");
};

export {
  createPastPaper,
  deletePastPaper,
  getAllPastPapers,
  updatePastPaper,
  showStats,
};
