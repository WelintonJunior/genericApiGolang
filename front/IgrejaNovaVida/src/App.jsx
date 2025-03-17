import { useState } from 'react';
import Header from './components/Header';
import ModalComponent from './components/ModalComponent';
import CadastrarPedido from './components/CadastrarPedido';
import logo from './assets/logo.jpg'
import Box from '@mui/material/Box';
import VerPedido from './components/VerPedido';
import ListarPedidos from './components/ListarPedidos';


export const BACK_END_HOST = import.meta.env.VITE_BACK_END_HOST;

function App() {
  const [modal, setModal] = useState(null);

  const abrirModal = (tipo) => setModal(tipo);
  const fecharModal = () => setModal(null);

  return (
    <>
      <Header abrirModal={abrirModal} />

      {/* Modal Cadastrar Pedido */}
      <ModalComponent open={modal === 'cadastrar'} handleClose={fecharModal}>
        <CadastrarPedido />
      </ModalComponent>

      {/* Outros modais */}
      <ModalComponent open={modal === 'listar'} handleClose={fecharModal}>
        <ListarPedidos />
      </ModalComponent>

      <ModalComponent open={modal === 'ver'} handleClose={fecharModal}>
        <VerPedido />
      </ModalComponent>

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <img src={logo} alt="Logo" style={{ height: "40em" }} />
      </Box>

    </>
  );
}

export default App;
