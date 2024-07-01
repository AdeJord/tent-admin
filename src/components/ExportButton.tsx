import React from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Define an interface for the button props
interface ExportButtonProps {
  label: string;
  data: any[];
  isGdprCompliant: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ label, data, isGdprCompliant }) => {

  const handleExport = () => {
    // Define the columns for the export
    const columns = isGdprCompliant
      ? ['booking_date', 'first_name', 'surname', 'contact_number', 'group_name', 'total_passengers', 
      'wheelchair_users', 'smoking', 'destination', 'lunch_arrangements', 'notes'] // Add non-sensitive fields here
      : [
          'booking_date', 'first_name', 'surname', 'group_name', 'contact_number', 'email_address', 'house_number',
          'street_name', 'city', 'postcode', 'total_passengers', 'wheelchair_users', 'smoking', 'destination',
          'lunch_arrangements', 'notes', 'terms_and_conditions', 'group_leader_policy', 'paid', 'skipper', 'crew1',
          'crew2', 'complete', 'bookingmonth'
        ];

    // Filter the data based on the columns
    const exportData = data.map(booking => {
      const filteredBooking: any = {};
      columns.forEach(column => {
        filteredBooking[column] = booking[column];
      });
      return filteredBooking;
    });

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

    // Export the workbook to Excel
    XLSX.writeFile(workbook, `${label}.xlsx`);
  };

  return (
    <button onClick={handleExport}>{label}</button>
  );
};

export default ExportButton;
