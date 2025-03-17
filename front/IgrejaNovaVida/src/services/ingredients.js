export default async function GetAllIngredients(BACK_END_HOST, setIngredientesDisponiveis) {
    try {

        fetch(`${BACK_END_HOST}/ingredient/getAll`)
            .then(res => res.json())
            .then(data => setIngredientesDisponiveis(data))
            .catch(err => console.error("Erro ao buscar ingredientes:", err));
    } catch (error) {
        console.error("Erro ao buscar lanches:", error);
    }
}
