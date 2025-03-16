import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Header({ abrirModal }) {
  return (
    <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      padding: 3
    }}>
      <Button variant="contained" color="primary" onClick={() => abrirModal('cadastrar')}>
        Cadastrar Pedido
      </Button>
      <Button variant="contained" color="primary" onClick={() => abrirModal('listar')}>
        Listar Pedido
      </Button>
      <Button variant="contained" color="primary" onClick={() => abrirModal('ver')}>
        Ver Pedido
      </Button>
    </Box>
  );
}
