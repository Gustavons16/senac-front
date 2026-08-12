const perfilInfo = document.getElementById('perfil-info');
const btnLogout = document.getElementById('btn-logout');
const jwtTokenArea = document.getElementById('jwt-token-value');

const perfilForm = document.getElementById('perfil-form');
const perfilAvatar = document.getElementById('perfil-avatar');
const perfilAvatarPreview = document.getElementById('perfil-avatar-preview');
const perfilFoto = document.getElementById('perfil-foto');

const perfilNome = document.getElementById('perfil-nome');
const perfilEmail = document.getElementById('perfil-email');
const perfilTelefone = document.getElementById('perfil-telefone');
const perfilSenha = document.getElementById('perfil-senha');

const IMAGEM_PADRAO = 'img/img-default.svg';
let perfilAtual = {};
let fotoSelecionada = null;

function atualizarAvatar(src) {
    const foto = src || IMAGEM_PADRAO;

    if (perfilAvatar) {
        perfilAvatar.src = foto;
    }

    if (perfilAvatarPreview) {
        perfilAvatarPreview.src = foto;
    }
}

function preencherFormulario(perfil) {
    if (perfilNome) perfilNome.value = perfil.name || '';
    if (perfilEmail) perfilEmail.value = perfil.email || '';
    if (perfilTelefone) perfilTelefone.value = perfil.cellphone || '';
    if (perfilSenha) perfilSenha.value = '';
}

function criarItemPerfil(label, valor) {
    return `
        <div class="col-12 col-md-6 col-xl-3">
            <div class="perfil-item h-100">
                <div class="pi-label">${label}</div>
                <div class="pi-value">${valor || '—'}</div>
            </div>
        </div>
    `;
}

function renderizarPerfil(perfil) {
    perfilAtual = { ...perfil };

    if (perfilInfo) {
        perfilInfo.innerHTML = `
            ${criarItemPerfil('ID', perfil.id)}
            ${criarItemPerfil('Nome', perfil.name)}
            ${criarItemPerfil('E-mail', perfil.email)}
            ${criarItemPerfil('Telefone', perfil.cellphone)}
        `;
    }

    preencherFormulario(perfilAtual);
    atualizarAvatar(perfil.foto || perfil.avatar || '');
}

async function carregarPerfil() {
    try {
        const perfil = await apiRequest('/usuarios/perfil');
        renderizarPerfil(perfil || {});
    } catch (erro) {
        mostrarResultado(`Falha ao carregar perfil: ${erro.message}`, 'error');
        logout();
    }
}

function onSelecionarFoto(event) {
    const arquivo = event.target.files && event.target.files[0];

    if (!arquivo) {
        fotoSelecionada = null;
        atualizarAvatar('');
        return;
    }

    fotoSelecionada = arquivo;
    atualizarAvatar(URL.createObjectURL(arquivo));
}

async function salvarPerfil(event) {
    event.preventDefault();

    const senha = (perfilSenha?.value || '').trim();
    const formData = new FormData();
    formData.append('name', (perfilNome?.value || '').trim());
    formData.append('email', (perfilEmail?.value || '').trim());
    formData.append('cellphone', (perfilTelefone?.value || '').trim());

    if (senha) formData.append('password', senha);
    if (fotoSelecionada) formData.append('foto', fotoSelecionada);

    try {
        await apiRequest('/usuarios/' + perfilAtual.id, {
            method: 'PUT',
            body: formData,
        });

        await carregarPerfil();
        fotoSelecionada = null;
        mostrarResultado('Perfil atualizado com sucesso.');

        const modal = document.getElementById('perfilModal');
        if (modal && window.bootstrap) {
            bootstrap.Modal.getOrCreateInstance(modal).hide();
        }
    } catch (erro) {
        mostrarResultado(`Falha ao atualizar perfil: ${erro.message}`, 'error');
    }
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => logout(true));
}

if (perfilFoto) {
    perfilFoto.addEventListener('change', onSelecionarFoto);
}

if (perfilForm) {
    perfilForm.addEventListener('submit', salvarPerfil);
}

window.addEventListener('DOMContentLoaded', async () => {
    if (!getToken()) {
        window.location.href = 'login.html';
        return;
    }

    if (jwtTokenArea) {
        jwtTokenArea.textContent = getToken() || 'Token não encontrado';
    }

    atualizarAvatar('');
    await carregarPerfil();
    await carregarPedidos();
});

var carrinhos = []
async function carregarPedidos() {
    try {


        const resposta = await apiRequest(`/cart/carrinhos`);

        if (Array.isArray(resposta)) {
            carrinhos = resposta;
        } else {
            carrinhos = [];
        }

        renderizarCarrinhos();
    } catch (erro) {
    }
}
function renderizarCarrinhos() {
    const tabelaCarrinhos = document.getElementById('lista-carrinhos-tabela');

    tabelaCarrinhos.innerHTML = '';
    if (!carrinhos.length) {
        tabelaCarrinhos.innerHTML = '<div class="empty-state"><p>Nenhum pedido encontrado.</p></div>';
        return;
    }

    tabelaCarrinhos.innerHTML = criarHtmlCarrinhos();

}
function criarHtmlCarrinhos() {
    var carrinhosHtml = "";
    carrinhos.forEach((carrinho) => {
        carrinhosHtml += criarCardCarrinhoHtml(carrinho);
    });
    return carrinhosHtml;
}

function criarCardCarrinhoHtml(carrinho) {
    var data = new Date(carrinho.date);
    var dataFormatada = data.toLocaleDateString('pt-BR');

    const total = carrinho.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    return `
        <tr>
            <td>${carrinho.id}</td> 
            <td>${dataFormatada}</td>
            <td>${getStatus(carrinho.status)}</td>
            <td>R$${total}</td>
            <td>${carrinho.produtos.length}</td>
            
        </tr>
    `;
}

function getStatus(status) {
    if (status == "novo") {
        return '<span class="badge text-bg-secondary">Novo</span>'
    }
    if (status == "Pedido Feito") {
        return '<span class="badge text-bg-primary">Pedido Feito</span>'

    }
    if (status == "Em preparação") {
        return '<span class="badge text-bg-info">Em Preparação</span'
    }
    if (status == "para entrega") {
        return '<span class="badge text-bg-warning">Para entrega</span>'

    }

    if (status == "Finalizado") {
        return '<span class="badge text-bg-success">Finalizado</span>'

    } 
    
    return status
}
