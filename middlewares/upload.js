import multer from 'multer';

const tempPath = path.join('tmp');
const multerConfig = multer.diskStorage({
  destination: tempPath,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

export { upload };
