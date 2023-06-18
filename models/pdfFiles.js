import mongoose from "mongoose";

const pdfSchema = mongoose.Schema({
  campus: {
    type: String,
    required: [true, "Please provide campus name"],
    trim: true,
  },
  program: {
    type: String,
    required: [true, "Please provide program name"],
    trim: true,
  },
  school: {
    type: String,
    required: [true, "Please provide school name"],
    trim: true,
  },
  department: {
    type: String,
    required: [true, "Please provide department name"],
    trim: true,
  },
  unitCode: {
    type: String,
    required: [true, "Please provide Unit Code"],
    trim: true,
  },
  unitTitle: {
    type: String,
    required: [true, "Please provide Unit Title"],
    trim: true,
  },

  pdfFile: {},
});

export default mongoose.model("Pdfs", pdfSchema);
