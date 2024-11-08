module.exports = function allowedTypes(extention) {
  const allowedTypes = [
    "png",
    "jpg",
    "jpeg",
    "pdf",
    "mp4",
    "mp3",
    "xls",
    "xlsx",
    "doc",
    "docx",
    "zip",
    "rar",
    "webm",
  ];

  return allowedTypes.includes(extention);
};
