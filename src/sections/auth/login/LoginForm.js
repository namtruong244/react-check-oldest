import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Collapse, Alert, AlertTitle} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {useForm} from "react-hook-form";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import Iconify from '../../../components/iconify';
import {login} from "../../../providers/auth-provider/authSlice";

// ----------------------------------------------------------------------

const schema = yup.object().shape({
    username: yup.string()
        .required("Tên tài khoản là trường bắt buộc")
        .min(5, "Tên tài khoản phải có độ dài tối thiểu là 5 ký tự")
        .matches("^[a-zA-Z0-9]*$", "Tên tài khoản không hợp lệ"),
    password: yup.string()
        .required("Mật khẩu là trường bắt buộc")
        .min(5, "Mật khẩu phải có độ dài tối thiểu là 5 ký tự")
        .matches("^[\x00-\x7F]*$", "Mật khẩu không hợp lệ")
})

export default function LoginForm() {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: yupResolver(schema)
    });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = data => {
      dispatch(login(data))
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Collapse in={auth.isError}>
            <Alert severity="error">
                <AlertTitle>Có lỗi xảy ra</AlertTitle>
                Tên tài khoản hoặc mật khẩu không chính xác
            </Alert>
            <br/>
        </Collapse>
      <Stack spacing={3}>
        <TextField
            error={errors.username}
            name="username"
            label="Tên tài khoản"
            {...register("username")}
            helperText={errors.username?.message}
        />

        <TextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={errors.password}
          {...register("password")}
          helperText={errors.password?.message}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={auth.isLoading}>
        Đăng nhập
      </LoadingButton>
    </form>
  );
}
