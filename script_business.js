// ======================================================
// INITIAL DATA
// ======================================================

const defaultProducts = [

    {
        id: 1,
        name: "Laptop",
        category: "Electronics",
        price: 55000,
        stock: 12
    },

    {
        id: 2,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 3000,
        stock: 4
    },

    {
        id: 3,
        name: "T-Shirt",
        category: "Clothing",
        price: 800,
        stock: 25
    },

    {
        id: 4,
        name: "Jeans",
        category: "Clothing",
        price: 1800,
        stock: 8
    },

    {
        id: 5,
        name: "Coffee",
        category: "Food",
        price: 450,
        stock: 3
    },

    {
        id: 6,
        name: "Watch",
        category: "Accessories",
        price: 2500,
        stock: 7
    }

];


const defaultCustomers = [

    {
        id: 1,
        name: "Rahul Shah",
        email: "rahul@example.com",
        phone: "9876543210"
    },

    {
        id: 2,
        name: "Priya Patel",
        email: "priya@example.com",
        phone: "9876501234"
    },

    {
        id: 3,
        name: "Amit Mehta",
        email: "amit@example.com",
        phone: "9988776655"
    }

];


const defaultOrders = [

    {
        id: 1001,
        customerId: 1,
        productId: 1,
        quantity: 1,
        total: 55000,
        date: "2026-09-03",
        status: "Delivered"
    },

    {
        id: 1002,
        customerId: 2,
        productId: 3,
        quantity: 3,
        total: 2400,
        date: "2026-09-08",
        status: "Shipped"
    },

    {
        id: 1003,
        customerId: 3,
        productId: 2,
        quantity: 2,
        total: 6000,
        date: "2026-09-14",
        status: "Processing"
    }

];


// ======================================================
// LOAD DATA
// ======================================================

let products =
    JSON.parse(
        localStorage.getItem("products")
    ) || defaultProducts;


let customers =
    JSON.parse(
        localStorage.getItem("customers")
    ) || defaultCustomers;


let orders =
    JSON.parse(
        localStorage.getItem("orders")
    ) || defaultOrders;


// Editing states

let editingProductId = null;

let editingCustomerId = null;


// ======================================================
// INITIALIZE
// ======================================================

saveAll();

populateOrderForm();

renderDashboard();

renderProducts();

renderOrders();

renderCustomers();


// ======================================================
// NAVIGATION
// ======================================================

const navButtons =
    document.querySelectorAll(".nav-btn");


navButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const pageId =
                button.dataset.page;


            document
                .querySelectorAll(".page")
                .forEach(function(page) {

                    page.classList.remove("active");

                });


            document
                .getElementById(pageId)
                .classList.add("active");


            navButtons.forEach(function(btn) {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            updatePageTitle(pageId);

        }
    );

});


// ======================================================
// PAGE TITLE
// ======================================================

function updatePageTitle(pageId) {

    const titles = {

        dashboardPage:
            "Dashboard",

        productsPage:
            "Products",

        ordersPage:
            "Orders",

        customersPage:
            "Customers"

    };


    document.getElementById("pageTitle")
        .innerText =
        titles[pageId];

}


// ======================================================
// SAVE ALL DATA
// ======================================================

function saveAll() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}


// ======================================================
// FORMAT MONEY
// ======================================================

function money(value) {

    return Number(value)
        .toLocaleString("en-IN");

}


// ======================================================
// GET CUSTOMER
// ======================================================

function getCustomer(customerId) {

    return customers.find(
        function(customer) {

            return customer.id === customerId;

        }
    );

}


// ======================================================
// GET PRODUCT
// ======================================================

function getProduct(productId) {

    return products.find(
        function(product) {

            return product.id === productId;

        }
    );

}


// ======================================================
// DASHBOARD
// ======================================================

