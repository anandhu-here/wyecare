import { Container, FormControl, InputLabel, Select } from '@mui/material'
import React from 'react'
import Calendar from '../components/CalendarAdmin/Calendar'
import Page from '../components/Page'
import toast, {Toaster} from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';


function DashboardAdmin() {
  const dispatch = useDispatch();
  
  return (
    <Page title="Dashboard">
      <Toaster />
      <Container>
      
        <Calendar />
      </Container>
    </Page>
  )
}

export default DashboardAdmin