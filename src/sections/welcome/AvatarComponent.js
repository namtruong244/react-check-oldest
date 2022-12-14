import {Box, Card, CardContent, CircularProgress, Grid, keyframes, Modal, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {saveAvatar} from "../../providers/auth-provider/authSlice";
import {authService} from "../../services/authService";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    outline: 0
};

const zodiacName = [
    "Bạch Dương",
    "Kim Ngưu",
    "Song Tử",
    "Cự Giải",
    "Sư Tử",
    "Xử Nữ",
    "Thiên Bình",
    "Bọ Cạp",
    "Nhân Mã",
    "Ma Kết",
    "Bảo Bình",
    "Song Ngư"
]

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

export default function AvatarComponent({open, handleClose}) {
    const auth = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSaveAvatar = async (e) => {
        setIsLoading(true)
        try {
            const data = {...auth.user}
            data.avatarType = e.target.alt
            await authService.update({avatarType: e.target.alt}, auth.user.token)
            dispatch(saveAvatar(data))
            navigate('/bai-viet', {replace: true})
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card sx={style}>
                {isLoading &&
                    <Box display="flex" justifyContent="center" alignItems="center" style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)'}} >
                        <CircularProgress sx={{color: "#fff"}} />
                    </Box>
                }
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} variant={"h6"} gutterBottom>
                        Trước tiên hãy chọn linh vật yêu thích của mình:
                    </Typography>
                    <Box sx={{ width: '100%', mt: 2}}>
                        <Grid container rowSpacing={1} columnSpacing={3}>
                            {[...Array(12).keys()].map((_, index) =>
                                <Grid
                                    xs={4}
                                    key={index}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    flexDirection="column"
                                >
                                    <Box onClick={handleSaveAvatar} sx={isLoading ? {} : {cursor: "pointer", ":hover": {animation: `${shake} 0.5s`, animationIterationCount: "infinite"}}}>
                                        <img
                                            src={`/assets/images/avatars/avatar_${index + 1}.jpg`}
                                            alt={index + 1}
                                        />
                                    </Box>
                                    <Typography color={"primary"}>{zodiacName[index]}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Modal>
    )
}