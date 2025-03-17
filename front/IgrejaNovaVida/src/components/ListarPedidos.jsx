import { useState, useEffect } from "react";
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, FormControlLabel, CircularProgress
} from "@mui/material";
import { BACK_END_HOST } from "../App";
import { GetAllOrders, UpdateOrder } from "../services/order";
import VerPedido from "./VerPedido";

export default function ListarPedidos() {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await GetAllOrders(BACK_END_HOST);
            console.log(data)
            setOrders(data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            alert("Erro ao buscar pedidos. Tente novamente.");
        }
        setLoading(false);
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleUpdateStatus = async (orderId, statusType, newValue) => {
        try {
            const updatedOrder = {
                id: orderId,
                paid: statusType === "paid" ? newValue : orders.find(o => o.id === orderId)?.paid,
                delivered: statusType === "delivered" ? newValue : orders.find(o => o.id === orderId)?.delivered,
            };

            const result = await UpdateOrder(BACK_END_HOST, updatedOrder);

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, paid: result.paid, delivered: result.delivered } : order
                )
            );

            alert("Pedido atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            alert("Erro ao atualizar pedido. Tente novamente.");
        }
    };

    return (
        <Box sx={{ maxWidth: "900", margin: "auto"}}>
            <Paper sx={{boxShadow: "none"}}>
                <Typography variant="h5" gutterBottom>Lista de Pedidos</Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table sx={{border: "1px solid black"}} stickyHeader>
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
                                    <TableRow key={order.id} hover onClick={() => handleSelectOrder(order)} sx={{ cursor: "pointer" }}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customer?.Name || "Desconhecido"}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={order.paid}
                                                onChange={(e) => handleUpdateStatus(order.id, "paid", e.target.checked)}
                                                onClick={(e) => e.stopPropagation()} // Evita selecionar o pedido ao clicar na checkbox
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={order.delivered}
                                                onChange={(e) => handleUpdateStatus(order.id, "delivered", e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="contained" size="small" onClick={(e) => { e.stopPropagation(); handleSelectOrder(order); }}>
                                                Ver detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {selectedOrder && <VerPedido orderData={selectedOrder} />}
        </Box>
    );
}
