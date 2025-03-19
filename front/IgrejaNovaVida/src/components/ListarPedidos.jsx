import { useState, useEffect } from "react";
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, CircularProgress, Card, CardContent
} from "@mui/material";
import { BACK_END_HOST } from "../App";
import { GetAllOrders, UpdateOrder } from "../services/order";
import { GetSnackById } from "../services/snacks";

export default function ListarPedidos() {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [snackNames, setSnackNames] = useState({}); // Estado para armazenar nomes dos lanches

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await GetAllOrders(BACK_END_HOST);
            setOrders(data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            alert("Erro ao buscar pedidos. Tente novamente.");
        }
        setLoading(false);
    };

    const handleSelectOrder = async (order) => {
        setSelectedOrder(order);

        const names = { ...snackNames };

        for (const lanche of order.lanches) {
            if (!names[lanche.snack_id]) {
                try {
                    const snack = await GetSnackById(BACK_END_HOST, lanche.snack_id);
                    names[lanche.snack_id] = snack.Name;
                } catch (error) {
                    console.error(`Erro ao buscar nome do lanche ID ${lanche.snack_id}:`, error);
                    names[lanche.snack_id] = "Desconhecido";
                }
            }
        }
        setSnackNames(names);
    };

    const handleUpdateStatus = async (orderId, statusType, newValue) => {
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) throw new Error("Pedido não encontrado.");

            const updatedOrder = {
                id: orderId,
                customer_id: order.customer_id,
                paid: statusType === "paid" ? newValue : order.paid,
                delivered: statusType === "delivered" ? newValue : order.delivered,
            };

            const result = await UpdateOrder(BACK_END_HOST, updatedOrder);

            setOrders((prevOrders) =>
                prevOrders.map((o) =>
                    o.id === orderId ? { ...o, paid: result.paid, delivered: result.delivered } : o
                )
            );

            alert("Pedido atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            alert("Erro ao atualizar pedido. Tente novamente.");
        }
    };

    return (
        <Box sx={{ maxWidth: 900, margin: "auto" }}>
            <Paper sx={{ boxShadow: "none", padding: 2 }}>
                <Typography variant="h5" gutterBottom>Lista de Pedidos</Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Cliente</strong></TableCell>
                                    <TableCell><strong>Pago</strong></TableCell>
                                    <TableCell><strong>Entregue</strong></TableCell>
                                    <TableCell><strong>Ação</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} hover>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customer?.Name || "Desconhecido"}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={order.paid}
                                                onChange={(e) => handleUpdateStatus(order.id, "paid", e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={order.delivered}
                                                onChange={(e) => handleUpdateStatus(order.id, "delivered", e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleSelectOrder(order)}
                                            >
                                                Ver detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {selectedOrder && (
                    <Box sx={{ mt: 4, maxHeight: 400, overflowY: "auto", paddingRight: 2 }}>
                        <Typography variant="h6">Detalhes do Pedido</Typography>
                        <Typography><strong>Cliente:</strong> {selectedOrder.customer?.Name || "Desconhecido"}</Typography>
                        <Typography><strong>Endereço:</strong> {selectedOrder.customer?.Address || "Não informado"}</Typography>
                        <Typography>
                            <strong>WhatsApp:</strong>{" "}
                            <a href={`https://wa.me/${selectedOrder.customer?.Number}`} target="_blank" rel="noopener noreferrer">
                                {selectedOrder.customer?.Number || "Não informado"}
                            </a>
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 3 }}>Lanches</Typography>
                        {selectedOrder.lanches && selectedOrder.lanches.length > 0 ? (
                            selectedOrder.lanches.map((lanche, index) => (
                                <Card key={index} variant="outlined" sx={{ mt: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {snackNames[lanche.snack_id] || "Carregando..."}
                                        </Typography>
                                        <Typography><strong>Quantidade:</strong> {lanche.quantidade}</Typography>

                                        {lanche.adicionar_ingredientes?.length > 0 && (
                                            <>
                                                <Typography variant="subtitle2">Adicionados:</Typography>
                                                <ul>
                                                    {lanche.adicionar_ingredientes.map((ing) => (
                                                        <li key={ing.ID}>{ing.Name} (+R$ {ing.Price?.toFixed(2) || "0.00"})</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        {lanche.remover_ingredientes?.length > 0 && (
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
                            ))
                        ) : (
                            <Typography sx={{ mt: 2 }}>Nenhum lanche encontrado para este pedido.</Typography>
                        )}

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setSelectedOrder(null)}
                            sx={{ mt: 3 }}
                        >
                            Fechar detalhes
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
