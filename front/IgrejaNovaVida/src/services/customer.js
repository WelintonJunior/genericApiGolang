export const GetOrCreateCustomer = async (BACK_END_HOST, nome, endereco, number) => {
    try {
        const response = await fetch(`${BACK_END_HOST}/customer/getByNameAndAddress?name=${nome}&address=${endereco}`);
        
        if (response.ok) {
            const cliente = await response.json();
            return cliente;
        }

        const novoCliente = {
            name: nome,
            address: endereco,
            number: parseInt(number)
        };

        const createResponse = await fetch(`${BACK_END_HOST}/customer/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoCliente),
        });

        if (!createResponse.ok) {
            throw new Error("Erro ao criar cliente" + createResponse);
        }

        const clienteCriado = await createResponse.json();
        return clienteCriado;
    } catch (error) {
        console.error("Erro ao buscar ou criar cliente:", error);
        throw error;
    }
};
