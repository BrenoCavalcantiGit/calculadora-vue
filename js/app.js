const { createApp, ref, computed } = Vue;

// Função simples com a regra de cada operação
function calcular(a, b, operacao) {
    switch (operacao) {
        case 'soma': return a + b;
        case 'subtracao': return a - b;
        case 'multiplicacao': return a * b;
        case 'divisao': return a / b;
    }
}

const app = createApp({
    setup() {
        const numero1 = ref('');
        const numero2 = ref('');
        const operacao = ref('soma');

        // Lista usada no select (renderizada com v-for)
        const operacoes = [
            { valor: 'soma', simbolo: '+', nome: 'Soma' },
            { valor: 'subtracao', simbolo: '−', nome: 'Subtração' },
            { valor: 'multiplicacao', simbolo: '×', nome: 'Multiplicação' },
            { valor: 'divisao', simbolo: '÷', nome: 'Divisão' }
        ];

        // Só calcula quando os dois campos têm números válidos
        const camposValidos = computed(function () {
            return typeof numero1.value === 'number' && typeof numero2.value === 'number';
        });

        const erro = computed(function () {
            if (camposValidos.value && operacao.value === 'divisao' && numero2.value === 0) {
                return 'Não é possível dividir por zero.';
            }
            return null;
        });

        // Recalculado automaticamente sempre que um valor muda
        const resultado = computed(function () {
            if (!camposValidos.value || erro.value) {
                return null;
            }
            const valor = calcular(numero1.value, numero2.value, operacao.value);
            return parseFloat(valor.toFixed(6)); // evita 0.1 + 0.2 = 0.30000000000000004
        });

        return { numero1, numero2, operacao, operacoes, erro, resultado };
    }
});

// Componente reutilizável, personalizado por propriedades (props)
app.component('card-resultado', {
    props: ['titulo', 'valor', 'negativo'],
    template: `
        <div class="resultado" :class="{ negativo: negativo }">
            <span>{{ titulo }}</span>
            <strong>{{ valor }}</strong>
        </div>
    `
});

app.mount('#app');
