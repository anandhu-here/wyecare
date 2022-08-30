import { Avatar, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function Profile() {
    const calendarContext = useSelector(state=>state.calendar);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const {
        dayDetail
    } = calendarContext;
    useEffect(()=>{
        const id = dayDetail.assigned[0].employee.id
        axios.get(`http://localhost:8000/api/profile?id=${id}`).then(res=>{
            console.log(res.data.user)
            setProfile(res.data.user);
            setLoading(false)
        }).catch(e=>{
            setLoading(false);
            console.log(e)
        })
    }, [calendarContext])
  return (
    <Grid container md={12} >
        {
            loading?(
                <div>Loding.....</div>
            ):(
                <Grid md={12} style={{}} >
                    <Grid md={12} style={{display:"flex", justifyContent:"center", alignItems:"Center",borderBottom:"2px solid grey", paddingBlock:"1rem"}}>
                        {
                            profile?.profile_picture?(
                                <img src={profile?.profile_picture} ></img>
                            ):(
                                <Avatar sx={{width:100, height:100}} >{profile?.first_name[0].toUpperCase()}{profile?.last_name[0].toUpperCase()}</Avatar>
                            )
                        }
                        <Grid style={{paddingInline:"1%"}} >
                            <Typography>{profile.first_name} {profile.last_name}</Typography>
                            <Typography>{profile.position}</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={12} style={{marginTop:"5%"}} >
                        <Typography>DOCUMENTS</Typography>
                        <Grid style={{borderBottom:"2px solid grey",marginBottom:"2rem" }} ></Grid>
                        <div style={{ display:"flex", marginBottom:"10%", width:"100%"}} >
                            {
                                profile.trainings.map(item=>(
                                    <div className="training" >{item.name}</div>
                                ))
                            }
                        </div>
                        <Typography>DOCUMENTS</Typography>
                        <Grid style={{borderBottom:"2px solid grey", marginBottom:"10%"}} ></Grid>
                    </Grid>
                </Grid>
            )

        }
        
    </Grid>
  )
}

export default Profile