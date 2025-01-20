const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (err, files, cb) {
        cb(null, "/uploads");
    },
    filename: function (err, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
        cb(null, uniqueSuffix)
    }
});
const uploads = multer({ storage: storage});

module.exports = uploads;