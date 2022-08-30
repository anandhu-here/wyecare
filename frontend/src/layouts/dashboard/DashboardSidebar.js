import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import logo from './log.png';
import { useSelector } from 'react-redux';

// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';

// ----------------------------------------------------------------------



const getnavItems = (path) =>{
  console.log(path, "00000")
  if(path === 'agent'){
    return [
      {
        title: 'Calendar',
        path: '/dashboard/agent',
      },
      {
        title:'Homes',
        path: '/dashboard/homes',
      }
    ]
  }
  else if(path === 'home'){
    return[
      {
        title: 'home',
        path: '/dashboard/home',
      }
    ]
  }
}


const DRAWER_WIDTH = 450;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const BlankPofile = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png';
  const userLogin = useSelector((state) => state.userLogin);
  const [path_, setPath_] = useState(null);
  const [name, setName] = useState('');
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useEffect(()=>{
    const {userInfo} = userLogin;
    if(userInfo?.user.home || userInfo?.user.agent){

      setName(userInfo?.user.profile.name)
      setPath_(userInfo?.user.type.toLowerCase())
    }
    
    else{
      setName(userInfo?.user.profile.first_name + " " + userInfo?.user.profile.last_name)
    }
  }, [userLogin])
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {display:"flex", height: 1,flexDirection:"column"},
      }}
    >
      
      <Box sx={{ px: 2.5, py: 0.5, display: 'inline-flex', backgroundColor:"rgb(246, 246, 246)", }}>
      <Typography component="div"  style={{  borderTopRightRadius:50, borderBottomLeftRadius:50}}>
        <Box sx={{ letterSpacing: 6, ml: 1, fontSize:21 }}>Wye</Box>
        <Box sx={{ letterSpacing: 6, ml: 5, fontSize:30 }}>Care</Box>
      </Typography>
      </Box>
      <div style={{display: 'flex',height:"80%",width:"90%",  flexDirection: 'column' , marginInline:"3%",borderRadius:"8%" }} >
      <Box sx={{  mx: 2.5, py:'5%',  }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={userLogin?.userInfo ? userLogin?.userInfo.avatar : BlankPofile} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {
                  name
                }
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection path={path_} navConfig={getnavItems(path_)} />

      <Box sx={{ flexGrow: 1 }} />
      </div>
      
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
