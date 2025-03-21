import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Header({ abrirModal }) {
  return (
    <Box sx={{
      display: "flex",
      padding: 3
    }}>
      <Button sx={{padding: "15px"}} variant="contained" color="primary" onClick={() => abrirModal('cadastrar')}>
        Cadastrar Pedido
      </Button>
      <Button sx={{marginLeft: "25px"}} variant="contained" color="primary" onClick={() => abrirModal('listar')}>
        Listar Pedido
      </Button>
      {/* <Button variant="contained" color="primary" onClick={() => abrirModal('ver')}>
        Ver Pedido
      </Button> */}
    </Box>
  );
}
