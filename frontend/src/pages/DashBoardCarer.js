import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';



const DashboardCarer = () =>{
    const { userInfo } = useSelector(state => state.userLogin);
    return(
        <Grid container style={{position:"relative", width:"90%", height:"70%", paddingInline:"5%"}} >
            <Grid md={5} display={"flex"} flexDirection="column" justifyContent="center" >
                <h3>
                    Hello, {userInfo.user.profile.first_name}
                </h3>
                <h4>Download the WyeCare app for better experience </h4>
            </Grid>
            <Grid md={3} >

            </Grid>
        </Grid>
    )
}

export default DashboardCarer;