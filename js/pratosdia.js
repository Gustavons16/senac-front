var produtos = [];



async function carregarProdutos() {
    try {
        const hoje = new Date();
        
        const diaSemanaExtenso = hoje.toLocaleDateString('pt-BR', { weekday: 'long' });
        var diaSemana = document.getElementById('dia-semana');
        diaSemana.innerHTML=diaSemanaExtenso;

        const diaAbreviado = hoje.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','');
        const resposta = await apiRequest( `/products/dayproducts/${diaAbreviado}/store/1`);

        if (Array.isArray(resposta)) {
            produtos = resposta;
        } else {
            produtos = [];
        }

        renderizarProdutos();
    } catch (erro) {
    }
}
function renderizarProdutos() {
 const divProduto = document.getElementById('div-produtos');

    divProduto.innerHTML = '';
    if (!produtos.length) {
        divProduto.innerHTML = '<div class="empty-state"><p>Nenhum produto encontrado.</p></div>';
        return;
    }

    divProduto.innerHTML = criarHtmlProdutos();

}
function criarHtmlProdutos() {
    var produtosHtml = "" ;
    produtos.forEach((produto) => {
        produtosHtml += criarCardHtml(produto);
    });
    return produtosHtml;
} 

function criarCardHtml(produto) {
   
    const price = produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    return `
       <a class="quick-link-item" href="cadastro.html">
                <div class="img-centralizar">
                <img class="img-produtosdia" src="./img/exemplos/img1.jpg">
            </div>
            <span class="ql-title">${produto.name}</span>
            <span class="ql-desc">R$ ${price}</span>
        </a>
    `;
}

window.addEventListener('DOMContentLoaded', async () => {
    if (!getToken()) {
        window.location.href = 'login.html';
        return;
    }

    await carregarProdutos();
}); 
