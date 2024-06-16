import { Root, Container, ContainerPartition, UploadDiv } from '../styles';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UpdatePrices from '../components/UpdatePrices';

const BASE_URL = 'https://adejord.co.uk';

const getCurrentPrices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/prices`);
        return response.data;
    } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
    }
}

const submitNewPrices = async (newPrices: { trip1: number, trip2: number, trip3: number, trip4: number, trip5: number, trip6: number }) => {
    try {
        const response = await axios.patch(`${BASE_URL}/prices`, newPrices);
        return response.data;
    } catch (error) {
        console.error('Error submitting new prices:', error);
        throw error;
    }
}

function Home() {
    const [prices, setPrices] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCurrentPrices()
            .then((prices) => {
                setPrices(prices);
            })
            .catch((error) => {
                setError(error);
                console.error('Error fetching prices:', error);
            });
    }, []);

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
                Website News
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to='/AddNews'>Add News</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="/news">View/Edit News</Link>
                </ContainerPartition>
            </Container>
            <Container>
                Gallery Images
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to='/AddGalleryImages'>Add Gallery Images</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="/EditGalleryImages">View/Edit Gallery Images</Link>
                </ContainerPartition>
            </Container>
            <h2
                style={{
                    textAlign: 'center',
                    padding: '20px',
                }}
            >
                Upload documents to website
            </h2>
            <Container>
                <UploadDiv>
                    T&C's
                    <FileUploader fileType='TCs' />
                </UploadDiv>
                <UploadDiv>
                    Boat Brochure
                    <FileUploader fileType='boatBrochure' />
                </UploadDiv>
                <UploadDiv>
                    Group Leader Policy
                    <FileUploader fileType='groupLeaderPolicy' />
                </UploadDiv>
            </Container>
            <Container>
                <UploadDiv>
                    Risk Assessments
                    <FileUploader fileType='riskAssessments' />
                </UploadDiv>
                <UploadDiv>
                    HAG Poster
                    <FileUploader fileType='HagPoster' />
                </UploadDiv>
                <UploadDiv>
                    Booking Conditions
                    <FileUploader fileType='bookingConditions' />
                </UploadDiv>
                <UploadDiv>
                    Insurance Certificate
                    <FileUploader fileType='insuranceCertificate' />
                </UploadDiv>
            </Container>
            <h2>Update Booking Prices</h2>
            <UpdatePrices />
            {error && <p style={{ color: 'red' }}>Error fetching prices: {(error as any).message}</p>}
            <br />
        </Root>
    );
}

export default Home;
