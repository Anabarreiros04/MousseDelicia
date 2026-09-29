const products = [
    {
        id: 3,
        name: "Mousse de Chocolate",
        cat: "doce",
        desc: "Chocolate intenso com textura super cremosa.",
        price: 10.00,
        img: "assets/cc.png"
    },
    {
        id: 4,
        name: "Mousse de Maracujá",
        cat: "doce",
        desc: "Intenso, cremoso e delicioso.",
        price: 8.00,
        img: "assets/r.png"
    },
    {
        id: 5,
        name: "Mousse de Morango",
        cat: "doce",
        desc: "Uma experiência deliciosa.",
        price: 8.00,
        img: "assets/m.png"
    },
    {
        id: 9,
        name: "Água",
        cat: "bebidas",
        desc: "Água mineral.",
        price: 3.00,
        img: "assets/agu.jpeg"
    },
    {
        id: 12,
        name: "Combo Mara",
        cat: "combo",
        desc: "Mousse de Maracujá em doze dupla.",
        price:  12.90,
        img: "assets/cr.png"
    },
    {
        id: 13,
        name: "Quarteto Doce",
        cat: "combo",
        desc: "Mousse de Chocolate + Mousse de Maracujá + Mousse de Morango + Mousse de Limão.",
        price: 34.90,
        img: "assets/cd.png"
    },
    
    {
     id: 5,
        name: "Mousse de Limão",
        cat: "doce",
        desc: "O equilibrio perfeito.",
        price: 10.00,
        img: "assets/li.png"
    },
     {
        id: 13,
        name: "Combo Rango",
        cat: "combo",
        desc: "Mousse Morango em doze dupla",
        price: 12.90,
        img: "assets/cm.png"
    },
    {
        id: 13,
        name: "Combo Azedinho",
        cat: "combo",
        desc: "Mousse de Limão em doze dupla",
        price: 17.90,
        img: "assets/cli.png"
    },
     {
        id: 13,
        name: "Combo Choco",
        cat: "combo",
        desc: "Mousse de Chocolate em doze dupla",
        price: 17.90,
        img: "assets/cc.png"
    },
];


// ========================================
// CARRINHO
// ========================================

let cart = JSON.parse(
    localStorage.getItem("mousseCart") || "[]"
);


// ========================================
// AVALIAÇÕES DOS CLIENTES
//
// IMPORTANTE:
// As avaliações feitas na página avaliacao.html
// ficam salvas somente durante a sessão do navegador.
//
// Assim elas aparecem na página principal,
// mas desaparecem quando a aba/janela principal
// é fechada.
// ========================================

let customerReviews = [];


// ========================================
// FORMATAÇÃO DE DINHEIRO
// ========================================

function money(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ========================================
// SALVAR CARRINHO
// ========================================

function save() {

    localStorage.setItem(
        "mousseCart",
        JSON.stringify(cart)
    );

    renderCart();

    document
        .querySelectorAll("[data-cart-count]")
        .forEach(element => {

            element.textContent = cart.reduce(
                (total, item) => total + item.qty,
                0
            );

        });
}


// ========================================
// ADICIONAR PRODUTO
// ========================================

function add(id) {

    const product = products.find(
        item => item.id === id
    );

    if (!product) return;

    const item = cart.find(
        item => item.id === id
    );

    if (item) {

        item.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }

    save();

    toast("Adicionado ao pedido 💜");
}


// ========================================
// ALTERAR QUANTIDADE
// ========================================

function change(id, difference) {

    const item = cart.find(
        item => item.id === id
    );

    if (!item) return;

    item.qty += difference;

    if (item.qty <= 0) {

        cart = cart.filter(
            item => item.id !== id
        );

    }

    save();
}


// ========================================
// MENSAGEM
// ========================================

function toast(message) {

    const element =
        document.querySelector(".toast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    setTimeout(() => {

        element.classList.remove("show");

    }, 2200);
}


// ========================================
// MOSTRAR PRODUTOS
// ========================================

