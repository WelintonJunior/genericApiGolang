export async function GetAllSnacks(BACK_END_HOST, setSnacksDisponiveis) {
    try {
        const response = await fetch(`${BACK_END_HOST}/snack/getAll`);
        if (!response.ok) throw new Error("Erro ao buscar lanches");
        const result = await response.json();
        setSnacksDisponiveis(result);
    } catch (error) {
        console.error("Erro ao buscar lanches:", error);
    }
}

export async function GetSnackById(BACK_END_HOST, id) {
    try {
        const response = await fetch(`${BACK_END_HOST}/snack/` + id);
        if (!response.ok) throw new Error("Erro ao buscar lanche");
        const result = await response.json();
        return result
    } catch (error) {
        console.error("Erro ao buscar lanches:", error);
    }
}