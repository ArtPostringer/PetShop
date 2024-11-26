function formatarTelefone(input) {
    let telefone = input.value.replace(/\D/g, ''); 

    if (telefone.length <= 2) {
        telefone = telefone.replace(/(\d{2})/, '($1)');
    } else if (telefone.length <= 7) {
        telefone = telefone.replace(/(\d{2})(\d{5})/, '($1) $2');
    } else {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    input.value = telefone.substring(0, 15); 
}

// ===================== Clientes ======================= \\ 

function listarClientes() {
    const lista = document.getElementById('listaClientes');
    if (!lista) {
        return;
    }

    fetch('http://localhost:3000/clientes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar clientes');
            }
            return response.json();
        })
        .then(clientes => {
            lista.innerHTML = ''; 

            if (clientes.length === 0) {
                lista.innerHTML = '<p>Nenhum cliente encontrado.</p>';
                return;
            }

            clientes.forEach(cliente => {
                const div = document.createElement('div');
                div.classList.add('cliente');
                div.innerHTML = `
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco}</p>
                    <button onclick="editarCliente(${cliente.id})">Editar</button>
                    <button onclick="excluirCliente(${cliente.id})">Excluir</button>
                `;
                lista.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Erro ao listar clientes:', error);
            lista.innerHTML = '<p>Erro ao carregar a lista de clientes.</p>';
        });
}


function excluirCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const url = `http://localhost:3000/clientes/${id}`;
        console.log('URL para exclusão:', url); 
        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao excluir cliente: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                listarClientes(); 
            })
            .catch(error => {
                console.error('Erro ao excluir cliente:', error);
                alert('Erro ao excluir cliente. Tente novamente.');
            });
    }
}

let clienteEditando = null;

function editarCliente(id) {
    fetch(`http://localhost:3000/clientes/${id}`)
        .then(response => response.json())
        .then(cliente => {
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('telefone').value = cliente.telefone;
            document.getElementById('endereco').value = cliente.endereco;

            clienteEditando = cliente.id;

            document.getElementById('clienteForm').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do cliente:', error);
            alert('Erro ao carregar os dados do cliente. Tente novamente.');
        });
}

const clienteForm = document.getElementById('clienteForm');
if (clienteForm) {
    clienteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        if (clienteEditando) {
            fetch(`http://localhost:3000/clientes/${clienteEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    telefone,
                    endereco,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert('Cliente atualizado com sucesso!');
                    clienteForm.reset();
                    clienteEditando = null;
                    listarClientes();
                })
                .catch(error => {
                    console.error('Erro ao atualizar cliente:', error);
                    alert('Erro ao atualizar cliente. Tente novamente.');
                });
        } else {
            fetch('http://localhost:3000/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    telefone,
                    endereco,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert('Cliente cadastrado com sucesso!');
                    clienteForm.reset(); 
                    listarClientes(); 
                })
                .catch(error => {
                    console.error('Erro ao cadastrar cliente:', error);
                    alert('Erro ao cadastrar cliente. Tente novamente.');
                });
        }
    });
}


// ===================== Animais ======================= \\ 

function carregarClientes() {
    fetch('http://localhost:3000/clientes') 
        .then((response) => response.json()) 
        .then((clientes) => {
            console.log(clientes); 
            const selectDono = document.getElementById('dono');
            if (selectDono) {
                selectDono.innerHTML = ''; 

                const optionDefault = document.createElement('option');
                optionDefault.value = ''; 
                optionDefault.textContent = 'Selecione o dono';
                selectDono.appendChild(optionDefault);

                clientes.forEach((cliente) => {
                    console.log('Adicionando cliente:', cliente); 
                    const option = document.createElement('option');
                    option.value = cliente.id;
                    option.textContent = cliente.nome;
                    selectDono.appendChild(option);
                });
            }
        })
        .catch((error) => console.error('Erro ao carregar os clientes:', error));
}

let animalEditando = null;

function editarAnimal(id) {
    console.log(`Editando animal com ID: ${id}`);
    fetch(`http://localhost:3000/animais/${id}`)
        .then(response => response.json())
        .then(animal => {
            document.getElementById('nome').value = animal.nome;
            document.getElementById('idade').value = animal.idade;
            document.getElementById('tipo').value = animal.tipo;
            document.getElementById('dono').value = animal.cliente_id;
            animalEditando = animal.id;

            document.getElementById('animalForm').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do animal:', error);
            alert('Erro ao carregar os dados do animal. Tente novamente.');
        });
}

const animalForm = document.getElementById('animalForm');
if (animalForm) {
    animalForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeAnimal = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const tipo = document.getElementById('tipo').value;
        const clienteId = document.getElementById('dono').value;

        if (animalEditando) {
            fetch(`http://localhost:3000/animais/${animalEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nomeAnimal,
                    idade,
                    tipo,
                    clienteId,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert('Animal atualizado com sucesso!');
                    animalForm.reset(); 
                    animalEditando = null;
                    listarAnimais(); 
                })
                .catch((error) => {
                    console.error('Erro ao atualizar animal:', error);
                    alert('Erro ao atualizar animal. Tente novamente.');
                });
        } else {
            fetch('http://localhost:3000/animais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nomeAnimal,
                    idade,
                    tipo,
                    clienteId,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert('Animal cadastrado com sucesso!');
                    animalForm.reset(); 
                    listarAnimais(); 
                })
                .catch((error) => {
                    console.error('Erro ao cadastrar animal:', error);
                });
        }
    });
}

function listarAnimais() {
    fetch('http://localhost:3000/animais')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar animais');
            }
            return response.json();
        })
        .then(animais => {
            const lista = document.getElementById('listaAnimais');
            lista.innerHTML = ''; 

            if (animais.length === 0) {
                lista.innerHTML = '<p>Nenhum animal encontrado.</p>';
                return;
            }

            animais.forEach(animal => {
                const div = document.createElement('div');
                div.classList.add('animal');
                div.innerHTML = `
                    <p><strong>Nome:</strong> ${animal.animal_nome}</p>
                    <p><strong>Tipo:</strong> ${animal.tipo}</p>
                    <p><strong>Idade:</strong> ${animal.idade} anos</p>
                    <p><strong>Dono:</strong> ${animal.dono_nome}</p>
                    <button onclick="editarAnimal(${animal.id})">Editar</button>
                    <button onclick="excluirAnimal(${animal.id})">Excluir</button>
                `;
                lista.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Erro ao listar animais:', error);
            document.getElementById('listaAnimais').innerHTML = '<p>Erro ao carregar a lista de animais.</p>';
        });
}

function excluirAnimal(id) {
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        const url = `http://localhost:3000/animais/${id}`;
        console.log('URL para exclusão:', url); 
        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao excluir animal: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                listarAnimais(); 
            })
            .catch(error => {
                console.error('Erro ao excluir animal:', error);
                alert('Erro ao excluir animal. Tente novamente.');
            });
    }
}

window.onload = function () {
    if (document.getElementById('listaClientes')) {
        listarClientes();
    }
    if (document.getElementById('listaAnimais')) {
        listarAnimais(); 
    }
    carregarClientes(); 
};