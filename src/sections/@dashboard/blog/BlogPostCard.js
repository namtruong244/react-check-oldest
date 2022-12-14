import PropTypes from 'prop-types';
// @mui
import {styled} from '@mui/material/styles';
import {Box, Link, Card, Grid, Avatar, Typography, CardContent, Button} from '@mui/material';
import {useNavigate} from "react-router-dom";
// utils
//
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
    position: 'relative',
    paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({theme}) => ({
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    left: theme.spacing(3),
    bottom: theme.spacing(-2),
}));

const StyledCover = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
    post: PropTypes.object.isRequired
};

export default function BlogPostCard({post, index}) {
    const {id, title, fullName, avatarType, classType} = post;

    const navigate = useNavigate()
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card sx={{position: 'relative'}}>
                <StyledCardMedia
                >
                    <SvgColor
                        color="paper"
                        src="/assets/icons/shape-avatar.svg"
                        sx={{
                            width: 80,
                            height: 36,
                            zIndex: 9,
                            bottom: -15,
                            position: 'absolute',
                            color: 'background.paper'
                        }}
                    />
                    <StyledAvatar
                        alt={"ABC"}
                        src={`/assets/images/avatars/avatar_${avatarType}.jpg`}
                    />

                    <StyledCover alt={title} src={`/assets/images/covers/cover_${index}.jpg`}/>
                </StyledCardMedia>

                <CardContent
                    sx={{
                        pt: 4
                    }}
                >
                    <Typography gutterBottom variant="caption" sx={{color: 'text.disabled', display: 'block'}}>
                        {fullName}
                    </Typography>
                    <Typography gutterBottom variant="caption">
                        Lớp: {classType}
                    </Typography>
                    <StyledTitle
                        color="inherit"
                        variant="subtitle2"
                        underline="none"
                    >
                        {title}
                    </StyledTitle>
                    <Box display={"flex"} justifyContent={"right"}>
                        <Button onClick={() => navigate(`/kiem-tra/${id}`, {replace: true, state: post})} sx={{mt: 2}}
                                variant="outlined">Kiểm tra</Button>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
}
