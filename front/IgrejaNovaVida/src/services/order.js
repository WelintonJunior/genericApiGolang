export async function GetOrderByCustomerName(BACK_END_HOST, customerName) {
    try {
        const response = await fetch(`${BACK_END_HOST}/order/getByCustomerName?name=${customerName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar o pedido");
        }

        const data = await response.json();
        return data
    }
    catch (error) {
        console.error("Erro ao buscar pedido:", error);
    }
}

export async function GetAllOrders(BACK_END_HOST) {
    try {
        const response = await fetch(`${BACK_END_HOST}/order/getAll`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar o pedido");
        }

        const data = await response.json();
        return data
    }
    catch (error) {
        console.error("Erro ao buscar pedido:", error);
    }
}

export async function CreateOrder(BACK_END_HOST, order) {
    try {
        const response = await fetch(`${BACK_END_HOST}/order/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error("Erro ao finalizar o pedido");
        }

        const data = await response.json();
        return data
    }
    catch (error) {
        console.error("Erro ao buscar pedido:", error);
    }
}

export async function UpdateOrder(BACK_END_HOST, updatedOrder) {
    try {
        const newUpdateOrder = {
            id: updatedOrder.id,
            paid: updatedOrder.paid,
            delivered: updatedOrder.delivered,
            customer_id: updatedOrder.customer_id
        };

        const response = await fetch(`${BACK_END_HOST}/order/update/${newUpdateOrder.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUpdateOrder),
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Erro ao atualizar pedido: ${responseText}`);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
    }
}
