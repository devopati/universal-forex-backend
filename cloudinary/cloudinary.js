import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const fileUploadHandler = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        const downloadUrl = cloudinary.url(result.public_id, {
          transformation: { flags: "attachment" },
          resource_type: "raw",
        });
        resolve({
          url: result.url,
          downloadURL: downloadUrl,
          id: result.public_id,
        });
      },
      {
        resource_type: "raw",
        folder: folder,
        use_filename: true,
        unique_filename: false,
        transformation: { flags: "attachment" },
        // response_content_disposition: "attachment",
      }
    );
  });
};

// export default uploads;
