import { Helmet } from 'react-helmet-async';
import {useState} from 'react';
// @mui
import {
    Alert,
    Box, Button, Card, CardContent,
    Container, Divider,
    FormControl,
    LinearProgress, Link,
    Slide, Snackbar, Stack,
    TextField,
    Typography
} from '@mui/material';

// components
import {useSelector} from "react-redux";
import {LoadingButton} from "@mui/lab";
import {useLocation} from "react-router-dom";
import AudioAnalyser from "react-audio-analyser/lib/AudioAnalyser";
import {contentService} from "../services/contentService";


// ----------------------------------------------------------------------

export default function CheckContentPage() {
    const [status, setStatus] = useState("")
    const [isSpeechRecognizer, setIsSpeechRecognizer] = useState(false)
    const [recorderError, setRecorderError] = useState(false)
    const [dataRecognizer, setDataRecognizer] = useState("")
    const [isErrorRecognizer, setIsErrorRecognizer] = useState(false)
    const auth = useSelector(state => state.auth)
    const [isShowContent, setIsShowContent] = useState(false)
    const [isLoadingCompare, setIsLoadingCompare] = useState(false)
    const [dataCompare1, setDataCompare1] = useState("")
    const [dataCompare2, setDataCompare2] = useState("")
    const [isDiffCompare, setIsDiffCompare] = useState(null)

    const location = useLocation();
    const {state} = location;

    const handleSave = async (audioBlob) => {
        setIsShowContent(false)
        const audioFile = new File([audioBlob], 'voice.wav', { type: 'audio/wav' });
        const formData = new FormData(); // preparing to send to the server

        formData.append('file', audioFile);  // preparing to send to the server
        let languageType = "vi-VN"
        if (state.languageType === 1) {
            languageType = "en-US"
        }
        formData.append('languageType', languageType)
        try {
            const response = await contentService.speechToTextRecognizer(formData, auth.user.token)
            if (response.header.error) {
                setIsErrorRecognizer(true)
            }else {
                setDataRecognizer(response.result)
            }
        }catch (e) {
            console.log(e)
        }finally {
            setIsSpeechRecognizer(false)
        }
    };
    console.log(status)
    const audioProps = {
        audioType: "audio/wav",
        // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
        status,
        width: '0px',
        height: '0px',
        timeslice: 1000,
        stopCallback: (e) => {
            setIsSpeechRecognizer(true)
            handleSave(e)
        },
        errorCallback: (err) => {
            console.log("error", err)
            setRecorderError(true)
            setTimeout(() => {
                setRecorderError(false)
            }, 3000)
        }
    }

    const controlAudio = (status) => {
        setStatus(status)
        setIsErrorRecognizer(false)
    }

    const handleShowContent = () => {
        setIsShowContent(!isShowContent)
    }

    const handleResetRecorder = () => {
        setStatus("")
        setIsSpeechRecognizer(false)
        setRecorderError(false)
        setDataRecognizer("")
        setIsErrorRecognizer(false)
        setIsLoadingCompare(false)
        setDataCompare1("")
        setDataCompare2("")
        setIsDiffCompare(null)
    }

    const onChangeDataRecognizer = (e) => {
        setDataRecognizer(e.target.value)
    }

    const handleCompare = async () => {
        setIsLoadingCompare(true)
        const data = {
            contentId: state.id,
            textInput: dataRecognizer
        }
        const response = await contentService.compareText(data, auth.user.token)
        if (response.result.isDiff === true) {
            setDataCompare1(response.result.text1)
            setDataCompare2(response.result.text2)
            setIsDiffCompare(true)
        }else {
            setIsDiffCompare(false)
        }
        setDataRecognizer("")
        setIsLoadingCompare(false)
    }
    return (
        <>
            <Helmet>
                <title> Kiểm tra </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Kiểm tra
                </Typography>
                <Snackbar
                    sx={{mt: 10}}
                    open={recorderError}
                    autoHideDuration={3000}
                    TransitionComponent={props => <Slide {...props} direction="left"/>}
                    anchorOrigin={ {vertical: 'top', horizontal: 'right'} }
                >
                    <Alert severity={"error"} sx={{ width: '100%' }}>
                        Đã xảy ra lỗi trong quá trình yêu cầu quyền sử dụng micro, vui lòng cho phép sử dụng micro và thử lại!
                    </Alert>
                </Snackbar>
                <Box sx={{ minWidth: 275 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant={"h4"} sx={{ fontSize: 14 }}>
                                {state.title}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Người tạo:</strong> {state.fullName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Lớp:</strong> {state.classType}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Ngôn ngữ:</strong> {state.languageType === 0 ? "Tiếng Việt" : "Tiếng Anh"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Nội dung: </strong>
                                {status === 'recording' || status === 'pause' ?
                                    "Nội dung không được hiển thị khi đang thu âm"
                                    :
                                    <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleShowContent}
                                >
                                    {isShowContent ? "Ẩn" : "Hiện"} nội dung
                                </Link>}
                            </Typography>
                            {isShowContent && !(status === 'recording' || status === 'pause') && dataRecognizer === "" &&
                                <Typography variant="body2">
                                    {state.content}
                                </Typography>
                            }
                        </CardContent>
                    </Card>
                    {!(dataRecognizer !== "" || isSpeechRecognizer === true || isDiffCompare !== null) &&
                        <>
                            <AudioAnalyser {...audioProps}>
                                <div>
                                    {status !== "recording" &&
                                        <Button variant={"contained"}
                                                onClick={() => controlAudio("recording")}>{status === 'pause' ? 'Tiếp tục thu âm' : 'Bắt đầu thu âm'}</Button>
                                    }
                                    {status === "recording" &&
                                        <Button variant={"contained"}
                                                onClick={() => controlAudio("pause")}>Tạm dừng thu âm</Button>
                                    }
                                    <Button sx={{ml: 4}} variant={"outlined"}
                                            onClick={() => controlAudio("inactive")} disabled={status !== 'recording'}>Hoàn thành thu âm</Button>
                                </div>
                            </AudioAnalyser>
                            <Typography sx={{mt: 1}} variant={"h6"}>{status === "recording" ? "Đang thu âm..." : ""}</Typography>
                            <Typography sx={{mt: 1}} color={"red"} fontSize={13}>Lưu ý: Vui lòng cho phép trình duyệt quyền sử dụng micro khi được yêu cầu</Typography>
                        </>
                    }
                    {isSpeechRecognizer &&
                        <>
                            <Box sx={{width: '100%', mt: 2}}>
                                <LinearProgress/>
                            </Box>
                        </>
                    }
                    {isErrorRecognizer &&
                        <Alert severity="error" sx={{mt: 2, width: '100%'}}>Có lỗi xảy ra trong quá trình xử lý âm thanh (Có thể bạn đang ở một môi trường quá ồn,...), vui lòng thử lại</Alert>
                    }
                    {dataRecognizer &&
                        <>
                            <FormControl fullWidth sx={{mt:2}}>
                                <TextField
                                    label="Nội dung bài ghi âm"
                                    multiline
                                    fullWidth
                                    rows={10}
                                    maxRows={Infinity}
                                    name="content"
                                    value={dataRecognizer}
                                    onChange={onChangeDataRecognizer}
                                    helperText={"Kiểm tra lại nội dung bài ghi âm trước khi so sánh kết quả"}
                                />
                            </FormControl>
                            <Box flex sx={{mt: 2}}>
                                <LoadingButton loading={isLoadingCompare} variant="contained" onClick={handleCompare}>So sánh kết quả</LoadingButton>
                                <Button disabled={isLoadingCompare} variant="outlined" sx={{ml: 2}} onClick={handleResetRecorder}>Thu âm lại</Button>
                            </Box>
                        </>
                    }
                    {isDiffCompare !== null &&
                        <>
                            <Typography sx={{mt: 2}} variant={"h5"}>Kết quả</Typography>
                            {isDiffCompare === true &&
                                <div>
                                    <Stack
                                        direction="row"
                                        divider={<Divider orientation="vertical" flexItem />}
                                        spacing={2}
                                    >
                                        <Card variant="outlined" sx={{width: "50%"}}>
                                            <CardContent>
                                                <Typography>{dataCompare1}</Typography>
                                            </CardContent>
                                        </Card>
                                        <Card variant="outlined" sx={{width: "50%"}}>
                                            <CardContent>
                                                <Typography>{dataCompare2}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                    <Typography sx={{mt: 1}} fontSize={12}>(*) Nội dung khác nhau được phân cách bởi cặp dấu []</Typography>
                                </div>
                            }
                            {isDiffCompare === false &&
                                <Alert severity={"success"} sx={{ width: '100%' }}>Chúc mừng bạn đã hoàn thành xuất sắc bài kiểm tra mà không gặp bất kỳ lỗi nào</Alert>
                            }
                            <Button variant="outlined" sx={{mt: 2}} onClick={handleResetRecorder}>Kiểm tra lại</Button>
                        </>
                    }
                </Box>
            </Container>
        </>
    );
}
