import { Helmet } from 'react-helmet-async';
import {useCallback, useEffect, useState} from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Avatar,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, Box, LinearProgress,
} from '@mui/material';
// components
import {useSelector} from "react-redux";
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
import {contentService} from "../services/contentService";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'stt', label: 'STT', alignRight: false },
    { id: 'totalContent', label: 'Tổng số bài viết', alignRight: false },
    { id: 'username', label: 'Tên tài khoản', alignRight: false },
    { id: 'fullname', label: 'Tên đầy đủ', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function StatisticPage() {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [isLoading, setIsLoading] = useState(true)

    const [data, setData] = useState([])

    const auth = useSelector(state => state.auth)

    useEffect(() => {
        (async () => {
            const response = await contentService.getStatisticInfo(auth.user.token)
            setIsLoading(false)
            setData(response.result.statistic)
        })()

    }, [])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filteredUsers = applySortFilter(data, getComparator(order, orderBy));

    const HelmetStatistic = useCallback(() => (
        <Helmet>
            <title> Thống Kê </title>
        </Helmet>
    ), [])

    if (isLoading) {
        return (
            <>
                <HelmetStatistic />
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <Box sx={{ width: '50%' }}>
                        <LinearProgress />
                    </Box>
                </Container>
            </>
        )
    }

    return (
        <>
            <HelmetStatistic />

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Thống Kê
                    </Typography>
                </Stack>

                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={data.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        const { total, userName, fullName, email, avatarType } = row;

                                        return (
                                            <TableRow hover key={index} tabIndex={-1} role="checkbox">
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell>
                                                    {total}
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt="avatar" src={`/assets/images/avatars/avatar_${avatarType}.jpg`} />
                                                        <Typography variant="subtitle2" noWrap>
                                                            {userName}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{fullName}</TableCell>

                                                <TableCell align="left">{email}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </>
    );
}