import {v2 as cloudinary} from "cloudinary"

import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // uploading the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:auto,
        })
        //file has been uploaded 
        console.log("file has been uploaded on cloudinary", response.url);
        return response;
        
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath) // since the uploading to cloudinary has failed we will remove the file from our server also
    }
}

export {uploadOnCloudinary}