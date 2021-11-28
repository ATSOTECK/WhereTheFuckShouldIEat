import React, {useContext} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Link } from 'react-router-dom';

import AuthContext from './authContext';

const theme = createTheme();

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Decidr
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 150,
      editable: false,
    },
    {
        field: 'website',
        headerName: 'Website',
        type: 'string',
        width: 150,
        editable: false,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      type: 'number',
      width: 110,
      editable: false,
    },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        width: 110,
        editable: false,
      },
  ];
  
  const rows = [
    { id: 1, name: 'Taco Bell', date: '10/27/2021', website: 'tacobell.com', rating: 5, price: 4 },
    { id: 2, name: 'Shangri-La', date: '10/25/2021', website: 'shangrila-cafe.com', rating: 5, price: 3 },
    { id: 3, name: 'In-N-Out', date: '9/27/2021', website: 'in-n-out.com', rating: 5, price: 3 },
    { id: 4, name: 'Extreme Pizza', date: '9/26/2021', website: 'extremepizza.com', rating: 5, price: 3 },
    { id: 5, name: 'Olive Garden', date: '9/24/2021', website: 'olivegarden.com', rating: 4, price: 4 },
    { id: 6, name: 'Shari\'s Cafe and Pies', date: '9/23/2021', website: 'sharis.olo.com', rating: 4, price: 4 },
  ];

export default function User(props) {
    const auth = useContext(AuthContext);
    
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
            <CssBaseline />
            {
                !auth.user ?
                <Typography component="div" variant='h3'>
                    No user is logged in.
                </Typography> :
                
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        textAlign: 'left',
                    }}
                >
                    <Typography component="h1" variant='h5'>Email: {auth.user.username}</Typography>
                    <Typography component="h1" variant='h5'>First Name: {auth.user.firstName}</Typography>
                    <Typography component="h1" variant='h5'>Last Name: {auth.user.lastName}</Typography>
                    <Typography component="h1" variant='h5'>Birthday: {new Date(auth.user.birthDay).toLocaleDateString("en-US")}</Typography>
                    <Typography component="h1" variant='h5'>History: </Typography>
                    <Box>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    </div>
                    </Box>
                </Box>
            }
            <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