function renderDashboard() {

    let revenue = 0;

    let validOrders = 0;

    let lowStock = 0;


    orders.forEach(function(order) {

        if (order.status !== "Cancelled") {

            revenue += order.total;

            validOrders++;

        }

    });


    products.forEach(function(product) {

        if (product.stock <= 5) {

            lowStock++;

        }

    });


    document.getElementById(
        "dashboardRevenue"
    ).innerText =
        "₹" + money(revenue);


    document.getElementById(
        "dashboardOrders"
    ).innerText =
        validOrders;


    document.getElementById(
        "dashboardProducts"
    ).innerText =
        products.length;


    document.getElementById(
        "dashboardLowStock"
    ).innerText =
        lowStock;


    renderSalesChart();

    renderTopProducts();

    renderLowStock();

}


// ======================================================
// SALES CHART
// ======================================================

function renderSalesChart() {

    const chart =
        document.getElementById(
            "salesChart"
        );


    chart.innerHTML = "";


    const months = [];


    const now = new Date();


    for (let i = 5; i >= 0; i--) {

        const date = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
        );


        months.push({

            month:
                date.toLocaleString(
                    "en-US",
                    { month: "short" }
                ),

            year:
                date.getFullYear(),

            monthNumber:
                date.getMonth()

        });

    }


    const monthlySales = [];


    months.forEach(function(month) {

        let amount = 0;


        orders.forEach(function(order) {

            if (
                order.status === "Cancelled"
            ) {

                return;

            }


            const orderDate =
                new Date(order.date);


            if (
                orderDate.getMonth()
                === month.monthNumber
                &&
                orderDate.getFullYear()
                === month.year
            ) {

                amount += order.total;

            }

        });


        monthlySales.push(amount);

    });


    const maxSales =
        Math.max(...monthlySales, 1);


    months.forEach(function(
        month,
        index
    ) {

        const value =
            monthlySales[index];


        const height =
            (value / maxSales) * 85;


        const container =
            document.createElement("div");


        container.className =
            "bar-container";


        container.innerHTML = `

            <div
                class="bar"
                style="height:${Math.max(
                    height,
                    5
                )}%"
            >

                <span class="bar-value">
                    ₹${money(value)}
                </span>

            </div>

            <span class="bar-label">
                ${month.month}
            </span>

        `;


        chart.appendChild(container);

    });

}


// ======================================================
// TOP PRODUCTS
// ======================================================

function renderTopProducts() {

    const container =
        document.getElementById(
            "topProducts"
        );


    container.innerHTML = "";


    const productRevenue = {};


    orders.forEach(function(order) {

        if (
            order.status === "Cancelled"
        ) {

            return;

        }


        if (
            !productRevenue[order.productId]
        ) {

            productRevenue[order.productId] =
                0;

        }


        productRevenue[order.productId] +=
            order.total;

    });


    const ranking =
        Object.entries(productRevenue)
            .map(function(entry) {

                const productId =
                    Number(entry[0]);

                const revenue =
                    entry[1];

                const product =
                    getProduct(productId);


                return {

                    name:
                        product
                            ? product.name
                            : "Unknown",

                    revenue:
                        revenue

                };

            })
            .sort(function(a, b) {

                return b.revenue - a.revenue;

            })
            .slice(0, 5);


    if (ranking.length === 0) {

        container.innerHTML =
            "<p>No sales available.</p>";

        return;

    }


    ranking.forEach(function(item) {

        const div =
            document.createElement("div");


        div.className =
            "top-product";


        div.innerHTML = `

            <span class="top-product-name">
                ${item.name}
            </span>

            <span class="top-product-value">
                ₹${money(item.revenue)}
            </span>

        `;


        container.appendChild(div);

    });

}


// ======================================================
// LOW STOCK
// ======================================================

function renderLowStock() {

    const table =
        document.getElementById(
            "lowStockTable"
        );


    table.innerHTML = "";


    const lowStockProducts =
        products.filter(
            function(product) {

                return product.stock <= 5;

            }
        );


    if (
        lowStockProducts.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    No low-stock products.
                </td>
            </tr>
        `;

        return;

    }


    lowStockProducts.forEach(
        function(product) {

            let status;

            if (product.stock === 0) {

                status =
                    "❌ Out of Stock";

            }
            else {

                status =
                    "⚠️ Low Stock";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td>${product.stock}</td>

                <td>${status}</td>

            `;


            table.appendChild(row);

        }
    );

}


