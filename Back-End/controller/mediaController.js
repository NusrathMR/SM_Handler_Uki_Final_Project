import cloudinary from "../config/cloudinary.js"
import Media from "../models/mediaModel.js"

//Sent a file buffer to cloudinary
function uploadToCloudinary(buffer, folder){
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {folder, resource_type:"image"},
            (error, result)=>{
                if (error) reject(error);
                else resolve(result)
            }
        )
        stream.end(buffer)
    })
}

//POST /api/media/upload
export const uploadMedia = async (req, res) =>{
    try{
        if(!req.file){
            return res.status(400).json({message: "Please choose an image"})
        }

        //Each user gets their own folder in cloudinary
        const result = await uploadToCloudinary(req.file.buffer, `socialynk/${req.user.id}`)

        const media = await Media.create({
            user: req.user.id,
            url: result.secure_url,
            publicId: result.public_id,
            originalName: req.file.originalname,
            format: result.format,
            size: result.bytes,
            width: result.width,
            height: result.height,
        })

        res.status(201).json({message: "Image uploaded successfully...", media})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Image upload failed"})
    }
}

// GET /api/media  (list my images)
export const getMyMedia = async (req, res) => {
    try {
        const media = await Media.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ media });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not load images" });
    }
};

// DELETE /api/media/:id
export const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findOne({ _id: req.params.id, user: req.user.id });
        if (!media) {
        return res.status(404).json({ message: "Image not found" });
        }

        await cloudinary.uploader.destroy(media.publicId); // delete from Cloudinary
        await media.deleteOne();                           // delete from MongoDB

        res.status(200).json({ message: "Image deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not delete image" });
    }
};

// DELETE /api/media by publicId
export const deleteMediaByPublicId = async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            return res.status(400).json({ message: "publicId is required" });
        }

        const media = await Media.findOne({ publicId, user: req.user.id });
        if (!media) {
            return res.status(404).json({ message: "Image not found" });
        }

        await cloudinary.uploader.destroy(publicId);
        await media.deleteOne();

        res.status(200).json({ message: "Image deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not delete image" });
    }
};