import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert, AlertTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../redux/actions/authActions';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState('');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { error: registerError, loading: registerLoading } = userRegister;

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      company:'',
      phone:'',
      postcode:'',
      email: '',
      password: '',
      type: '',
      homeName: '',
      key:''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      dispatch(register(values.firstName, values.lastName, values.email, values.password, values.homeName, type, values.company, values.phone, values.postcode, values.key));
    },
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;
  useEffect(() => {
    if (userInfo) {
      if(userInfo.user.home){
        navigate('/dashboard/home', {replace:true});
      }
      if(userInfo.user.agent){
        navigate('/dashboard/agent', { replace: true });
      }
      if(userInfo.user.carer){
        
      }
      
    }
  }, [navigate, userInfo]);

  
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">USER TYPE</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="USER TYPE"
            onChange={handleChange}
          >
            <MenuItem value={"CARER"}>CARER</MenuItem>
            <MenuItem value={"HOME"}>HOME</MenuItem>
            <MenuItem value={"AGENT"}>AGENT</MenuItem>
          </Select>
          </FormControl>
          {
            type === "HOME"&&(
              <TextField
                fullWidth
                label="Agency key"
                {...getFieldProps('key')}
                error={Boolean(touched.key && errors.key)}
                helperText={touched.key && errors.key}
              />
            )
          }
          </Stack>
        
          {type==="CARER"&&<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>}
          {type==="AGENT"&&<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="COMPANY NAME"
              {...getFieldProps('company')}
              error={Boolean(touched.company && errors.company)}
              helperText={touched.company && errors.company}
            />
            <TextField
              fullWidth
              label="POSTCODE"
              {...getFieldProps('postcode')}
              error={Boolean(touched.postcode && errors.postcode)}
              helperText={touched.postcode && errors.postcode}
            />

            
          </Stack>}
          {type === "HOME"&&
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Home name"
              {...getFieldProps('homeName')}
              error={Boolean(touched.homeName && errors.homeName)}
              helperText={touched.homeName && errors.homeName}
            />
            <TextField
              fullWidth
              label="POSTCODE"
              {...getFieldProps('postcode')}
              error={Boolean(touched.postcode && errors.postcode)}
              helperText={touched.postcode && errors.postcode}
            /> 
            </Stack>
            
            }
          <div style={{display:"flex", width:"100%"}}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
            {
              type==="AGENT"&&(
                <TextField
                  fullWidth
                  autoComplete="phone"
                  type="phone"
                  style={{marginLeft:"0.5rem"}}
                  label="Phone"
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              )
            }
          </div>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          {registerError ? (
            <Alert severity="error">
              <AlertTitle>Register Error</AlertTitle>
              {registerError}
            </Alert>
          ) : null}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={registerLoading ? isSubmitting : null}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