// ======================================================
// PRODUCTS
// ======================================================

function saveProduct() {

    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );


    if (
        name === "" ||
        price <= 0 ||
        stock < 0
    ) {

        alert(
            "Please enter valid product details."
        );

        return;

    }


    if (
        editingProductId !== null
    ) {

        products =
            products.map(
                function(product) {

                    if (
                        product.id
                        === editingProductId
                    ) {

                        return {

                            id: product.id,

                            name: name,

                            category: category,

                            price: price,

                            stock: stock

                        };

                    }


                    return product;

                }
            );


        editingProductId =
            null;


        document.getElementById(
            "productFormTitle"
        ).innerText =
            "Add Product";


        document.getElementById(
            "productButtonText"
        ).innerText =
            "Add Product";


        document.getElementById(
            "cancelProductButton"
        ).style.display =
            "none";

    }

    else {

        const newProduct = {

            id: Date.now(),

            name: name,

            category: category,

            price: price,

            stock: stock

        };


        products.push(
            newProduct
        );

    }


    clearProductForm();

    saveAll();

    renderProducts();

    populateOrderForm();

    renderDashboard();

}


// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts() {

    const table =
        document.getElementById(
            "productsTable"
        );


    table.innerHTML = "";


    const search =
        document.getElementById(
            "productSearch"
        ).value
         .toLowerCase();


    const category =
        document.getElementById(
            "productFilter"
        ).value;


    const filtered =
        products.filter(
            function(product) {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "All"
                    ||
                    product.category
                        === category;


                return (
                    matchesSearch
                    &&
                    matchesCategory
                );

            }
        );


    filtered.forEach(
        function(product) {

            const value =
                product.price *
                product.stock;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${product.name}
                    </strong>
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ₹${money(product.price)}
                </td>

                <td>
                    ${product.stock}
                </td>

                <td>
                    ₹${money(value)}
                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick="editProduct(
                            ${product.id}
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteProduct(
                            ${product.id}
                        )"
                    >
                        🗑️
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ======================================================
// EDIT PRODUCT
// ======================================================

function editProduct(id) {

    const product =
        getProduct(id);


    if (!product) {

        return;

    }


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productStock"
    ).value =
        product.stock;


    editingProductId =
        id;


    document.getElementById(
        "productFormTitle"
    ).innerText =
        "Edit Product";


    document.getElementById(
        "productButtonText"
    ).innerText =
        "Update Product";


    document.getElementById(
        "cancelProductButton"
    ).style.display =
        "inline-block";

}


// ======================================================
// DELETE PRODUCT
// ======================================================

function deleteProduct(id) {

    const hasOrders =
        orders.some(
            function(order) {

                return order.productId === id;

            }
        );


    if (hasOrders) {

        alert(
            "This product has existing orders. Edit its stock instead of deleting it."
        );

        return;

    }


    const confirmed =
        confirm(
            "Delete this product?"
        );


    if (!confirmed) {

        return;

    }


    products =
        products.filter(
            function(product) {

                return product.id !== id;

            }
        );


    saveAll();

    renderProducts();

    populateOrderForm();

    renderDashboard();

}


// ======================================================
// CANCEL PRODUCT EDIT
// ======================================================

function cancelProductEdit() {

    editingProductId =
        null;


    clearProductForm();


    document.getElementById(
        "productFormTitle"
    ).innerText =
        "Add Product";


    document.getElementById(
        "productButtonText"
    ).innerText =
        "Add Product";


    document.getElementById(
        "cancelProductButton"
    ).style.display =
        "none";

}


// ======================================================
// CLEAR PRODUCT FORM
// ======================================================

function clearProductForm() {

    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productStock"
    ).value = "";

}


