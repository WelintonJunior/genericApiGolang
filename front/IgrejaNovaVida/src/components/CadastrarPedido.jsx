import { useState, useEffect } from "react";

export default function CadastrarPedido() {
    const [lanches, setLanches] = useState([]); // Lista de lanches no pedido
    const [snacksDisponiveis, setSnacksDisponiveis] = useState([]); // Lista de lanches da API

    const BACK_END_HOST = import.meta.env.VITE_BACK_END_HOST; // Definição da variável de ambiente

    // Função para buscar os lanches da API
    async function GetAllSnacks() {
        try {
            const response = await fetch(`${BACK_END_HOST}/snack/getAll`);
            if (!response.ok) throw new Error("Erro ao buscar lanches");
            const result = await response.json();
            setSnacksDisponiveis(result); 
        } catch (error) {
            console.error("Erro ao buscar lanches:", error);
        }
    }

    useEffect(() => {
        GetAllSnacks();
    }, []);

    const adicionarLanche = () => {
        setLanches([...lanches, { id: Date.now(), lancheId: "", quantidade: 1, personalizacao: "" }]);
    };

    const atualizarLanche = (id, campo, valor) => {
        setLanches(lanches.map(lanche => (lanche.id === id ? { ...lanche, [campo]: valor } : lanche)));
    };

    // Função para buscar ou criar o cliente
    const buscarOuCriarCliente = async (nome, endereco) => {
        try {
            // Verificar se o cliente já existe pelo nome
            const response = await fetch(`${BACK_END_HOST}/customer/getByName/${nome}`);
            if (response.ok) {
                const cliente = await response.json();
                return cliente; // Cliente encontrado
            }

            // Se não encontrar, criar um novo cliente
            const novoCliente = {
                name: nome,
                address: endereco,
            };

            const createResponse = await fetch(`${BACK_END_HOST}/customer/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoCliente),
            });

            if (!createResponse.ok) {
                throw new Error("Erro ao criar cliente");
            }

            const clienteCriado = await createResponse.json();
            return clienteCriado; // Retorna o cliente criado
        } catch (error) {
            console.error("Erro ao buscar ou criar cliente:", error);
            throw error;
        }
    };

    // Função para enviar o pedido
    const finalizarPedido = async (e) => {
        e.preventDefault(); // Evitar o comportamento padrão de submit do formulário

        const nomeCliente = e.target.clienteNome.value;
        const enderecoCliente = e.target.clienteEndereco.value;

        try {
            // Verificar ou criar o cliente
            const cliente = await buscarOuCriarCliente(nomeCliente, enderecoCliente);

            // Estrutura do pedido
            const pedido = {
                paid: false, // Pedido não pago inicialmente
                delivered: false, // Pedido não entregue inicialmente
                customer_id: cliente.ID, // ID do cliente
                customer_name: cliente.name, // Nome do cliente
                customer_address: cliente.address, // Endereço do cliente
                lanches: lanches.map(lanche => ({
                    snack_id: lanche.lancheId,  // ID do lanche selecionado
                    quantidade: lanche.quantidade, // Quantidade do lanche
                    personalizacao: lanche.personalizacao, // Personalização
                }))
            };

            const response = await fetch(`${BACK_END_HOST}/order/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pedido),
            });

            if (!response.ok) {
                throw new Error("Erro ao finalizar o pedido");
            }

            const result = await response.json();
            console.log("Pedido finalizado com sucesso:", result);
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
        }
    };

    return (
        <form onSubmit={finalizarPedido}>
            <input type="text" name="clienteNome" placeholder="Nome do cliente" required />
            <input type="text" name="clienteEndereco" placeholder="Endereço do cliente" required />

            {/* Botão para adicionar lanche */}
            <button type="button" onClick={adicionarLanche}>Adicionar Lanche</button>

            {lanches.map((lanche, index) => (
                <div key={index} style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
                    <label>Escolha o lanche:</label>
                    <select value={lanche.lancheId} onChange={(e) => atualizarLanche(lanche.id, "lancheId", e.target.value)}>
                        <option value="">Selecione...</option>
                        {snacksDisponiveis.map(snack => (
                            <option key={snack.ID} value={snack.ID}>{snack.Name}</option>
                        ))}
                    </select> <br />

                    <label>Quantidade:</label>
                    <input type="number" value={lanche.quantidade} min="1" onChange={(e) => atualizarLanche(lanche.id, "quantidade", e.target.value)} /> <br />

                    <label>Personalização:</label>
                    <select value={lanche.personalizacao} onChange={(e) => atualizarLanche(lanche.id, "personalizacao", e.target.value)}>
                        <option value="">Nenhuma</option>
                        <option value="adicionar">Adicionar Ingrediente</option>
                        <option value="remover">Remover Ingrediente</option>
                    </select> <br />
                </div>
            ))}

            <button type="submit">Finalizar Pedido</button>
        </form>
    );
}
