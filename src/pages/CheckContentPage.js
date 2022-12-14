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

    const audioProps = {
        audioType: "audio/wav",
        // audioOptions: {sampleRate: 30000}, // ???????????????????????????
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
                <title> Ki???m tra </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Ki???m tra
                </Typography>
                <Snackbar
                    sx={{mt: 10}}
                    open={recorderError}
                    autoHideDuration={3000}
                    TransitionComponent={props => <Slide {...props} direction="left"/>}
                    anchorOrigin={ {vertical: 'top', horizontal: 'right'} }
                >
                    <Alert severity={"error"} sx={{ width: '100%' }}>
                        ???? x???y ra l???i trong qu?? tr??nh y??u c???u quy???n s??? d???ng micro, vui l??ng cho ph??p s??? d???ng micro v?? th??? l???i!
                    </Alert>
                </Snackbar>
                <Box sx={{ minWidth: 275 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant={"h4"} sx={{ fontSize: 14 }}>
                                {state.title}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Ng?????i t???o:</strong> {state.fullName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>L???p:</strong> {state.classType}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Ng??n ng???:</strong> {state.languageType === 0 ? "Ti???ng Vi???t" : "Ti???ng Anh"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>N???i dung: </strong>
                                {status === 'recording' || status === 'pause' || isSpeechRecognizer || dataRecognizer !== "" ?
                                    "N???i dung ???? b??? ???n"
                                    :
                                    <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleShowContent}
                                >
                                    {isShowContent ? "???n" : "Hi???n"} n???i dung
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
                                                onClick={() => controlAudio("recording")}>{status === 'pause' ? 'Ti???p t???c thu ??m' : 'B???t ?????u thu ??m'}</Button>
                                    }
                                    {status === "recording" &&
                                        <Button variant={"contained"}
                                                onClick={() => controlAudio("pause")}>T???m d???ng thu ??m</Button>
                                    }
                                    <Button sx={{ml: 4}} variant={"outlined"}
                                            onClick={() => controlAudio("inactive")} disabled={status !== 'recording'}>Ho??n th??nh thu ??m</Button>
                                </div>
                            </AudioAnalyser>
                            <Typography sx={{mt: 1}} variant={"h6"}>{status === "recording" ? "??ang thu ??m..." : ""}</Typography>
                            <Typography sx={{mt: 1}} color={"red"} fontSize={13}>L??u ??: Vui l??ng cho ph??p tr??nh duy???t quy???n s??? d???ng micro khi ???????c y??u c???u</Typography>
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
                        <Alert severity="error" sx={{mt: 2, width: '100%'}}>C?? l???i x???y ra trong qu?? tr??nh x??? l?? ??m thanh (C?? th??? b???n ??ang ??? m???t m??i tr?????ng qu?? ???n,...), vui l??ng th??? l???i</Alert>
                    }
                    {dataRecognizer &&
                        <>
                            <FormControl fullWidth sx={{mt:2}}>
                                <TextField
                                    label="N???i dung b??i ghi ??m"
                                    multiline
                                    fullWidth
                                    rows={10}
                                    maxRows={Infinity}
                                    name="content"
                                    value={dataRecognizer}
                                    onChange={onChangeDataRecognizer}
                                    helperText={"Ki???m tra l???i n???i dung b??i ghi ??m tr?????c khi so s??nh k???t qu???"}
                                />
                            </FormControl>
                            <Box flex sx={{mt: 2}}>
                                <LoadingButton loading={isLoadingCompare} variant="contained" onClick={handleCompare}>So s??nh k???t qu???</LoadingButton>
                                <Button disabled={isLoadingCompare} variant="outlined" sx={{ml: 2}} onClick={handleResetRecorder}>Thu ??m l???i</Button>
                            </Box>
                        </>
                    }
                    {isDiffCompare !== null &&
                        <>
                            <Typography sx={{mt: 2}} variant={"h5"}>K???t qu???</Typography>
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
                                    <Typography sx={{mt: 1}} fontSize={12}>(*) N???i dung kh??c nhau ???????c ph??n c??ch b???i c???p d???u []</Typography>
                                </div>
                            }
                            {isDiffCompare === false &&
                                <Alert severity={"success"} sx={{ width: '100%' }}>Ch??c m???ng b???n ???? ho??n th??nh xu???t s???c b??i ki???m tra m?? kh??ng g???p b???t k??? l???i n??o</Alert>
                            }
                            <Button variant="outlined" sx={{mt: 2}} onClick={handleResetRecorder}>Ki???m tra l???i</Button>
                        </>
                    }
                </Box>
            </Container>
        </>
    );
}