// ======================================================
// CUSTOMERS
// ======================================================

function saveCustomer() {

    const name =
        document.getElementById(
            "customerName"
        ).value.trim();


    const email =
        document.getElementById(
            "customerEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    if (
        name === "" ||
        email === "" ||
        phone === ""
    ) {

        alert(
            "Please complete all customer fields."
        );

        return;

    }


    if (
        editingCustomerId !== null
    ) {

        customers =
            customers.map(
                function(customer) {

                    if (
                        customer.id
                        === editingCustomerId
                    ) {

                        return {

                            id:
                                customer.id,

                            name:
                                name,

                            email:
                                email,

                            phone:
                                phone

                        };

                    }


                    return customer;

                }
            );


        editingCustomerId =
            null;


        document.getElementById(
            "customerFormTitle"
        ).innerText =
            "Add Customer";


        document.getElementById(
            "customerButtonText"
        ).innerText =
            "Add Customer";


        document.getElementById(
            "cancelCustomerButton"
        ).style.display =
            "none";

    }

    else {

        const customer = {

            id: Date.now(),

            name: name,

            email: email,

            phone: phone

        };


        customers.push(
            customer
        );

    }


    clearCustomerForm();

    saveAll();

    renderCustomers();

    populateOrderForm();

}


// ======================================================
// RENDER CUSTOMERS
// ======================================================

function renderCustomers() {

    const table =
        document.getElementById(
            "customersTable"
        );


    table.innerHTML = "";


    const search =
        document.getElementById(
            "customerSearch"
        ).value
         .toLowerCase();


    const filtered =
        customers.filter(
            function(customer) {

                return (
                    customer.name
                        .toLowerCase()
                        .includes(search)
                    ||
                    customer.email
                        .toLowerCase()
                        .includes(search)
                    ||
                    customer.phone
                        .includes(search)
                );

            }
        );


    filtered.forEach(
        function(customer) {

            const customerOrders =
                orders.filter(
                    function(order) {

                        return (
                            order.customerId
                            === customer.id
                            &&
                            order.status
                            !== "Cancelled"
                        );

                    }
                );


            const totalSpent =
                customerOrders.reduce(
                    function(total, order) {

                        return (
                            total +
                            order.total
                        );

                    },
                    0
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${customer.name}
                    </strong>
                </td>

                <td>
                    ${customer.email}
                </td>

                <td>
                    ${customer.phone}
                </td>

                <td>
                    ${customerOrders.length}
                </td>

                <td>
                    ₹${money(totalSpent)}
                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick="editCustomer(
                            ${customer.id}
                        )"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteCustomer(
                            ${customer.id}
                        )"
                    >
                        🗑️
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ======================================================
// EDIT CUSTOMER
// ======================================================

function editCustomer(id) {

    const customer =
        getCustomer(id);


    if (!customer) {

        return;

    }


    document.getElementById(
        "customerName"
    ).value =
        customer.name;


    document.getElementById(
        "customerEmail"
    ).value =
        customer.email;


    document.getElementById(
        "customerPhone"
    ).value =
        customer.phone;


    editingCustomerId =
        id;


    document.getElementById(
        "customerFormTitle"
    ).innerText =
        "Edit Customer";


    document.getElementById(
        "customerButtonText"
    ).innerText =
        "Update Customer";


    document.getElementById(
        "cancelCustomerButton"
    ).style.display =
        "inline-block";

}


// ======================================================
// DELETE CUSTOMER
// ======================================================

function deleteCustomer(id) {

    const hasOrders =
        orders.some(
            function(order) {

                return (
                    order.customerId === id
                );

            }
        );


    if (hasOrders) {

        alert(
            "This customer has existing orders and cannot be deleted."
        );

        return;

    }


    const confirmed =
        confirm(
            "Delete this customer?"
        );


    if (!confirmed) {

        return;

    }


    customers =
        customers.filter(
            function(customer) {

                return customer.id !== id;

            }
        );


    saveAll();

    renderCustomers();

    populateOrderForm();

}


// ======================================================
// CANCEL CUSTOMER EDIT
// ======================================================

function cancelCustomerEdit() {

    editingCustomerId =
        null;


    clearCustomerForm();


    document.getElementById(
        "customerFormTitle"
    ).innerText =
        "Add Customer";


    document.getElementById(
        "customerButtonText"
    ).innerText =
        "Add Customer";


    document.getElementById(
        "cancelCustomerButton"
    ).style.display =
        "none";

}


// ======================================================
// CLEAR CUSTOMER FORM
// ======================================================

function clearCustomerForm() {

    document.getElementById(
        "customerName"
    ).value = "";


    document.getElementById(
        "customerEmail"
    ).value = "";


    document.getElementById(
        "customerPhone"
    ).value = "";

}


// ======================================================
// ORDER FORM DROPDOWNS
// ======================================================

function populateOrderForm() {

    const customerSelect =
        document.getElementById(
            "orderCustomer"
        );


    const productSelect =
        document.getElementById(
            "orderProduct"
        );


    customerSelect.innerHTML = "";

    productSelect.innerHTML = "";


    customers.forEach(
        function(customer) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                customer.id;


            option.textContent =
                customer.name;


            customerSelect.appendChild(
                option
            );

        }
    );


    products.forEach(
        function(product) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                product.id;


            option.textContent =
                `${product.name}
                 - Stock: ${product.stock}`;


            productSelect.appendChild(
                option
            );

        }
    );

}


