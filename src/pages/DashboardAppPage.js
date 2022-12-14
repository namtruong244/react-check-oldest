import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import {useCallback, useEffect, useState} from 'react';
// @mui
import {
  Card,
  Stack,
  Container,
  Typography, Grid, Box, LinearProgress,
} from '@mui/material';
// components
import {useSelector} from "react-redux";
import {Pagination} from "@mui/lab";

import {makeStyles} from "@mui/styles";
import {contentService} from "../services/contentService";
import {BlogPostCard} from "../sections/@dashboard/blog";


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

const useStyles = makeStyles(() => ({
  ul: {
    "& .MuiPaginationItem-root": {
      color: "#fff"
    }
  }
}));

export default function DashboardAppPage() {

  const [page, setPage] = useState(1);

  const [filterName, setFilterName] = useState('');

  const [contents, setContents] = useState([]);

  const [isLoading, setIsLoading] = useState(true)

  const [indexCover, setIndexCover] = useState([])

  const auth = useSelector(state => state.auth)

  const classes = useStyles()

  useEffect(() => {
    (async () => {
      const response = await contentService.getAll(auth.user.token)
      setIsLoading(false)
      setContents(response.result.contents)
    })()

  }, [])

  useEffect(() => {
    const nums = [...Array(17).keys()];
    const ranNums = []
    let i = 12
    let j = 0;

    // eslint-disable-next-line no-plusplus
    while (i--) {
      j = Math.floor(Math.random() * (i+1));
      ranNums.push(nums[j]);
      nums.splice(j,1);
    }
    setIndexCover(ranNums)
  }, [page])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleFilterByName = (event) => {
  //   setPage(0);
  //   setFilterName(event.target.value);
  // };

  const filteredPosts = applySortFilter(contents, getComparator('asc', 'title'), filterName);

  // const isNotFound = !filteredPosts.length && !!filterName;

  const HelmetPost = useCallback(() => (
      <Helmet>
        <title> Bài Viết </title>
      </Helmet>
  ), [])

  if (isLoading) {
    return (
        <>
          <HelmetPost />
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
        <HelmetPost />

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Tất cả bài viết
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {filteredPosts.slice((page - 1) * 12, (page - 1) * 12 + 12).map((post, index) =>
              <BlogPostCard key={post.id} post={post} index={indexCover[index] + 1} />
            )}
          </Grid>
          <Box sx={{mt: 5}} display={"flex"} justifyContent={"center"}>
            <Pagination classes={{ ul: classes.ul }} onChange={handleChangePage} page={page} count={Math.ceil(filteredPosts.length / 12)} shape="rounded" variant="outlined" color="primary" />
          </Box>
        </Container>
      </>
  );
}
