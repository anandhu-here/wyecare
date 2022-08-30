import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../../redux/actions/usersActions'
import { logout } from '../../redux/actions/authActions';
import { LOGOUT } from '../../redux/types/auth';
import axios from 'axios';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
import { NotificationsActive, NotificationsNoneRounded } from '@mui/icons-material';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '#',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#',
  },
];

// ----------------------------------------------------------------------

export default function NotificationPopover() {
    const [noti, setNoti] = useState(0);
    const [notiobj, setNOtiObj] = useState({body:'', title:''});
    const [notifications, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation()
  const navigate = useNavigate();
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);
  const user = useSelector(state=>state.userState);
  const handleOpen = (event) => {
    setLoading(true)
    setOpen(event.currentTarget);
    axios.get(`http://localhost:8000/api/notify`).then(res=>{
        console.log(res.data, "datatt")
        setNotification([...res.data])
        setLoading(false);
    }).catch(e=>console.log(e))
    
  };

  const handleClose = () => {
    setNoti(0);

        setNOtiObj(prev=>{
            prev.body = "";
            prev.title = "";
            return prev
        });
    setOpen(null);
  };

  const calendar = useSelector((state) => state.calendar);

  useEffect(()=>{
    const {notification} = calendar;
    console.log(notification, "kkkk")
    if(notification.length> 0){
        setNoti(notification.length);

        setNOtiObj(prev=>{
            prev.body = notification[0]
            return prev
        });
    }
  }, [calendar])
  

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login')
  };
  const link_handler = () =>{
    
    if(location.pathname === 'dashboard/admin'){
        
    }
  }
  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <NotificationsNoneRounded style={{fontWeight:"700", fontSize:35, color:noti>0?"brown":null}} />
        {noti>0&&<div style={{}} >
            <Typography style={{ position:"absolute", top:0,  }}>{noti}</Typography>
        </div>}
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        PaperProps={{
            style:{width:"25%", maxHeight:"40vh"}
        }}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {notiobj.body}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <>
            {
                loading?(
                    <CircularProgress />
                ):(
                    <>
                        {notifications?.map((not) => {
                            return(
                                <Box onClick={()=>link_handler()} key={not.home.id} sx={{ my: 1.5, px: 2.5 }}>
                                <Typography variant="subtitle2" noWrap>
                                    {not.home.home} has added shifts
                                </Typography>
                                </Box>
                            )
                        })}
                    </>
                )
            }
          </>
        </Stack>

      </MenuPopover>
    </>
  );
}
