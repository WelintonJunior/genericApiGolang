import { useState, useEffect } from "react";
import {
    Box, Button, Grid, MenuItem, Select, TextField, Typography, Paper, Card, CardContent, IconButton
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { GetOrCreateCustomer } from "../services/customer";
import { BACK_END_HOST } from "../App";
import GetAllIngredients from "../services/ingredients";
import { GetAllSnacks } from "../services/snacks";
import { CreateOrder } from "../services/order";

export default function CadastrarPedido() {
    const [lanches, setLanches] = useState([]);
    const [snacksDisponiveis, setSnacksDisponiveis] = useState([]);
    const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
    const [clienteNome, setClienteNome] = useState("");
    const [clienteEndereco, setClienteEndereco] = useState("");
    const [clienteNumero, setClienteNumero] = useState("");

    useEffect(() => {
        GetAllSnacks(BACK_END_HOST, setSnacksDisponiveis);
        GetAllIngredients(BACK_END_HOST, setIngredientesDisponiveis)
    }, []);

    const addSnack = () => {
        setLanches([...lanches, {
            id: Date.now(),
            lancheId: "",
            quantidade: 1,
            adicionarIngredientes: [],
            removerIngredientes: []
        }]);
    };

    const removeSnack = (id) => {
        setLanches(lanches.filter(lanche => lanche.id !== id));
    };

    const updateSnack = (id, campo, valor) => {
        setLanches(lanches.map(lanche => (lanche.id === id ? { ...lanche, [campo]: valor } : lanche)));
    };

    const resetForm = () => {
        setClienteNome("");
        setClienteEndereco("");
        setLanches([]);
        setClienteNumero("");
    };

    const endOrder = async (e) => {
        e.preventDefault();

        try {
            if (lanches.length === 0) {
                alert("É necessário adicionar ao menos um lanche.");
                return;
            }

            const pedido = {
                paid: false,
                delivered: false,
                lanches: lanches.map(lanche => ({
                    snack_id: parseInt(lanche.lancheId),
                    quantidade: parseInt(lanche.quantidade),
                    adicionar_ingredientes: lanche.adicionarIngredientes.map(id => ({
                        id: parseInt(id)
                    })),
                    remover_ingredientes: lanche.removerIngredientes.map(id => ({
                        id: parseInt(id)
                    }))
                }))
            };

            if (pedido.lanches.some(lanche => isNaN(lanche.snack_id) || lanche.snack_id === "")) {
                alert("É necessário selecionar um lanche válido.");
                return;
            }

            const cliente = await GetOrCreateCustomer(BACK_END_HOST, clienteNome, clienteEndereco, clienteNumero);

            pedido.customer_id = cliente.ID;
            pedido.customer_name = cliente.name;
            pedido.customer_address = cliente.address;
            pedido.customer_number = parseInt(cliente.number);

            CreateOrder(BACK_END_HOST, pedido)
            resetForm();
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto"}}>
            <Paper sx={{ boxShadow:"none", padding: 3, maxHeight: "80vh", overflowY: "auto" }}>
                <Typography variant="h5" gutterBottom>Cadastro de Pedido</Typography>

                <form onSubmit={endOrder}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nome do Cliente"
                                variant="outlined"
                                required
                                value={clienteNome}
                                onChange={(e) => setClienteNome(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Endereço do Cliente"
                                variant="outlined"
                                required
                                value={clienteEndereco}
                                onChange={(e) => setClienteEndereco(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Número do Cliente"
                                variant="outlined"
                                required
                                value={clienteNumero}
                                type="number"
                                onChange={(e) => setClienteNumero(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={addSnack} startIcon={<AddCircleOutline />}>
                                Adicionar Lanche
                            </Button>
                        </Grid>

                        {lanches.map((lanche) => (
                            <Grid item xs={12} key={lanche.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">Lanche</Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Select
                                                    fullWidth
                                                    value={lanche.lancheId}
                                                    onChange={(e) => updateSnack(lanche.id, "lancheId", e.target.value)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">Selecione um lanche...</MenuItem>
                                                    {snacksDisponiveis.map(snack => (
                                                        <MenuItem key={snack.ID} value={snack.ID}>{snack.Name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    type="number"
                                                    label="Qtd"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={lanche.quantidade}
                                                    inputProps={{ min: 1 }}
                                                    onChange={(e) => updateSnack(lanche.id, "quantidade", e.target.value)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">Personalização</Typography>

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1">Adicionar Ingredientes</Typography>
                                                    <Select
                                                        multiple
                                                        fullWidth
                                                        value={lanche.adicionarIngredientes}
                                                        onChange={(e) => updateSnack(lanche.id, "adicionarIngredientes", e.target.value)}
                                                        displayEmpty
                                                    >
                                                        {ingredientesDisponiveis
                                                            .filter(ing => ing.Price > 0)
                                                            .map(ing => (
                                                                <MenuItem key={ing.ID} value={ing.ID}>
                                                                    {ing.Name} (+R$ {ing.Price.toFixed(2)})
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1">Remover Ingredientes</Typography>
                                                    <Select
                                                        multiple
                                                        fullWidth
                                                        value={lanche.removerIngredientes}
                                                        onChange={(e) => updateSnack(lanche.id, "removerIngredientes", e.target.value)}
                                                        displayEmpty
                                                    >
                                                        {ingredientesDisponiveis
                                                            .map(ing => (
                                                                <MenuItem key={ing.ID} value={ing.ID}>
                                                                    {ing.Name}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="success" fullWidth>
                                Finalizar Pedido
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
