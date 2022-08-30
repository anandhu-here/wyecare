import { Container, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import Calendar from '../components/Calendar/Calendar';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../components/Page'

function DashboardHome() {
  const [agent, setAgent] = useState('');
  const { userInfo } = useSelector(state => state.userLogin);
  const agents = userInfo.user.profile.agent
  console.log(agents, "fuckkkkk")
  const handleAgent = (value) =>{
    setAgent(value)
  }
  return (
    <Page title="Dashboard" >
      <Container style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}} >
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Agent</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          onChange={(e)=>setAgent(e.target.value)}
          autoWidth
          defaultOpen={false}
        > 
          {
            agents.map(i=>(
              <MenuItem  value={i.agent} >{i.name}</MenuItem>
            ))
          }
        </Select>
        

      </FormControl>
        <Calendar  agentId={agent} />
      </Container>
    </Page>
  )
}

export default DashboardHome