import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#021227",
                color: '#ffffff',
                padding: '16px 0',
                left: 0,
                bottom: 0,
                width: '100%',
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        marginTop: '8px',
                        marginBottom: '15px',
                        fontSize: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                    }}
                >
                    <Link
                        href="#"
                        sx={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#00bcd4',  // Hover color for the individual link
                                textDecoration: 'underline', // Underline on hover
                            },
                        }}
                    >
                        Home
                    </Link>
                    <Link
                        href="#"
                        sx={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#00bcd4',  // Hover color for the individual link
                                textDecoration: 'underline', // Underline on hover
                            },
                        }}
                    >
                        About
                    </Link>
                    <Link
                        href="#"
                        sx={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#00bcd4',  // Hover color for the individual link
                                textDecoration: 'underline', // Underline on hover
                            },
                        }}
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="#"
                        sx={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#00bcd4',  // Hover color for the individual link
                                textDecoration: 'underline', // Underline on hover
                            },
                        }}
                    >
                        Contact Us
                    </Link>
                </Box>

                

                <Box sx = {{display: 'flex', gap:"100px",  marginTop: '20px',}}>
                    <Container sx={{padding: '10px' }}>
                        <Typography sx={{ color: '#ffffff', fontSize:'12px'}}>
                        They've shut down the main reactor.<br />
                        This is madness! We're doomed!<br />
                        There'll be no escape for the Princess this time<br />
                        </Typography>
                    </Container>
                    <Container sx={{padding: '10px', marginLeft: '-200px' }}>
                    <Typography sx={{ color: '#ffffff', fontSize: '12px'}}>
                            1234 Fictional St, Suite 567<br />
                            Imaginary City, XYZ 89012<br />
                            Wonderland, Earth
                        </Typography>
                    </Container>
                </Box>

                <Typography sx={{ fontSize: '12px' }}>
                    © ESCOM. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