// ======================================================
// CREATE ORDER
// ======================================================

function createOrder() {

    const customerId =
        Number(
            document.getElementById(
                "orderCustomer"
            ).value
        );


    const productId =
        Number(
            document.getElementById(
                "orderProduct"
            ).value
        );


    const quantity =
        Number(
            document.getElementById(
                "orderQuantity"
            ).value
        );


    const status =
        document.getElementById(
            "orderStatus"
        ).value;


    const product =
        getProduct(productId);


    if (!product) {

        alert(
            "Please select a product."
        );

        return;

    }


    if (
        quantity <= 0
        ||
        quantity > product.stock
    ) {

        alert(
            `Available stock: ${product.stock}`
        );

        return;

    }


    // Reduce stock

    product.stock -= quantity;


    // Calculate total

    const total =
        product.price *
        quantity;


    // Create order

    const newOrder = {

        id:
            Date.now(),

        customerId:
            customerId,

        productId:
            productId,

        quantity:
            quantity,

        total:
            total,

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        status:
            status

    };


    orders.push(
        newOrder
    );


    document.getElementById(
        "orderQuantity"
    ).value = "";


    saveAll();

    populateOrderForm();

    renderOrders();

    renderProducts();

    renderCustomers();

    renderDashboard();

}


// ======================================================
// RENDER ORDERS
// ======================================================

