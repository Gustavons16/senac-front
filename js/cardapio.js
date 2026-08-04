var produtos = [];



async function carregarCardapio() {
    try {
        const resposta = await apiRequest('/products/1');

        if (Array.isArray(resposta)) {
            produtos = resposta;
        } else {
            produtos = [];
        }

        renderizarCardapio();
    } catch (erro) {
    }
}

function renderizarCardapio() {
     const divProduto = document.getElementById('div-produtos');

    divProduto.innerHTML = '';
    if (!produtos.length) {
        divProduto.innerHTML = '<div class="empty-state"><p>Nenhum produto encontrado.</p></div>';
        return;
    }

    divProduto.innerHTML = criarCategoriaHtml();

    
}
function criarCategoriaHtml(){

   var categoriaHtml = "";
   const agrupado = Object.groupBy(produtos, produto => produto.category);

    Object.entries(agrupado).forEach(([categoria, listaDeProdutos]) => {
        categoriaHtml +=  criarProdutosCategoria(categoria,listaDeProdutos)
    })

  return categoriaHtml
}

function criarProdutosCategoria(categoria,listaDeProdutos)
{
    let produtoshtml = "";

    let produtosLinha = [];
    let count = 0;
    listaDeProdutos.forEach((produto) => {
        produtosLinha.push(produto);
        count++;
        if(produtosLinha.length == 2 || listaDeProdutos.length == count)
        {
            produtoshtml += criarLinhasProdutos(produtosLinha);
            produtosLinha = []
        }
    });

    return `<div class="produtos-categoria">
                    <div>
                        <h2>
                            ${categoria}
                        </h2>
                    </div>
                    <div class="row linha-produtos">
                    ${produtoshtml}
                    </div>
            </div>
                `;
}

function criarLinhasProdutos(produtosLinha){
    let produtoshtml = "";

     produtosLinha.forEach((produto) => {
        produtoshtml += criarCardHtml(produto);
    });
   
    return  `<div class="row linha-produtos">
                ${produtoshtml}
            </div>` 
}
function criarCardHtml(produto) {
    const price = produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    return `
        <div class="col-md-6">
            <a data-bs-toggle="modal" data-bs-target="#modal-detalhes-produto">
                <div class="item-produto">
                    <div class="row">
                        <div class="col-md-6 info">
                            <h4 class="title">${produto.name}</h4>
                            <p class="desc">${produto.description}</p>
                            <h4 class="price">R$ ${price}</h4>
                        </div>
                        <div class="col-md-6">
                            <div class="img-centralizar">
                                <img class="img-produtosdia" src="./img/exemplos/img1.jpg">
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', async () => {
    if (!getToken()) {
        window.location.href = 'login.html';
        return;
    }

    await carregarCardapio();
});
