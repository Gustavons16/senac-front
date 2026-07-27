const formCadastro = document.getElementById('form-cadastro');

setupValidation(formCadastro);

async function cadastrarUsuario(event) {
    event.preventDefault();

    const payload = {
        name: document.getElementById('cadastro-nome').value.trim(),
        email: document.getElementById('cadastro-email').value.trim(),
        cellphone: document.getElementById('cadastro-telefone').value.trim(),
        datebirth: document.getElementById('cadastro-datanascimento').value.trim(),
        password: document.getElementById('cadastro-senha').value,
    };

    try {
        const usuario = await apiRequest('/usuarios', { method: 'POST', body: payload, auth: false });
        mostrarResultado(`Cadastro realizado: ${usuario.name}`);
        formCadastro.reset();
    } catch (erro) {
        mostrarResultado(`Falha no cadastro: ${erro.message}`, 'error');
    }
}

if (formCadastro) {
    formCadastro.addEventListener('submit', cadastrarUsuario);
}
