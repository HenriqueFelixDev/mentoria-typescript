// O código abaixo tem alguns erros e não funciona como deveria. Você pode identificar quais são e corrigi-los em um arquivo TS?

// ELEMENTS
let botaoAtualizar = document.getElementById('atualizar-saldo') as HTMLHeadingElement;
let botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement;
let soma = document.getElementById('soma') as HTMLInputElement;
let campoSaldo = document.getElementById('campo-saldo') as HTMLSpanElement;

// STATE
let saldo = 0

// FUNCTIONS
const atualizarSaldo = (value: number) => {
    saldo = value
    campoSaldo.textContent = saldo.toString()
    soma.value = ''
}

const limparSaldo = () => atualizarSaldo(0)
limparSaldo()

const somarAoSaldo = (soma: number) => atualizarSaldo(saldo + soma)

// EVENTS
botaoAtualizar.addEventListener('click', function () {
    const somaValue = Number(soma.value)

    if (!soma.value || isNaN(somaValue)) {
        alert('Número inválido')
        return
    }

    somarAoSaldo(somaValue);
});

botaoLimpar.addEventListener('click', limparSaldo);