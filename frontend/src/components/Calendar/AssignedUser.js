import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Cancel, CloseOutlined } from '@mui/icons-material';
import  { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { Grid, Stack, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { lowerCase } from 'lodash';
import { setDayDetailObj } from '../../redux/actions/actionCreatorsObj';
function AssignedUser() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const calendarContext = useSelector(state=>state.calendar);
    const [assigned, setAss] = useState([]);
    const [loading, setLoading] = useState(false);
    const [asked, setAsked] = useState({"LONGDAY":0, "NIGHT":0, "LATE":0, "EARLY":0});
    const {
        userAssignedSidebarToggled,
        dayDetail,
        currentMonth,
        currentYear,
        shiftspublished
    } = calendarContext

    useEffect(()=>{
        if(dayDetail.today){
            Object.keys(asked).map(key=>{
                if(dayDetail.asked[key.toLowerCase()] > 0){
                    setAsked(prev=>{
                        
                        
                        if(dayDetail.asked[key.toLowerCase()] > 0){
                            prev[key] = dayDetail.asked[key.toLowerCase()]
                        }
                        return prev;
                        
                    })
                }
            })
            var t = [...assigned];
            setAss([...dayDetail.assigned]);
            console.log(shiftspublished, "amamm", currentMonth, dayDetail, )
        }
    }, [userAssignedSidebarToggled])


    const handlRejected = (id, data) =>{
        setLoading(true);
        var temp = [...dayDetail.assigned].filter(i=>i.id !== id);
        setAss([...temp])
        var final = []
        var pub = [...shiftspublished];
        pub.map(i=>{
            if(i.id === data.id){
                i.assigned = i.assigned.filter(p=>p.id !== id)
            }
        })
        dispatch({type:"SET_SHIFTS", payload:[...pub]})
        dispatch(setDayDetailObj(dayDetail.today,temp, dayDetail.asked))
        setLoading(false)
    }
  return (
    <div className={
        userAssignedSidebarToggled?
        "detail-sidebar toggled box-shadow"
          : "detail-sidebar"
      }
          >
          <button
          className="sidebar__close-btn"
          onClick={() => {
            dispatch({type:"CLOSE_USER_ASSIGNED_SB", payload:null});
          }}
        >
          <CloseOutlined />
        </button>
        <p className="detail-sidebar__date">{`${moment.months(currentMonth - 1)} ${dayDetail.today}, ${currentYear}`}</p>
        <Grid container md={12} sm={12} style={{display:"flex", height:"70%"}}>
            <Grid md={12} >
                <Typography fontSize={15} >ASKED</Typography>
                {
                    Object.keys(asked).map(key=>{
                        if(asked[key] > 0){
                            return(
                                <div>{key} : {asked[key]}</div>
                            )
                        }
                    })
                }
            </Grid>
          <Grid md={12} style={{display:"flex",flexDirection:"column", height:'100%', paddingBlock:"3%"}} >
            <Typography fontSize={14} >ASSIGNED BY AGENCY</Typography>
          {
            assigned.map(ass=>{
                console.log(ass, "sass")
                return(
                    <div key={ass.id} className="assigned_profile" style={{ display:"flex",justifyContent:"space-between",alignItems:"center", paddingBlock:"1%", marginTop:"3%", backgroundColor:"white", boxShadow: "inset 5px 0 0 0 rgb(25, 183, 180)"}} >
                        <Typography style={{cursor:"pointer"}} onClick={()=>{
                            navigate('/dashboard/profile', {replace:true});
                        }} >{ass.employee.first_name}</Typography>
                        <Button onClick={()=>{
                            setLoading(true);
                            axios.post("http://localhost:8000/api/reject", {shift_id:ass.id, id:ass.shiftname}, {headers:{
                                'Content-Type':"application/json"
                            }}).then(res=>{
                                
                                handlRejected(ass.id, res.data.data)
                            }).catch(e=>console.log(e))
                        }} color={"error"} variant="outlined" style={{fontSize:"0.8rem"}} startIcon={<Cancel />} >
                            Reject</Button>
                        {
                            loading&&(<CircularProgress />)
                        }
                    </div>
                )
            })
          }
          </Grid>
        </Grid>
    </div>
  )
}

export default AssignedUser