/**
 * calculateAge Utility Function
 * ---------------------------------------
 * Calculates a person's age based on their date of birth.
 *
 * Features:
 * - Accepts a date string or Date object as input
 * - Returns the calculated age as an integer
 * - Automatically adjusts if the birthday for the current year hasn't occurred yet
 *
 * Example usage:
 * import calculateAge from "./utils/calculateAge";
 *
 * const age = calculateAge("1990-05-12");
 * console.log(age); // Output: 35 (depending on current date)
 *
 * @param {string | Date} birthDate - The user's date of birth.
 * @returns {number} The calculated age in years.
 */

export default function calculateAge(birthDate) {
  const today = new Date();          // Current date
  const birth = new Date(birthDate); // Convert input to Date object

  // Base age difference (year-to-year)
  let age = today.getFullYear() - birth.getFullYear();

  // Differences in month and day to check if the birthday has passed this year
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  // Adjust if the current month/day is before the birthday
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}
