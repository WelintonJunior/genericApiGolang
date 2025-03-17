import { useState, useEffect } from "react";
import {
    Box, Button, Grid, TextField, Typography, Paper, Card, CardContent, Checkbox, FormControlLabel
} from "@mui/material";
import { BACK_END_HOST } from "../App";
import { GetSnackById } from "../services/snacks";
import { GetOrderByCustomerName, UpdateOrder } from "../services/order";

export default function VerPedido() {
    const [order, setOrder] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackNames, setSnackNames] = useState({});
    const [total, setTotal] = useState(0);

    const resetForm = () => {
        setCustomerName("");
        setOrder(null);
        setTotal(0);
    };

    const getOrder = async (e) => {
        e.preventDefault();

        if (!customerName.trim()) {
            alert("Nome do cliente deve ser preenchido");
            return;
        }

        setLoading(true);
        try {
            const data = await GetOrderByCustomerName(BACK_END_HOST, customerName);
            if (data) {
                setOrder(data);
            } else {
                alert("Pedido não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar pedido:", error);
            alert("Erro ao buscar pedido.");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (order) {
            const fetchSnackNames = async () => {
                let names = {};
                let calculatedTotal = 0;

                for (let lanche of order.lanches) {
                    const snack = await GetSnackById(BACK_END_HOST, lanche.snack_id);
                    names[lanche.snack_id] = snack;

                    if (snack) {
                        let lancheTotal = snack.Price * lanche.quantidade;

                        for (let ing of lanche.adicionar_ingredientes) {
                            lancheTotal += ing.Price * lanche.quantidade;
                        }

                        calculatedTotal += lancheTotal;
                    }
                }

                setSnackNames(names);
                setTotal(calculatedTotal);
            };

            fetchSnackNames();
        }
    }, [order]);

    const handleUpdateStatus = async (statusType, newValue) => {
        try {
            const updatedOrder = {
                id: order.id,
                paid: statusType === "paid" ? newValue : order.paid, // Mantém o valor antigo caso não seja alterado
                delivered: statusType === "delivered" ? newValue : order.delivered,
                customer_id: order.customer_id
            };
    
            const result = await UpdateOrder(BACK_END_HOST, updatedOrder);
    
            setOrder((prevOrder) => ({
                ...prevOrder,
                paid: result.paid,
                delivered: result.delivered,
            }));
    
            alert("Pedido atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            alert("Erro ao atualizar pedido. Tente novamente.");
        }
    };
    
    
    return (
        <Box sx={{ maxWidth: 900, margin: "auto"}}>
            <Paper sx={{ boxShadow: "none", padding: 3, maxHeight: "80vh", overflowY: "auto" }}>
                <Typography variant="h5" gutterBottom>Ver Pedido</Typography>

                <form onSubmit={getOrder}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nome do Cliente"
                                variant="outlined"
                                required
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="success" fullWidth>
                                Buscar Pedido
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {loading && <Typography align="center" sx={{ mt: 2 }}>Carregando...</Typography>}

                {order && (
                    <>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Detalhes do Pedido</Typography>
                            <Typography><strong>Cliente:</strong> {order.customer.Name}</Typography>
                            <Typography><strong>Endereço:</strong> {order.customer.Address}</Typography>
                            <Typography>
                                <strong>WhatsApp:</strong>
                                <a href={`https://wa.me/${order.customer.Number}`} target="_blank" rel="noopener noreferrer">
                                    {order.customer.Number}
                                </a>
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={order.paid}
                                        onChange={(e) => handleUpdateStatus("paid", e.target.checked)}
                                    />
                                }
                                label="Pago"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={order.delivered}
                                        onChange={(e) => handleUpdateStatus("delivered", e.target.checked)}
                                    />
                                }
                                label="Entregue"
                            />
                        </Box>

                        <Typography variant="h6" sx={{ mt: 3 }}>Lanches</Typography>
                        {order.lanches && order.lanches.length > 0 ? (
                            order.lanches.map((lanche, index) => {
                                const snack = snackNames[lanche.snack_id];
                                return (
                                    <Card key={index} variant="outlined" sx={{ mt: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">{snack ? snack.Name : "Carregando..."}</Typography>
                                            <Typography><strong>Quantidade:</strong> {lanche.quantidade}</Typography>

                                            {lanche.adicionar_ingredientes.length > 0 && (
                                                <>
                                                    <Typography variant="subtitle2">Adicionados:</Typography>
                                                    <ul>
                                                        {lanche.adicionar_ingredientes.map((ing) => (
                                                            <li key={ing.ID}>
                                                                {ing.Name} (+R$ {typeof ing.Price === 'number' ? ing.Price.toFixed(2) : '0.00'})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            {lanche.remover_ingredientes.length > 0 && (
                                                <>
                                                    <Typography variant="subtitle2">Removidos:</Typography>
                                                    <ul>
                                                        {lanche.remover_ingredientes.map((ing) => (
                                                            <li key={ing.ID}>{ing.Name}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <Typography sx={{ mt: 2 }}>Nenhum lanche encontrado para este pedido.</Typography>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Total: R$ {total.toFixed(2)}</Typography>
                            <Button variant="contained" color="secondary" onClick={resetForm} fullWidth>
                                Resetar
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
