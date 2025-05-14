import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
                width: '100%',
                height: '100%',
                color: 'grey.500'
            }}
        >
            <CircularProgress color="secondary" />
        </Stack>
    );
}
