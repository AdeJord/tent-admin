import { Root, Container, ContainerPartition, Header } from '../styles';
import AllBookings from './AllBookings'
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Root>
            <Container>
                Bookings
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="/AvailabilityCalendar">Create Booking</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="./AllBookings">View/Edit Bookings</Link>
                </ContainerPartition>

            </Container>
            <Container>
                Volunteers
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to='/AddVolunteers'>Add A Volunteer</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="./AllVolunteers">View/Edit Volunteers</Link>
                </ContainerPartition>
            </Container>
            <Container>
                Website
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to='/AddNews'>Add News</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="/news">View/Edit News</Link>
                </ContainerPartition>
            </Container>
        </Root>
    );
}

export default Home