function renderProducts(filter = "todos") {

    const box =
        document.querySelector("#product-grid");

    if (!box) return;

    const list =
        filter === "todos"
            ? products
            : products.filter(
                product => product.cat === filter
            );

    box.innerHTML = list.map(product => `

        <article class="card">

            <img
                class="card-img"
                src="${product.img}"
                alt="${product.name}"
            >

            <div class="card-body">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.desc}
                </p>

                <div class="price-row">

                    <span class="price">
                        ${money(product.price)}
                    </span>

                    <button
                        class="mini-btn"
                        onclick="add(${product.id})"
                    >
                        + Adicionar
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}


// ========================================
// MOSTRAR CARRINHO
// ========================================

function renderCart() {

    const box =
        document.querySelector("#cart-list");

    const total =
        document.querySelector("#cart-total");

    if (!box || !total) return;

    if (!cart.length) {

        box.innerHTML = `
            <p style="color:var(--muted)">
                Seu pedido está vazio.
                Escolha uma delícia no cardápio. 🤍
            </p>
        `;

        total.textContent = money(0);

        return;
    }

    box.innerHTML = cart.map(item => `

        <div class="order-item">

            <div>

                <b>
                    ${item.name}
                </b>

                <br>

                <small>
                    ${money(item.price)} cada
                </small>

            </div>

            <div class="qty">

                <button
                    onclick="change(${item.id}, -1)"
                >
                    −
                </button>

                <b>
                    ${item.qty}
                </b>

                <button
                    onclick="change(${item.id}, 1)"
                >
                    +
                </button>

            </div>

        </div>

    `).join("");

    const cartTotal =
        cart.reduce(
            (total, item) =>
                total + item.price * item.qty,
            0
        );

    total.textContent =
        money(cartTotal);
}


// ========================================
// AVALIAÇÕES
// ========================================

function renderReviews() {

    const box =
        document.querySelector("#reviews");

    if (!box) return;


    // ====================================
    // AVALIAÇÕES FIXAS
    // ====================================

    const defaults = [

        {
            name: "Mariana",
            stars: 5,
            text: "O mousse de maracujá é maravilhoso! Muito cremoso.",
            img: "assets/avama.jfif"
        },

        {
            name: "Lucas",
            stars: 5,
            text: "Pedi o combo e chegou tudo bem embalado. Amei!",
            img: "assets/ava.png"
        },

        {
            name: "Beatriz",
            stars: 5,
            text: "Fiquei com medo de ser muito azedo mais não, e a sensação perfeita da cremosidade e refrescância com o equilíbrio perfeito entre o azedo e o doce.",
            img: "assets/avali.jfif"
        }

    ];


    // ====================================
    // JUNTAR:
    // AVALIAÇÕES DO CLIENTE + FIXAS
    // ====================================

    const allReviews = [
        ...customerReviews,
        ...defaults
    ];


    // ====================================
    // MOSTRAR TODAS
    // ====================================

    box.innerHTML = allReviews.map(review => {

        const stars = Math.min(
            5,
            Math.max(
                1,
                Number(review.stars) || 5
            )
        );

        return `

            <article class="review">

                <div class="stars">
                    ${"★".repeat(stars)}
                    ${"☆".repeat(5 - stars)}
                </div>

                <h3>
                    ${review.name}
                </h3>

                <p>
                    ${review.text}
                </p>

                ${
                    review.img
                    ? `
                        <img
                            src="${review.img}"
                            alt="Foto da avaliação de ${review.name}"
                        >
                    `
                    : ""
                }

                <small>
                    Avaliação verificada
                </small>

            </article>

        `;

    }).join("");
}


// ========================================
// CONFIGURAÇÃO DO SITE
// ========================================

function setup() {

    renderProducts();

    save();

    renderReviews();


    // ====================================
    // CATEGORIAS DO CARDÁPIO
    // ====================================

    document
        .querySelectorAll(".tab")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".tab")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });

                    button.classList.add("active");

                    renderProducts(
                        button.dataset.cat
                    );

                }
            );

        });


    // ====================================
    // BOTÕES DE ROLAGEM
    // ====================================

    document
        .querySelectorAll("[data-scroll]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    document
                        .querySelector(
                            button.dataset.scroll
                        )
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });


    // ====================================
    // FORMULÁRIO DE ENCOMENDA
    // ====================================

    document
        .querySelector("#order-form")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                if (!cart.length) {

                    toast(
                        "Adicione pelo menos um item 💜"
                    );

                    return;
                }

                toast(
                    "Pedido recebido! Entraremos em contato para confirmar. ✨"
                );

                cart = [];

                save();

                event.target.reset();

            }
        );


    // ====================================
    // FORMULÁRIO DE AVALIAÇÃO
    // ====================================

    document
        .querySelector("#review-form")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const file =
                    document
                        .querySelector("#photo")
                        ?.files?.[0];


                // ====================================
                // PUBLICAR A AVALIAÇÃO
                // ====================================

                const publish = (image = "") => {

                    const review = {

                        name:
                            event.target.name.value,

                        text:
                            event.target.text.value,

                        stars:
                            event.target.stars.value,

                        img:
                            image

                    };


                    // ====================================
                    // IMPORTANTE:
                    // NÃO USA LOCALSTORAGE
                    //
                    // A avaliação fica somente
                    // enquanto esta página estiver aberta.
                    // ====================================

                    customerReviews.unshift(
                        review
                    );


                    toast(
                        "Avaliação enviada! Obrigada 💜"
                    );


                    event.target.reset();


                    // Nome da foto

                    const photoName =
                        document.querySelector(
                            "#photo-name"
                        );

                    if (photoName) {

                        photoName.textContent =
                            "JPG, PNG ou WEBP";

                    }


                    // Remover prévia

                    const preview =
                        document.querySelector(
                            "#photo-preview"
                        );

                    if (preview) {

                        preview.remove();

                    }


                    // Atualizar avaliações

                    renderReviews();

                };


                // ====================================
                // SE TIVER FOTO
                // ====================================

                if (file) {

                    const reader =
                        new FileReader();


                    reader.onload =
                        () => {

                            publish(
                                reader.result
                            );

                        };


                    reader.readAsDataURL(file);

                } else {

                    publish();

                }

            }
        );


    // ========================================
    // PRÉ-VISUALIZAÇÃO DA FOTO
    // ========================================

    document
        .querySelector("#photo")
        ?.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                const photoName =
                    document.querySelector(
                        "#photo-name"
                    );


                if (photoName) {

                    photoName.textContent =
                        file
                            ? `Foto selecionada: ${file.name}`
                            : "JPG, PNG ou WEBP";

                }


                const oldPreview =
                    document.querySelector(
                        "#photo-preview"
                    );


                if (oldPreview) {

                    oldPreview.remove();

                }


                if (file) {

                    const image =
                        document.createElement("img");


                    image.id =
                        "photo-preview";


                    image.className =
                        "photo-preview";


                    image.alt =
                        "Prévia da foto";


                    image.src =
                        URL.createObjectURL(file);


                    document
                        .querySelector("#photo")
                        .insertAdjacentElement(
                            "afterend",
                            image
                        );

                }

            }
        );

}


// ========================================
// INICIAR SITE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    setup
);