import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import {Typography, Box} from '@mui/material';
import {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {AvatarComponent} from "../sections/welcome";

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
    backgroundColor: 'rgb(255,255,255)',
    minWidth: 700,
    minHeight: 700,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderRadius: '50%',
    padding: theme.spacing(22, 0)
}));

// ----------------------------------------------------------------------

export default function WelcomePage() {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const auth = useSelector(state => state.auth)
    const navigate = useNavigate()

    const handleLetGo = () => {
        if (auth.user.avatarType === null) {
            setOpen(true)
        }else {
            navigate('/bai-viet', {replace: true})
        }
    }

    return (
        <>
            <Helmet>
                <title> Chào Mừng </title>
            </Helmet>

            <AvatarComponent open={open} handleClose={handleClose}/>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{height: '100vh', background: `url("/assets/images/background_1.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" paragraph>
                        Chào mừng bạn đã đến với Let's Recite
                    </Typography>

                    <Typography variant="h4">
                        "Học bài khỏi lo tìm ai dò, có mình ở đây dò bài cho"
                    </Typography>

                    <Box
                        component="img"
                        src="/assets/images/letsgo1.gif"
                        sx={{ height: 150, mx: 'auto', my: 1, cursor: "pointer" }}
                        onClick={handleLetGo}
                    />
                </StyledContent>
            </Box>
        </>
    );
}
