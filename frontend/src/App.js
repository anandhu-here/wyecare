// routes
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Router from './routes';
// theme
import ThemeProvider from './theme';
import "./css/App.css";
// compone nts
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import useWebSocker, { ReadyState } from 'react-use-websocket'

// ----------------------------------------------------------------------

export default function App() {
  const [path, setPath] = useState('app');
  const auth = useSelector(state=>state.userLogin);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [isauth, setAuth] = useState(false)
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const {shiftspublished} = useSelector(state => state.calendar)

  function ToastDisplay({body}) {
    return (
      <div>
        <p><b>SHIFTS ADDED!</b></p>
        <p>{body}</p>
      </div>
    );
  };

  const { readyState } = useWebSocker('ws://3.86.108.50:8000/ws/notification/', {
    onOpen: ()=>{
      console.log("socket connected")
    },
    onClose: ()=>{
      console.log(" socket closing ")
    },
    onMessage: (e) =>{
      const {message, sender_id, target_id, data} = JSON.parse(e.data);
      const info = JSON.parse(localStorage.getItem('userInfo'));
      if(target_id === info.user.id){
        dispatch({type:"NEW_NOTIFICATION", payload:message})
        dispatch({type:"SET_SHIFTS", payload:[data, ...shiftspublished]})
        toast(<ToastDisplay body={message} />)
      }
    }
  })

  
  const reqNotification = async () =>{
    Notification.requestPermission().then(per=>{
      if(per === "denied"){
        reqNotification()
      }
    })
  }
  useEffect(()=>{
    reqNotification()
  }, [])
  


  useEffect(()=>{
    
    const info = JSON.parse(localStorage.getItem('userInfo'));
    console.log(info, "mop")
    if(info?.token){
      axios.get("http://localhost:8000/api/user", {headers:{
        "Authorization":"Token" + " " + info.token
      }}).then(res=>{
        const {home, carer, admin, agent} = res.data.user;
        setAuth(true);
        if(home){
          setPath('home')
        }
        else if(carer){
          setPath('carer')
        }
        else if(agent){
          setPath('agent')
        }
        setLoading(false);
      }).catch(e=>{
        localStorage.removeItem('userInfo')
        setAuth(false)
        setPath('')
        setLoading(false)
      })
    }
    else{
      setAuth(false);
      setPath('');
      setLoading(false);
    }
  }, [auth])

  return (
    <ThemeProvider>
      {
        loading?(
          <div>Loading</div>
        ):(
          <>
            <Toaster />
            <ScrollToTop />
            <BaseOptionChartStyle />
            <Router path={path} auth={isauth} />
          </>
        )
      }
    </ThemeProvider>
  );
}
