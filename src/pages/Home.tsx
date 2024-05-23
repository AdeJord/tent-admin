import { Root, Container, ContainerPartition, UploadDiv } from '../styles';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader';


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
                Upload documents and Gallery images to website
            </h2>
            <Container>
                <UploadDiv>
                    Gallery Images
                    <FileUploader fileType='galleryImages' />
                </UploadDiv>
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
                    Risk Assesments
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
            {/* <h2>Update Booking Prices</h2>
            <p>Coven </p><input type='number' />
            <p>Autherley = ?</p><input type='number' />
            <p>HAG = ?</p><input type='number' /> */}
        </Root>
    );
}

export default Home