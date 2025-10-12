// Function to calculate a patient's age from their date of birth
export default function calculateAge(birthDate) {
    const today = new Date(); // current date
    const birth = new Date(birthDate); // patient's date of birth

    // approximate age calculation
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    // Adjustment if the month or birthday has not yet passed
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }