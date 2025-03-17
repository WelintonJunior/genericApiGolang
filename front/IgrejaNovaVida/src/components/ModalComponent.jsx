import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ModalComponent({ open, handleClose, children }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography>
          {children}
        </Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleClose}>
          Fechar
        </Button>
      </Box>
    </Modal>
  );
}