function renderOrders() {

    const table =
        document.getElementById(
            "ordersTable"
        );


    table.innerHTML = "";


    const search =
        document.getElementById(
            "orderSearch"
        ).value
         .toLowerCase();


    const filterStatus =
        document.getElementById(
            "orderStatusFilter"
        ).value;


    const filtered =
        orders.filter(
            function(order) {

                const customer =
                    getCustomer(
                        order.customerId
                    );


                const product =
                    getProduct(
                        order.productId
                    );


                const customerName =
                    customer
                        ? customer.name
                        : "";


                const productName =
                    product
                        ? product.name
                        : "";


                const matchesSearch =
                    customerName
                        .toLowerCase()
                        .includes(search)
                    ||
                    productName
                        .toLowerCase()
                        .includes(search)
                    ||
                    String(order.id)
                        .includes(search);


                const matchesStatus =
                    filterStatus === "All"
                    ||
                    order.status
                        === filterStatus;


                return (
                    matchesSearch
                    &&
                    matchesStatus
                );

            }
        );


    filtered.forEach(
        function(order) {

            const customer =
                getCustomer(
                    order.customerId
                );


            const product =
                getProduct(
                    order.productId
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    #${order.id}
                </td>

                <td>
                    ${customer
                        ? customer.name
                        : "Unknown"}
                </td>

                <td>
                    ${product
                        ? product.name
                        : "Unknown"}
                </td>

                <td>
                    ${order.quantity}
                </td>

                <td>
                    ₹${money(order.total)}
                </td>

                <td>
                    ${order.date}
                </td>

                <td>

                    <select
                        class="status-select"
                        onchange="changeOrderStatus(
                            ${order.id},
                            this.value
                        )"
                    >

                        <option value="Processing"
                            ${order.status === "Processing"
                                ? "selected"
                                : ""}>
                            Processing
                        </option>

                        <option value="Shipped"
                            ${order.status === "Shipped"
                                ? "selected"
                                : ""}>
                            Shipped
                        </option>

                        <option value="Delivered"
                            ${order.status === "Delivered"
                                ? "selected"
                                : ""}>
                            Delivered
                        </option>

                        <option value="Cancelled"
                            ${order.status === "Cancelled"
                                ? "selected"
                                : ""}>
                            Cancelled
                        </option>

                    </select>

                </td>

                <td>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteOrder(
                            ${order.id}
                        )"
                    >
                        🗑️
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ======================================================
// CHANGE ORDER STATUS
// ======================================================

function changeOrderStatus(
    orderId,
    newStatus
) {

    const order =
        orders.find(
            function(order) {

                return order.id === orderId;

            }
        );


    if (!order) {

        return;

    }


    const oldStatus =
        order.status;


    const product =
        getProduct(
            order.productId
        );


    // Move to cancelled

    if (
        oldStatus !== "Cancelled"
        &&
        newStatus === "Cancelled"
    ) {

        if (product) {

            product.stock +=
                order.quantity;

        }

    }


    // Move from cancelled

    if (
        oldStatus === "Cancelled"
        &&
        newStatus !== "Cancelled"
    ) {

        if (!product) {

            alert(
                "Product no longer exists."
            );

            renderOrders();

            return;

        }


        if (
            product.stock
            < order.quantity
        ) {

            alert(
                "Not enough stock to reactivate this order."
            );

            renderOrders();

            return;

        }


        product.stock -=
            order.quantity;

    }


    order.status =
        newStatus;


    saveAll();

    renderOrders();

    renderProducts();

    renderCustomers();

    renderDashboard();

}


// ======================================================
// DELETE ORDER
// ======================================================

function deleteOrder(id) {

    const order =
        orders.find(
            function(order) {

                return order.id === id;

            }
        );


    if (!order) {

        return;

    }


    const confirmed =
        confirm(
            "Delete this order?"
        );


    if (!confirmed) {

        return;

    }


    // Return stock if order
    // was not cancelled

    if (
        order.status !== "Cancelled"
    ) {

        const product =
            getProduct(
                order.productId
            );


        if (product) {

            product.stock +=
                order.quantity;

        }

    }


    orders =
        orders.filter(
            function(order) {

                return order.id !== id;

            }
        );


    saveAll();

    renderOrders();

    renderProducts();

    renderCustomers();

    renderDashboard();

}


// ======================================================
// EXPORT ORDERS TO CSV
// ======================================================

function exportOrders() {

    if (orders.length === 0) {

        alert(
            "No orders to export."
        );

        return;

    }


    let csv =
        "Order ID,Customer,Product,Quantity,Total,Date,Status\n";


    orders.forEach(
        function(order) {

            const customer =
                getCustomer(
                    order.customerId
                );


            const product =
                getProduct(
                    order.productId
                );


            csv +=
                `${order.id},` +
                `"${customer
                    ? customer.name
                    : ""}",` +
                `"${product
                    ? product.name
                    : ""}",` +
                `${order.quantity},` +
                `${order.total},` +
                `${order.date},` +
                `${order.status}\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "orders.csv";


    link.click();


    URL.revokeObjectURL(
        url
    );

}