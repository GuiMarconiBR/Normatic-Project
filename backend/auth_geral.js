//Função assíncrona autoexecutada que verifica se o usuário está autenticado

(async () => {
    const token = localStorage.getItem('token'); //pega o token salvo no navegador

    if(!token) {
        window.location.href ='../index.html'; // Se não tiver token redireciona para login
        return;
    }

    try {
        //Tenta acessar uma rota protegida no backend enviando o token no header Authorization
        const response = await fetch('http://localhost:3000/dados-protegidos', {
            headers: {Authorization: `bearer ${token}`}
        });

        if(!response.ok) { //Se o token inválido ou expirado
            localStorage.removeItem('token'); //remove o token do navegador
            window.location.href = '../index.html'; //Redireciona para a página de Login
            window.alert('Token inválido ou expirado')
        }
    } catch {
        //Se falhar a conexão, também redireciona para login
        window.location.href = '../index.html';
        window.alert('A conexão falhou!')
    }
})();