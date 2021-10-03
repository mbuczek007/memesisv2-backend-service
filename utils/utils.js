const { v4: uuidv4 } = require('uuid');

generateFileName = () => {
  return uuidv4() + '-' + Date.now();
};

getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

getPagingData = (data, page, limit) => {
  const { count, rows: entries } = data;

  const totalItems = count;

  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, entries, totalPages, currentPage };
};

const utils = {
  generateFileName: generateFileName,
  getPagination: getPagination,
  getPagingData: getPagingData,
};

module.exports = utils;
