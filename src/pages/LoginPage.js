import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import useResponsive from '../hooks/useResponsive';
// components
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 700,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const auth = useSelector(state => state.auth)
  const mdUp = useResponsive('up', 'md');
  const location = useLocation();
  const navigate = useNavigate();

  const {state} = location;

  const from = state?.from.pathname || '/';

  if (auth.isLogin) {
    navigate(from, {replace: true})
  }

  return (
    <>
      <Helmet>
        <title> Đăng nhập </title>
      </Helmet>

      <StyledRoot>
        {/*<Logo*/}
        {/*  sx={{*/}
        {/*    position: 'fixed',*/}
        {/*    top: { xs: 16, sm: 24, md: 40 },*/}
        {/*    left: { xs: 16, sm: 24, md: 40 },*/}
        {/*  }}*/}
        {/*/>*/}

        {mdUp && (
          <StyledSection>
            {/*<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>*/}
            {/*  Xin chào*/}
            {/*</Typography>*/}
            <img src="/assets/illustrations/illustration_login_1.jpg" alt="login" height={'100%'} />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Đăng nhập
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Bạn không có tài khoản? {''}
              <Link variant="subtitle2">Đăng ký ngay</Link>
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Hoặc
              </Typography>
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
