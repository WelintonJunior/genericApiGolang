import { useState, useEffect } from "react";
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, CircularProgress, Card, CardContent, TextField, InputAdornment
} from "@mui/material";
import { BACK_END_HOST } from "../App";
import { GetAllOrders, UpdateOrder, GetCount, DeleteOrder } from "../services/order";
import { GetSnackById } from "../services/snacks";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ListarPedidos() {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [snackNames, setSnackNames] = useState({});
    const [totalOrders, setTotalOrders] = useState(0);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order =>
            order.customer?.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await GetAllOrders(BACK_END_HOST);
            setOrders(data);
            setFilteredOrders(data);
            const total = await GetCount(BACK_END_HOST);
            setTotalOrders(total)
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            alert("Erro ao buscar pedidos. Tente novamente.");
        }
        setLoading(false);
    };

    const handleSelectOrder = async (order) => {
        setSelectedOrder(order);

        const names = { ...snackNames };

        let calculatedTotal = 0;

        for (const lanche of order.lanches) {
            if (!names[lanche.snack_id]) {
                try {
                    const snack = await GetSnackById(BACK_END_HOST, lanche.snack_id);
                    names[lanche.snack_id] = snack.Name;

                    if (snack) {
                        let lancheTotal = snack.Price * lanche.quantidade;

                        for (let ing of lanche.adicionar_ingredientes) {
                            lancheTotal += ing.Price * lanche.quantidade;
                        }

                        calculatedTotal += lancheTotal;
                    }
                } catch (error) {
                    console.error(`Erro ao buscar nome do lanche ID ${lanche.snack_id}:`, error);
                    names[lanche.snack_id] = "Desconhecido";
                }
            } else {
                const snack = await GetSnackById(BACK_END_HOST, lanche.snack_id);
                let lancheTotal = snack.Price * lanche.quantidade;

                for (let ing of lanche.adicionar_ingredientes) {
                    lancheTotal += ing.Price * lanche.quantidade;
                }

                calculatedTotal += lancheTotal;
            }
        }

        setTotal(calculatedTotal);
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

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;

        try {
            await DeleteOrder(BACK_END_HOST, orderId);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            setFilteredOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            alert("Pedido excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir pedido:", error);
            alert("Erro ao excluir pedido. Tente novamente.");
        }
    };

    return (
        <Box sx={{ maxWidth: 900, margin: "auto", p: 1 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5"><strong>Lista de Pedidos</strong></Typography>
                <Typography variant="h6">Total de lanches: {totalOrders}</Typography>
            </Box>

            <TextField
                label="Buscar pelo nome do cliente"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>#</strong></TableCell>
                                <TableCell><strong>Cliente</strong></TableCell>
                                <TableCell><strong>Pago</strong></TableCell>
                                <TableCell><strong>Entregue</strong></TableCell>
                                <TableCell><strong>Ação</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order, index) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>{index + 1}</TableCell> {/* Exibe a posição do pedido */}
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
                                            <Button variant="contained" size="small" onClick={() => handleSelectOrder(order)}>Ver detalhes</Button>
                                            <Button variant="contained" color="error" size="small" sx={{ ml: 1 }} onClick={() => handleDeleteOrder(order.id)}>
                                                <DeleteIcon />
                                            </Button>
                                        </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}

                {
                    selectedOrder && (
                        <Box sx={{ mt: 4, maxHeight: 300, overflowY: "auto", paddingRight: 2, borderRadius: 3, boxShadow: 4, p: 3 }}>
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
                                                            <Typography variant="subtitle2"><li key={ing.ID}>{ing.Name} (+R$ {ing.Price?.toFixed(2) || "0.00"})</li></Typography>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            {lanche.remover_ingredientes?.length > 0 && (
                                                <>
                                                    <Typography variant="subtitle2">Removidos:</Typography>
                                                    <ul>
                                                        {lanche.remover_ingredientes.map((ing) => (
                                                            <Typography variant="subtitle2"><li key={ing.ID}>{ing.Name}</li></Typography>
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

                            <Typography variant="h6">Total: R$ {total.toFixed(2)}</Typography>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setSelectedOrder(null)}
                                sx={{ mt: 3 }}
                            >
                                Fechar detalhes
                            </Button>
                        </Box>
                    )
                }
            </Paper >
        </Box >
    );
}
