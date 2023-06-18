import pdfFiles from "../models/pdfFiles.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import fs from "fs";
import { fileUploadHandler } from "../cloudinary/cloudinary.js";
import cloudinary from "cloudinary";

const createPdfFile = async (req, res) => {
  const { campus, program, school, department, unitCode, unitTitle } = req.body;

  const file = req.file;
  let pdfFile;
  try {
    const fileUploader = async (path) =>
      await fileUploadHandler(path, "Pdf Files");
    const { path } = file;
    pdfFile = await fileUploader(path);
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
    !pdfFile
  ) {
    throw new BadRequestError("Please provide all values");
  }

  const pdfFileCreate = await pdfFiles.create({
    campus,
    program,
    school,
    department,
    unitCode,
    unitTitle,
    pdfFile,
  });

  res.status(StatusCodes.CREATED).json({
    pdfFileCreate: {
      campus: pdfFileCreate.campus,
      program: pdfFileCreate.program,
      school: pdfFileCreate.school,
      department: pdfFileCreate.department,
      unitCode: pdfFileCreate.unitCode,
      unitTitle: pdfFileCreate.unitTitle,
      pdfFile: pdfFileCreate.pdfFile,
    },
  });
};

const getAllPdfFiles = async (req, res) => {
  const PdfFiles = await pdfFiles.find();
  res.json(PdfFiles);
};

const updatePdfFile = async (req, res) => {
  res.send("update pdfFile");
};

const deletePdfFile = async (req, res) => {
  const toDeletePdfFile = await pdfFiles.findById(req.params.id);
  if (toDeletePdfFile) {
    try {
      const pdfCloudId = toDeletePdfFile.pdfFile.id;
      await cloudinary.uploader.destroy(pdfCloudId);
      const deletePastPaper = await pdfFiles.findByIdAndDelete(req.params.id);

      res.status(StatusCodes.OK).json({ message: "PDF deleted successfully" });
    } catch (error) {
      res.status(500).json({
        err: "PDF deletion failed",
      });
      console.log(error);
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "PDF file does not exist",
    });
  }
};

const showStats = async (req, res) => {
  res.send("show stats");
};

export {
  createPdfFile,
  deletePdfFile,
  getAllPdfFiles,
  updatePdfFile,
  showStats,
};
