import { useSelect } from '@mui/base';
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { constant } from 'lodash';
import axios from 'axios';
import { CheckCircleOutlineRounded } from "@mui/icons-material"

const constants = {
  shiftTypes:[
    "LONGDAY",
    "NIGHT",
    "LATE",
    "EARLY"
  ]
}

function UserSidebar({users}) {
  const [loading, setLoading] = useState(false);
    const calendarContext = useSelector(state => state.calendar);
    const userContext = useSelector(state=>state.userState);
    const [staffs, setUsers] = useState([...users]);
    const [openedId, setOpened] = useState(null);
    const [homes, setHomes] = useState('');
    const [stype, setType] = useState("TYPE");
    const [assigned, setAssigned] = useState([]);
    const [shift_type, setShiftType] = useState("TYPE");
    const [shifts, setShifts] = useState([]);
    const [types, setTyps] = useState([]);
    const [ shiftid, setShiftID ] = useState(null);
    const [count, setCount] = useState({});
    const [totalC, setC] = useState({
      "LONGDAY":0,
      "NIGHT":0,
      "LATE":0, 
      "EARLY":0
    })

  const dispatch = useDispatch();


  const {
    userSidebarToggledAd,
    shift,
    shiftspublished,
    dayDetail,
    currentMonth,
    currentYear,
    homename
  } = calendarContext;


  useEffect(()=>{
    setUsers([...userContext.users])
    
    
  }, [userContext])
  useEffect(()=>{
    var temp = [];
    var count = {};
    var c = {"LONGDAY":0,
    "NIGHT":0,
    "LATE":0, 
    "EARLY":0};
    shift.map(item=>{
      const {longday : LONGDAY, night : NIGHT, late : LATE, early : EARLY, assigned} = item;
      var newObj = {
        "LONGDAY":LONGDAY,
        "NIGHT":NIGHT,
        "LATE":LATE,
        "EARLY":EARLY
      }
      c["LONGDAY"]+=LONGDAY; c["EARLY"]+=EARLY; c["LATE"]+=LATE; c["NIGHT"]+=NIGHT;
      if(assigned.length>0){
        
        assigned.map(ass=>{
          const obj = {ass_id:ass.id, user_id: ass.employee.id, home_id: item.home_id, id:ass.shiftname, type:ass.type, already:true }
          temp.unshift({...obj})
          newObj[ass.type]-=1
          c[ass.type]-=1;
        })
      }
      
      count[[item.home_id]]=newObj
    })
    setC({...c});
    setShifts([...shift])
    setAssigned([...temp])
    setCount({...count});
  }, [calendarContext])
  const util = async(user, type) =>{
    var temp = [...assigned];
    var obj = {home_id: homes,user_id: user.id, type: type, id: shiftid, ass_id:null, already:false};

    try{
      if(temp.length > 0){
        let flag = false;
        temp.map(item=>{
          if(item.user_id === user.id){
            item.user_id = user.id
            item.type = type;
            flag = true;
          }
        })
        if(!flag) temp.unshift(obj);
      }
      else{
        temp.unshift({...obj}) 
      }
      return temp;
    }
    catch{
      return false
    }
  }
  const handleChangeHome = (e,index, value, user) =>{
    const home_id = e.target.value;
    setShiftID(index.props.placeholder);
    var temp = [];
    constants.shiftTypes.map(type=>{
      if(count[home_id][type] > 0){
        temp.unshift(type)
      }
    })
    setTyps([...temp])
    setHomes(e.target.value);
  }
  const setShiftCount = (shift, user_id) =>{
    let type;
    assigned.map(i=>{
      if(i.user_id === user_id){
        type = i.type;
      }
    })
    if(count[homes][shift]>0){
      setCount(prev=>{
        prev[homes][shift]-=1;
        prev[homes][type] += 1;
        return prev;
      })
    }
  }
  const handleChangeType = (e, user) =>{
    const value = e.target.value
    if(!homes){
      alert("You must choose home first ")
    }
    else{
      setType(value); 
      switch(value){
        case "LONGDAY":
          setShiftCount(value, user.id);
          break;
        case "NIGHT":
          setShiftCount(value, user.id);
          break;
        case "LATE":
          setShiftCount(value, user.id);
          break;
        case "EARLY":
          setShiftCount(value, user.id);
          break;
        default:
          break;
          
      }
      util(user, e.target.value).then(temp=>{
        setAssigned([...temp]);
        setShiftID(null);
      })
    }
    
  }


  useEffect(()=>{
    const {home_id, shiftType, num, assigny} = calendarContext;
    if(assigny.length === 0){
      setCount(prev=>{
        prev[shiftType]=num
        return prev
      })
    }
    else{
      setCount(assigny[home_id])
    }
    
  }, [userSidebarToggledAd])
  const helper = async(id) =>{
    try{
      
      var temp = [...assigned];
      if(id){
        let flag = false;

        temp.map(item=>{
          if(item.user_id === id){
            var t = [];
            setHomes(item.home_id);
            constants.shiftTypes.map(type=>{
              if(count[item.home_id][type] > 0){
                t.unshift(type);
              }
            })
            setTyps([...t, item.already?item.type:null]);
            setType(item.type);
            flag = true;
          }
          
          
        })
        setAssigned([...temp]);
        if(!flag){
          setHomes('');setType('');setTyps([]);
        }
      }
      
      return
    }
    catch{
      return false
    }
  }
  const handleNextUser = (user) =>{
    if(!homes && !stype){
      setOpened(user.id);
    }
    if(homes && !stype){
      alert("you must assign the shift type to continue")
    }
    else{
      setOpened(user.id);
      helper(user.id);
    }
    
  }
  const handleSubmit = async () =>{
    setLoading(true);
    var temp = [...assigned].filter(i=>i.already === false)
    axios.post('http://localhost:8000/api/assign-shift', {assigned:temp},{headers:{
      'Content-Type':'application/json'
    }} ).then(res=>{
      var temp = [...shiftspublished];
      temp.map(t=>{
        res.data.map(data=>{
          if(t.id === data.shiftname){
            t.assigned.unshift(data)
          }
        })
      })
      dispatch({type:"SET_SHIFTS", payload:temp})
      dispatch({type:"CLOSE_USER_SB_AD", payload:null});
      dispatch({type:"CLOSE_DETAIL_SB_AD", payload:null});
      setHomes('');
      setType('');
      setOpened(null);
      setLoading(false);
    }).catch(e=>{
      setLoading(false);
    })
  }
  return (
    <div className={
      userSidebarToggledAd?
      "user-sidebar toggled box-shadow":
      "user-sidebar"
    }
        >
        <button
        className="sidebar__close-btn"
        onClick={() => {
          setAssigned([])
          setHomes('');
          setType('')
          dispatch({type:"CLOSE_USER_SB_AD", payload:null});
          dispatch({type:"TOGGLE_DETAIL_SB_AD", payload:shift});
        }}
      >
        <i className="fas fa-times-circle"></i>
      </button>
      <p className="user-sidebar__date">{`${moment.months(currentMonth - 1)} ${dayDetail.today}, ${currentYear}`}</p>
        {
          loading?(
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%", width:"100%"}} >
              <CircularProgress />
            </div>
          ):(
            <>
            <div style={{width:" ",display:"flex", textAlign:"center" }} >
              <h3>{homename}</h3>
            </div>
            <List className='user-sidebar__group' >
              {
                staffs.map(i=>{
                  const res = assigned.map(item=>{
                    return i.id === item.user_id

                  })
                  return(
                    <div style={{width:"100%", borderWidth:"1px",boxShadow: "inset 5px 0 0 0 rgb(25, 183, 180)", marginBottom:"2%", paddingLeft:"4%"}}>
                      <ListItemButton onClick={()=>{
                        handleNextUser(i)
                      }} style={{width:"100%", display:"flex",}} >
                      <ListItemText style={{ whiteSpace:"nowrap",overflow:"hidden", textOverflow:"ellipsis"}} >{i.first_name} {i.last_name}
                        
                      </ListItemText>
                      {res[0]&&<CheckCircleOutlineRounded style={{color:"darkgreen"}}/>}
                      
                    </ListItemButton>
                    {
                        openedId===i.id&&(
                          <div style={{width:"100%"}} >
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel id="demo-simple-select-autowidth-label">HOME</InputLabel>
                              <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={homes}
                                onChange={(e, index, value)=>handleChangeHome(e,index, value, i)}
                                autoWidth
                                defaultOpen={false}
                              >
                                {
                                  shifts.map(item=>{
                                    const {longday:LONGDAY, night:NIGHT, late:LATE, early:EARLY, id} = item;
                                    
                                    if(LONGDAY > 0 || NIGHT > 0 || LATE > 0 || EARLY>0 ){
                                      return <MenuItem value={item.home_id} placeholder={item.id} >{item.home}</MenuItem>
                                    }
                                  })
                                }
                              </Select>
                              

                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 120 }} >
                            <InputLabel id="demo-simple-select-autowidth-label">{shift_type}</InputLabel>
                              <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={stype}
                                onChange={(e)=>handleChangeType(e, i)}
                                autoWidth
                                label={shift_type}
                              >
                                
                                {
                                  types.map(type=>{
                                    return(
                                      <MenuItem value={type}>{type}</MenuItem>
                                    )
                                  })
                                }
                              </Select>
                            </FormControl>
                          </div>
                        )
                      }
                    </div>
                  )
                })
              }
            </List>
            {/* <FormGroup className='user-sidebar__group' >
              {
              staffs.map(i=>{
                  return(
                      <FormControlLabel key={i.id} control={<Checkbox checked={i.checked} disabled={i.disabled} style={{color:i.checkedColor}} defaultChecked={false}  onChange={(e)=>handleCheck({id:i.id, checked:e.target.checked})} />} label={i.first_name + " " + i.last_name} />
                  )
                })
              }
              </FormGroup> */}
              <Grid md={12} display="flex" justifyContent={"space-evenly"}>
                  <Typography fontSize={12} >LONG: {totalC.LONGDAY}</Typography>
                  <Typography fontSize={12} >LATE: {totalC.LATE}</Typography>
                  <Typography fontSize={12} >EARLY: {totalC.EARLY}</Typography>
                  <Typography fontSize={12} >NIGHT: {totalC.NIGHT}</Typography>
                </Grid>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:"3%"}} >
              <Button style={{paddingInline:"5%"}}  onClick={()=>{
                
                handleSubmit();
              }} >
                
                <Typography fontSize={14} style={{color:"rgb(25, 183, 180)"}} >SELECT AND CONTINUE</Typography>
              </Button>
              </div>
            </>
          )
        }
    </div>

  )
}

export default UserSidebar