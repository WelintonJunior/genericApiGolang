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
        GetAllIngredients(BACK_END_HOST, setIngredientesDisponiveis);
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

        if (lanches.length === 0) {
            alert("É necessário adicionar ao menos um lanche.");
            return;
        }

        try {
            const pedido = {
                paid: false,
                delivered: false,
                lanches: lanches.map(lanche => ({
                    snack_id: parseInt(lanche.lancheId),
                    quantidade: parseInt(lanche.quantidade),
                    adicionar_ingredientes: lanche.adicionarIngredientes.map(id => ({ id: parseInt(id) })),
                    remover_ingredientes: lanche.removerIngredientes.map(id => ({ id: parseInt(id) }))
                }))
            };

            const cliente = await GetOrCreateCustomer(BACK_END_HOST, clienteNome, clienteEndereco, clienteNumero);
            pedido.customer_id = cliente.ID;

            await CreateOrder(BACK_END_HOST, pedido);
            resetForm();
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", position: "relative" }}>
            <Paper sx={{ boxShadow: 3, padding: 3, borderRadius: 3, overflow: "hidden" }}>
                <Typography variant="h5" gutterBottom><strong>Cadastro de Pedido</strong></Typography>

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
                                type="number"
                                value={clienteNumero}
                                onChange={(e) => setClienteNumero(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ maxHeight: "50vh", overflowY: "auto", mt: 2, pr: 1 }}>
                        {lanches.map((lanche) => (
                            <Card key={lanche.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="h6"><strong>Lanche</strong></Typography>
                                        <IconButton color="error" onClick={() => removeSnack(lanche.id)}>
                                            <RemoveCircleOutline />
                                        </IconButton>
                                    </Box>

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
                                                label="Quantidade"
                                                variant="outlined"
                                                fullWidth
                                                value={lanche.quantidade}
                                                inputProps={{ min: 1 }}
                                                onChange={(e) => updateSnack(lanche.id, "quantidade", e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1"><strong>Personalização</strong></Typography>

                                            <Typography variant="subtitle2">Adicionar Ingredientes</Typography>
                                            <Select
                                                multiple
                                                fullWidth
                                                value={lanche.adicionarIngredientes}
                                                onChange={(e) => updateSnack(lanche.id, "adicionarIngredientes", e.target.value)}
                                            >
                                                {ingredientesDisponiveis
                                                    .filter(ing => ing.Price > 0)
                                                    .map(ing => (
                                                        <MenuItem key={ing.ID} value={ing.ID}>
                                                            {ing.Name} (+R$ {ing.Price.toFixed(2)})
                                                        </MenuItem>
                                                    ))}
                                            </Select>

                                            <Typography variant="subtitle2" sx={{ mt: 1 }}>Remover Ingredientes</Typography>
                                            <Select
                                                multiple
                                                fullWidth
                                                value={lanche.removerIngredientes}
                                                onChange={(e) => updateSnack(lanche.id, "removerIngredientes", e.target.value)}
                                            >
                                                {ingredientesDisponiveis.map(ing => (
                                                    <MenuItem key={ing.ID} value={ing.ID}>{ing.Name}</MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </form>
            </Paper>

            <Box sx={{ textAlign: "center", mt: 3 }}>

                <Button  variant="contained" color="primary" fullWidth onClick={addSnack} startIcon={<AddCircleOutline />}>
                    Adicionar Lanche
                </Button>

                <Button sx={{mt: 2}} type="submit" variant="contained" color="success" fullWidth onClick={endOrder}>
                    Finalizar Pedido
                </Button>
            </Box>
        </Box>
    );
}
