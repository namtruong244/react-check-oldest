import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import {useEffect, useState} from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination, CircularProgress, Link,
} from '@mui/material';
// components
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import {contentService} from "../services/contentService";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'class', label: 'Lớp', alignRight: false },
  { id: 'username', label: 'Tài khoản', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'action', label: 'Hành động', alignRight: false },
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_content) => _content.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DashboardAppPage() {

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [contents, setContents] = useState([]);

  const [isLoading, setIsLoading] = useState(true)

  const auth = useSelector(state => state.auth)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const response = await contentService.getAll(auth.user.token)
      setIsLoading(false)
      setContents(response.result.contents)
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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contents.length) : 0;

  const filteredUsers = applySortFilter(contents, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
      <>
        <Helmet>
          <title> Trang Chủ </title>
        </Helmet>

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Danh sách bài viết
            </Typography>
          </Stack>

          <Card>
            <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={contents.length}
                      onRequestSort={handleRequestSort}
                  />
                  {isLoading ?
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={5}>
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      :
                      <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          const { id, userName, content, title, classType } = row;

                          return (
                              <TableRow hover key={id} tabIndex={-1}>

                                <TableCell align="left" sx={{width: '20%'}}>
                                  <Typography
                                      sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '1',
                                        WebkitBoxOrient: 'vertical',
                                      }}
                                  >
                                    {title}
                                  </Typography>
                                </TableCell>

                                <TableCell align="left">{classType}</TableCell>

                                <TableCell align="left">{userName}</TableCell>
                                <TableCell align="left" sx={{width: '50%'}}>
                                  <Typography
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: '1',
                                      WebkitBoxOrient: 'vertical',
                                    }}
                                  >
                                    {content}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Link
                                      component="button"
                                      variant="body2"
                                      onClick={() => {
                                        navigate(`/kiem-tra/${id}`, {replace: true, state: row})
                                      }}
                                  >
                                    Kiểm tra
                                  </Link>
                                </TableCell>
                              </TableRow>
                          );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell colSpan={6} />
                            </TableRow>
                        )}
                      </TableBody>
                  }

                  {isNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <Paper
                                sx={{
                                  textAlign: 'center',
                                }}
                            >
                              <Typography variant="h6" paragraph>
                                Không có nội dung
                              </Typography>

                              <Typography variant="body2">
                                Không tìm được kết quả tìm kiếm cho từ khoá &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> Vui lòng thử lại với từ khoá khác.
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={contents.length}
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
