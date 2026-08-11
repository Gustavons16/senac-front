var pedido = {};



async function carregarCarrinho() {
    try {
        const resposta = await apiRequest('/cart/produtos');
        pedido = resposta
        renderizarCarrinho(); 
        atualizarTotalCarrinho();
    } catch (erro) {
    }
}
function atualizarTotalCarrinho() {
    const total = pedido.carrinho.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
     $("#valor-total").text(`R$ ${total}`)
}
function renderizarCarrinho() {
    const divCarrinho = document.getElementById('produtos-carrinho');

    divCarrinho.innerHTML = '';
    if (!pedido && !pedido.produtos.length) {
        divCarrinho.innerHTML = '<div class="empty-state"><p>Carrinho vazio.</p></div>';
        return;
    }

    divCarrinho.innerHTML = criarHtmlCarrinho();


}
function criarHtmlCarrinho() {
    var produtosHtml = "" ; 
    pedido.produtos.forEach((produto) => {
        produtosHtml += criarItemCarrinhoHtml(produto);
    });
    return produtosHtml;
} 

function  criarItemCarrinhoHtml(produto) {
   
    const price = produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    return `
            <div class="row">
                <div class="col-md-3">
                    <img class="img-produto" src="./img/exemplos/img1.jpg">
                </div>
                <div class="col-md-5">
                    <h6>${produto.name}</h6>
                    <button data-productcartid="${produto.productcartid}" class='btn-remover-produto btn btn-sm'><i class="bi bi-trash-fill"></i></button>
                </div>
                <div class="col-md-4">
                    <h5>R$ ${price}</h5>
                </div>
            </div>
    `;
}


window.addEventListener('DOMContentLoaded', async () => {
    if (!getToken()) {
        window.location.href = 'login.html';
        return;
    }

    await carregarCarrinho();
});

$(function(){
    $("#btn-add-carrinho").on("click",async function(){
        var produtoid= $("#produtoid-modal").val()
        const resultado = await apiRequest(`/cart/produto/${produtoid}`,{ method: 'POST'});
        mostrarResultado(resultado.mensagem);
        await  carregarCarrinho();


    }) ;

     $('body').on('click',".btn-remover-produto",async function(){
        var productcartid= $(this).data("productcartid")
        const resultado = await apiRequest(`/cart/productcart/${productcartid}`,{ method: 'DELETE'});
        mostrarResultado(resultado.mensagem);
        await  carregarCarrinho();


    }) ;

    

     $('body').on('click', ".item-produto", async function (e) {

        var produtoid = $(this).data("produtoid")


        const produto = await apiRequest(`/products/produto/${produtoid}`);
            const price = produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

        $("#titulo-modal").text(produto.name)
        $("#desc-modal").text(produto.description)
        $("#price-modal").text(`R$ ${price}`)
        $("#desc2-modal").text(produto.ingredients)
        $("#produtoid-modal").val(produto.id)


    })
})