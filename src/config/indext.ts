const baseUrl = "https://staging.portalteam.org";
import { DateTime } from "luxon";
const convertDateToYYYYMMDD = (dateString) => {
  const dateObj = DateTime.fromISO(dateString);

  // Check if the date is valid
  if (!dateObj.isValid) {
    throw new Error("Invalid date format");
  }

  // Return the date in YYYY-MM-DD format
  return dateObj.toFormat("yyyy-MM-dd");
};


const getCurrency = (inputString) => {
  if (inputString) {
    inputString = inputString.trim();
    let lastSpaceIndex = inputString.lastIndexOf(' ');
    let lastWord = inputString.substring(lastSpaceIndex + 1);
    return lastWord;
  } else return '';
};


const APP_NAME_CODES = {
  HYBRID_RESEARCH_CENTER: 'hrc',
  EMIRATES_RESEARCH_CENTER: 'erc',
  DIGITAL_SKY_SERVICES: 'dss',
  PRO_WRITING_FIRM:'prf'
};
export { baseUrl, convertDateToYYYYMMDD , getCurrency,APP_NAME_CODES};
