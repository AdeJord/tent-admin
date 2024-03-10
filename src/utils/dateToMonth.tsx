//take a date and return the month

function getMonthNameFromDate(dateString: string): string {
    const dateParts = dateString.split('/'); // Split the date string into parts
    if (dateParts.length !== 3) {
      return 'Invalid Date'; // Check if the input format is correct
    }
  
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Subtract 1 from the month (JavaScript months are 0-based)
    const year = parseInt(dateParts[2], 10);
  
    const date = new Date(year, month, day);
  
    // Define an array of month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Get the month name using the getMonth() method
    const monthName = monthNames[date.getMonth()];
  
    return monthName;
  }
  
  const date = '01/10/1970';
  const monthName = getMonthNameFromDate(date);
  console.log(monthName); // Output: October

  export default getMonthNameFromDate;
  
