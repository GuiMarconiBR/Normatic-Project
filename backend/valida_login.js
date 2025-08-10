//Escuta o evento de submit do formulário com id 'formLogin'
document.querySelector('.form_login').addEventListener('submit', async e => {
    e.preventDefault(); //Evita recarregar a página ao enviar o formulário

    //Pega o valor digitado nos inputs 'usuario' e 'senha' e tira espaços 
    const usuario = document.querySelector('.input_user').value.trim();
    const senha = document.querySelector('.input_password').value.trim();

    try {
        //Envia os dados para a API /login via método POST com corpo
        const response = await fetch('http://localhost:3000/login', {
            method:'post',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({usuario, senha})
        });

        const data = await response.json(); //pega a resposta JSON do backend

        if(response.ok) { //se login ok
            localStorage.setItem('token', data.token); //Salva o token JWT no localStorage
            window.location.href = '/screens/gestao.html'; // Redireciona para a página protegida
        } else {
            alert(data.message) //Mostra a mensagem de erro vinda do backend
        }
    } catch {
        alert('Erro ao conectar com o servidor'); // Caso não consiga conectar ao backend
    }

});