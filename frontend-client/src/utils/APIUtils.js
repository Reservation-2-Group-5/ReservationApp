const BASE_API = '/api/v1';

// const apiAccessible = async () => {
//   const apiResponse = await fetch(API_URL, { method: 'HEAD' });
//   return apiResponse.status === 200;
// };

const fixDate = (date) => {
  if (date && (typeof date === 'string' || typeof date === 'number')) {
    return new Date(date);
  }
  return date;
};

export {
  BASE_API,
  // apiAccessible,
  fixDate,
};
