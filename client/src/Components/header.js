import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from 'react-router-dom';

function Header() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Button type={"submit"} formTarget="_self" href={'/#/User_Settings'} color={'inherit'} variant='outlined' marginRight={"100px"} size={"large"}>
                        User Settings
                    </Button>
                    &nbsp;&nbsp;
                    <Button type={"submit"} formTarget="_self" href={'/#'} color={"inherit"} variant='outlined' marginRight={"10px"} size={"large"}>
                        Home
                    </Button>
                    <Typography justifyContent={"center"} color="#FFFFFF" variant="h6" component="div" sx={{flexGrow: 1}}>
                        Decidr
                    </Typography>
                    <Button type={"submit"} formTarget="_self" href={'/#/login'} variant='outlined' color={"inherit"} size={"large"}>Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
