import multer from "multer"

const storage = multer.memoryStorage()

function fileFilter(req, file, cb){
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (allowed.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new Error("Only JPG, PNG and WebP images are allowed"), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 25 * 1024 * 1024}
})

export default upload