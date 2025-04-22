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
export { baseUrl, convertDateToYYYYMMDD };
