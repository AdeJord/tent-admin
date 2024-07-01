import React from 'react';
import axios from 'axios';

// Define an interface for the component props
interface EmailTripListsProps {
    data: Booking[];
    targetMonth: string;
    volunteers: Volunteer[];
}

interface Booking {
    booking_date: string;
    first_name: string;
    surname: string;
    contact_number: string;
    group_name: string;
    destination: string;
    total_passengers: number;
    wheelchair_users: number;
    smoking: boolean;
    lunch_arrangements: string;
    notes: string;
    skipper: string;
    crew1: string;
    crew2: string;
    bookingmonth: string;
}

interface Volunteer {
    id: string;
    name: string;
    email: string;
    role: string;
}

const EmailTripLists: React.FC<EmailTripListsProps> = ({ data, targetMonth, volunteers }) => {
    const handleSendEmail = async () => {
        try {
            const response = await axios.post('https://adejord.co.uk/send-all-bookings-GDPR', {
                data,
                targetMonth,
                volunteers
            });
            if (response.status === 200) {
                alert('Email sent successfully');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email');
        }
    };

    return (
        <button onClick={handleSendEmail}>Send Email</button>
    );
};

export default EmailTripLists;
