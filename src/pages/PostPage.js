import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Alert,
  Box,
  Container,
  FormControl, FormControlLabel, FormLabel,
  InputLabel, MenuItem, Radio, RadioGroup,
  Select, Slide, Snackbar,
  TextField,
  Typography
} from '@mui/material';

import {useForm, Controller} from "react-hook-form";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
// components
import {useSelector} from "react-redux";
import {LoadingButton} from "@mui/lab";
import {contentService} from "../services/contentService";

// ----------------------------------------------------------------------

const schema = yup.object().shape({
  title: yup.string()
      .required("Tiêu đề là trường bắt buộc"),
  content: yup.string()
      .required("Nội dung bài viết là trường bắt buộc")
})

export default function PostPage() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      languageType: 0,
    }
  });

  const auth = useSelector(state => state.auth)

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await contentService.createContent(data, auth.user.token)
      setIsLoading(false)
      if (response.header.error !== null) {
        setError(true)
      }else{
        reset()
      }
    }catch (e) {
      console.log(e)
      setError(true)
    }
    setOpen(true)
  }


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setError(false);
  };

  return (
    <>
      <Helmet>
        <title> Tạo Bài viết </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tạo bài viết
        </Typography>
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            TransitionComponent={props => <Slide {...props} direction="left"/>}
            anchorOrigin={ {vertical: 'top', horizontal: 'right'} }
        >
          <Alert onClose={handleClose} severity={error ? "error" : "success" } sx={{ width: '100%' }}>
            {error ? "Có lỗi xảy ra vui lòng thử lại sau" : "Tạo bài viết mới thành công!"}
          </Alert>
        </Snackbar>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormControl fullWidth>
            <TextField
                error={errors.title}
                name="title"
                {...register("title")}
                helperText={errors.title?.message}
                label="Tiêu đề"
           />
          </FormControl>
          <FormControl sx={{ my: 2, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Lớp</InputLabel>
            <Select
                defaultValue={1}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Lớp"
                name="classType"
                {...register("classType")}
            >
              {
                Array.from(Array(12), (_, i) =>
                    <MenuItem key={i} value={i+1}>{i+1}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <FormControl sx={{mb: 2, minWidth: 120 }} size="small" fullWidth>
            <FormLabel id="demo-row-radio-buttons-group-label">Ngôn ngữ</FormLabel>
            <Controller
                rules={{ required: true }}
                control={control}
                name="languageType"
                render={({ field }) => {
                  return (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                            value={0}
                            control={<Radio />}
                            label="Tiếng Việt"
                        />
                        <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="Tiếng Anh"
                        />
                      </RadioGroup>
                  );
                }}
            />

          </FormControl>
          <FormControl fullWidth>
            <TextField
                label="Nội dung bài viết"
                multiline
                fullWidth
                rows={10}
                maxRows={Infinity}
                name="content"
                {...register("content")}
                error={errors.content}
                helperText={errors.content?.message}
            />
          </FormControl>
          <LoadingButton loading={isLoading} sx={{mt: 2}} variant="contained" type={"submit"} >Tạo bài viết</LoadingButton>
        </Box>
      </Container>
    </>
  );
}
