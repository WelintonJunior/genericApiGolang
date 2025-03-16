import { useState } from 'react';
import Header from './components/Header';
import ModalComponent from './components/ModalComponent';
import CadastrarPedido from './components/CadastrarPedido';

export const BACK_END_HOST = import.meta.env.VITE_BACK_END_HOST;

function App() {
  const [modal, setModal] = useState(null); // Controla qual modal abrir

  const abrirModal = (tipo) => setModal(tipo);
  const fecharModal = () => setModal(null);

  return (
    <>
      <Header abrirModal={abrirModal} />

      {/* Modal Cadastrar Pedido */}
      <ModalComponent open={modal === 'cadastrar'} handleClose={fecharModal} title="Cadastrar Pedido">
        <CadastrarPedido />
      </ModalComponent>

      {/* Outros modais */}
      <ModalComponent open={modal === 'listar'} handleClose={fecharModal} title="Listar Pedidos">
        <p>Lista de pedidos aqui...</p>
      </ModalComponent>

      <ModalComponent open={modal === 'ver'} handleClose={fecharModal} title="Detalhes do Pedido">
        <p>Detalhes do pedido aqui...</p>
      </ModalComponent>
    </>
  );
}

export default App;
