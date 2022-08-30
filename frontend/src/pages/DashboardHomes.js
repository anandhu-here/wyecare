import { Button, Grid, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function DashboardHomes() {
    const [email, setEmail] = useState('');
    const [ myHome, setMyHome ] = useState([]);
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/users?type=HOME`, {headers:{
            'Authorization':`Token ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }}).then(res=>{
            setMyHome(res.data)
        }).catch(e=>{
            console.log(e)
        })
    }, [])
  return (
    <Grid container>
        <Stack width={"100%"} spacing={5} >
        <Grid md ={12}>
            <Stack spacing={3} style={{display:"flex", flexDirection:"column"}} >
                <Typography>Invite a home to join WyeCare...</Typography>
                <div style={{width:"50%"}} >
                <TextField
                    fullWidth
                    style={{borderRadius:"100%", textAlign:"center"}}
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div style={{ display:"flex", width:"50%"}} >
                    <Button  onClick={()=>{
                        axios.post(`http://localhost:8000/api/send_invite`, {email:email}, {headers:{
                            'Content-Type':"application/json",
                            'Authorization':`Token ${JSON.parse(localStorage.getItem('userInfo')).token}`
                        }}).then(res=>console.log(res.data)).catch(e=>console.log(e))
                    }} variant="contained" >INVITE</Button>
                </div>
            </Stack>
        </Grid>
        <Grid md ={12} >
            <div style={{borderBottom:"1px solid grey"}} >
                <Typography  >Your Homes</Typography>
            </div>
            {
                myHome?.map(home=>{
                    return(
                        <Typography>{home.name}</Typography>
                    )
                })
            }
        </Grid>
        </Stack>
    </Grid>
  )
}

export default DashboardHomes