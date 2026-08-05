export type Chapter = {
  id: string;
  title: string;
  contentComponent: string;
};

export type Module = {
  id: string;
  title: string;
  chapters: Chapter[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  category: string[];
};

export type Track = {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
};

export const courses: Course[] = [
  {
    id: 'algoritmos',
    title: 'Introdução a algoritmos e lógica de programação',
    description: 'Aprenda os conceitos essenciais de HTML, CSS e JavaScript.',
    category: ['Game Jam', 'Hackathon'],
    modules: [
      {
        id: 'modulo-como-funciona-um-computador',
        title: 'Como funciona um computador (simplificado)',
        chapters: [
          {
            id: 'algoritmos-binario',
            title: 'Binário: Ligado e Desligado',
            contentComponent: 'algoritmos-binario',
          },
          {
            id: 'algoritmos-transistor',
            title: 'Transistor: O que é? Como funciona?',
            contentComponent: 'algoritmos-transistor'
          }
        ]
      }, {
        id: 'modulo-portas-logicas',
        title: 'Portas Lógicas e Tabela Verdade (Logic Gates)',
        chapters: [
          {
            id: 'algoritmos-and-not-or',
            title: 'AND Gate, OR Gate, NAND Gate',
            contentComponent: 'algoritmos-and-or-nand'
          },
          {
            id: 'algoritmos-tabela-verdade',
            title: 'Tabela Verdade e sua utilidade',
            contentComponent: 'algoritmos-tabela-verdade'
          },
          {
            id: 'algoritmos-composicao-portas-logicas',
            title: 'Composição de Portas Lógicas',
            contentComponent: 'algoritmos-composicao-portas-logicas'
          },
          {
            id: 'algoritmos-somando-numeros-portas-logicas',
            title: 'Somando números usando portas lógicas',
            contentComponent: 'algoritmos-somando-numeros-portas-logicas'
          },
          {
            id: 'algoritmos-flip-flops',
            title: 'Flip Flops: Armazenando dados com circuitos',
            contentComponent: 'algoritmos-flip-flops'
          },
          {
            id: 'algoritmos-clock',
            title: 'Clock: Sincronizando tarefas com pulsos',
            contentComponent: 'algoritmos-clock'
          },
          {
            id: 'algoritmos-assembly',
            title: 'Assembly: A linguagem mais simples',
            contentComponent: 'algoritmos-assembly'
          },
          {
            id: 'algoritmos-linguagens-alto-nivel',
            title: 'Linguagens de alto nível: Facilitando a programação',
            contentComponent: 'algoritmos-linguagens-alto-nivel'
          }
        ]
      },
      {
        id: 'modulo-condicionais',
        title: 'Condicionais',
        chapters: [
          {
            id: 'algoritmos-if-else',
            title: 'If Else e suas utilidades',
            contentComponent: 'algoritmos-if-else'
          }
        ]
      },
      {
        id: 'modulo-tipos-de-dados',
        title: 'Tipos de dados',
        chapters: [
          {
            id: 'algoritmos-tipos-simples',
            title: 'Tipos simples (Booleanos e chars)',
            contentComponent: 'algoritmos-tipos-simples'
          },
          {
            id: 'algoritmos-numeros',
            title: 'Números (UInt, Int, float, short, long)',
            contentComponent: 'algoritmos-numeros'
          },
          {
            id: 'algoritmos-ponteiros',
            title: 'Ponteiros',
            contentComponent: 'algoritmos-ponteiros'
          },
          {
            id: 'algoritmos-estruturas-e-objetos-customizados',
            title: 'Estruturas e objetos customizados (Arrays, structs, linked lists)',
            contentComponent: 'algoritmos-estruturas-e-objetos-customizados'
          }
        ]
      }, {
        id: 'modulo-lacos-de-repeticao',
        title: 'Laços de repetição',
        chapters: [
          {
            id: 'algoritmos-while-loop',
            title: 'While loop',
            contentComponent: 'algoritmos-while-loop'
          },
          {
            id: 'algoritmos-do-while',
            title: 'Do while',
            contentComponent: 'algoritmos-do-while'
          },
          {
            id: 'algoritmos-for-loop',
            title: 'For loop',
            contentComponent: 'algoritmos-for-loop'
          }
        ]
      }, {
        id: 'modulo-funcoes',
        title: 'Funções',
        chapters: [
          {
            id: 'algoritmos-funcoes',
            title: 'Funções',
            contentComponent: 'algoritmos-funcoes'
          },
          {
            id: 'algoritmos-parametros',
            title: 'Parâmetros',
            contentComponent: 'algoritmos-parametros'
          },
          {
            id: 'algoritmos-retorno',
            title: 'Retorno',
            contentComponent: 'algoritmos-retorno'
          },
          {
            id: 'algoritmos-recursividade',
            title: 'Recursividade',
            contentComponent: 'algoritmos-recursividade'
          }
        ]
      }
    ]
  },
];

export const tracks: Track[] = [
  {
    id: 'game-jam',
    title: 'Trilha Game Jam',
    description: 'Ponta pé inicial para o desenvolvimento de jogos.',
    courseIds: ['algoritmos', 'svelte-primeiro']
  },
  {
    id: 'hackathon',
    title: 'Trilha Hackathon',
    description: 'Aprenda desenvolvimento eficiente de aplicações web.',
    courseIds: ['dados-basicos', 'web-fundamentos']
  }
];
