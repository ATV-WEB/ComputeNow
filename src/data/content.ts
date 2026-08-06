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
  }, {
    id: 'roteiro',
    title: 'Escrevendo seu primeiro roteiro para jogo digital',
    description: 'Narrativa, roteiro e storytelling para jogos digitais.',
    category: ['Game Jam'],
    modules: [{
      id: 'roteiro-criando-um-mundo-ficcional',
      title: 'Criando um mundo ficcional',
      chapters: [
        {
          id: 'roteiro-criando-um-guia-mestre',
          title: 'Criando um Guia mestre, mundo, regras, personagens e suas personalidades',
          contentComponent: 'roteiro-criando-um-guia-mestre',
        },
        {
          id: 'roteiro-menos-e-mais',
          title: 'Menos é mais: Dicas para evitar grandes parágrafos desnecessários',
          contentComponent: 'roteiro-menos-e-mais'
        },
        {
          id: 'roteiro-entrando-na-historia',
          title: 'Entrando na história: Escrevendo textos que encaixam no mundo desenvolvido',
          contentComponent: 'roteiro-entrando-na-historia'
        }
      ]
    }, 
    {
      id: 'roteiro-restringindo-o-escopo',
      title: 'Restringindo o Escopo da história',
      chapters: [
        {
          id: 'roteiro-simplicidade',
          title: 'Simplicidade: evitando histórias confusas de entender',
          contentComponent: 'roteiro-simplicidade',
        }
      ]
    },
    {
      id: 'roteiro-criando-um-enredo-envolvente',
      title: 'Criando um Enredo envolvente',
      chapters: [
        {
          id: 'roteiro-inicio',
          title: 'Início: atiçando a curiosidade do jogador desde o início',
          contentComponent: 'roteiro-inicio',
        },
        {
          id: 'roteiro-mundos-vivos',
          title: 'Mundos vivos: Criando a ilusão de tempo',
          contentComponent: 'roteiro-mundos-vivos'
        }
      ]
    },
    {
      id: 'roteiro-cativando-atraves-do-suspense',
      title: 'Cativando através do Suspense',
      chapters: [
        {
          id: 'roteiro-um-mundo-maior-que-o-jogador',
          title: 'Um mundo maior que o jogador: fazendo o jogador descobrir a causa da problemática',
          contentComponent: 'roteiro-um-mundo-maior-que-o-jogador',
        },
        {
          id: 'roteiro-estranhos',
          title: 'Estranhos: nem todo personagem vai se abrir com você',
          contentComponent: 'roteiro-estranhos'
        },
        {
          id: 'roteiro-desconhecido',
          title: 'Desconhecido: como se preparar para o que não se sabe',
          contentComponent: 'roteiro-desconhecido'
        },
        {
          id: 'roteiro-fragmentado',
          title: 'Fragmentado: descobrindo a história um passo de cada vez',
          contentComponent: 'roteiro-fragmentado'
        }
      ]
    },
    {
      id: 'roteiro-surpreendendo-o-jogador-com-um-plot-twist',
      title: 'Surpreendendo o jogador com um Plot Twist',
      chapters: [
        {
          id: 'roteiro-dupla-narrativa',
          title: 'Dupla Narrativa: duas conclusões diferentes para as mesmas dicas',
          contentComponent: 'roteiro-dupla-narrativa',
        },
        {
          id: 'roteiro-mentiras',
          title: 'Mentiras: Nem todo mundo é confiável',
          contentComponent: 'roteiro-mentiras'
        },
        {
          id: 'roteiro-as-aparencias-enganam',
          title: 'As aparências enganam: quando um detalhe se transforma num elemento chave',
          contentComponent: 'roteiro-as-aparencias-enganam'
        }
      ]
    },
    {
      id: 'roteiro-escrevendo-personagens-engajantes',
      title: 'Escrevendo Personagens engajantes',
      chapters: [
        {
          id: 'roteiro-herois-profundos',
          title: 'Heróis profundos: nem todo herói é um super herói',
          contentComponent: 'roteiro-herois-profundos',
        },
        {
          id: 'roteiro-viloes-motivados',
          title: 'Vilões motivados: por que ser malvado?',
          contentComponent: 'roteiro-viloes-motivados'
        },
        {
          id: 'roteiro-pecas-complementares',
          title: 'Peças complementares: dando uma função e motivação para os personagens secundários',
          contentComponent: 'roteiro-pecas-complementares'
        },
        {
          id: 'roteiro-drama',
          title: 'Drama: fortalecendo laços através do conflito interno entre amigos',
          contentComponent: 'roteiro-drama'
        },
        {
          id: 'roteiro-perda',
          title: 'Perda: descobrindo o melhor momento para matar um personagem',
          contentComponent: 'roteiro-perda'
        }
      ]
    }
  ],
  }, {
    id: 'blender',
    title: 'Modelagem 3D com Blender',
    description: 'Fundamentos da computação gráfica 3D, modelagem, escultura, materiais, iluminação e renderização com Blender.',
    category: ['Game Jam'],
    modules: [
      {
        id: 'blender-introducao',
        title: 'Introdução ao Blender',
        chapters: [
          {
            id: 'blender-introducao',
            title: 'Objetivo Geral e Introdução ao Blender',
            contentComponent: 'blender-introducao'
          }
        ]
      }, {
        id: 'blender-conhecendo-o-blender',
        title: 'Módulo 1 – Conhecendo o Blender',
        chapters: [
          {
            id: 'blender-explorando-interface',
            title: 'Explorando a Interface (UI)',
            contentComponent: 'blender-explorando-interface'
          }
        ]
      }, {
        id: 'blender-fundamentos-da-modelagem',
        title: 'Módulo 2 – Fundamentos da Modelagem',
        chapters: [
          {
            id: 'blender-vertices-arestas-faces',
            title: 'Vértices, Arestas e Faces',
            contentComponent: 'blender-vertices-arestas-faces'
          },
          {
            id: 'blender-ferramentas-basicas-modelagem',
            title: 'Ferramentas básicas de modelagem',
            contentComponent: 'blender-ferramentas-basicas-modelagem'
          },
          {
            id: 'blender-topologia',
            title: 'Topologia',
            contentComponent: 'blender-topologia'
          },
          {
            id: 'blender-modificadores',
            title: 'Modificadores',
            contentComponent: 'blender-modificadores'
          }
        ]
      }, {
        id: 'blender-escultura-digital',
        title: 'Módulo 3 – Escultura Digital',
        chapters: [
          {
            id: 'blender-escultura-digital',
            title: 'Escultura Digital',
            contentComponent: 'blender-escultura-digital'
          }
        ]
      }, {
        id: 'blender-aparencia-dos-objetos',
        title: 'Módulo 4 – Aparência dos Objetos',
        chapters: [
          {
            id: 'blender-materiais',
            title: 'Materiais',
            contentComponent: 'blender-materiais'
          },
          {
            id: 'blender-shader-nodes',
            title: 'Shader Nodes',
            contentComponent: 'blender-shader-nodes'
          },
          {
            id: 'blender-iluminacao-e-render',
            title: 'Introdução à Iluminação e ao Render',
            contentComponent: 'blender-iluminacao-e-render'
          }
        ]
      }, {
        id: 'blender-encerramento',
        title: 'Encerramento',
        chapters: [
          {
            id: 'blender-projeto-final',
            title: 'Projeto Final',
            contentComponent: 'blender-projeto-final'
          },
          {
            id: 'blender-glossario-e-recursos',
            title: 'Glossário, curiosidades e recursos',
            contentComponent: 'blender-glossario-e-recursos'
          }
        ]
      }
    ]
  }, {
    id: 'gestao-pessoas',
    title: 'Gestão de Pessoas',
    description: 'Liderança, foco, redução de escopo e delegação para equipes em maratonas de desenvolvimento.',
    category: ['Game Jam', 'Hackathon'],
    modules: [
      {
        id: 'gestao-pessoas-como-escolher-um-lider',
        title: 'Como escolher um líder',
        chapters: [
          {
            id: 'gestao-pessoas-identificando-perfis-de-lideranca',
            title: 'Identificando perfis de liderança',
            contentComponent: 'gestao-pessoas-identificando-perfis-de-lideranca'
          },
          {
            id: 'gestao-pessoas-lideranca-tecnica-vs-lideranca-facilitadora',
            title: 'Liderança técnica vs. liderança facilitadora',
            contentComponent: 'gestao-pessoas-lideranca-tecnica-vs-lideranca-facilitadora'
          },
          {
            id: 'gestao-pessoas-resolucao-de-impasses',
            title: 'Resolução de impasses',
            contentComponent: 'gestao-pessoas-resolucao-de-impasses'
          }
        ]
      },
      {
        id: 'gestao-pessoas-o-que-um-lider-faz',
        title: 'O que um líder faz',
        chapters: [
          {
            id: 'gestao-pessoas-blindagem-e-foco',
            title: 'Blindagem e foco',
            contentComponent: 'gestao-pessoas-blindagem-e-foco'
          },
          {
            id: 'gestao-pessoas-alinhamento-da-visao-do-projeto',
            title: 'Alinhamento da visão do projeto',
            contentComponent: 'gestao-pessoas-alinhamento-da-visao-do-projeto'
          }
        ]
      },
      {
        id: 'gestao-pessoas-reducao-de-escopo',
        title: 'Redução de Escopo',
        chapters: [
          {
            id: 'gestao-pessoas-o-mvp-sob-pressao',
            title: 'O MVP (Produto Mínimo Viável) sob pressão',
            contentComponent: 'gestao-pessoas-o-mvp-sob-pressao'
          },
          {
            id: 'gestao-pessoas-domando-o-feature-creep',
            title: 'Domando o Feature Creep',
            contentComponent: 'gestao-pessoas-domando-o-feature-creep'
          }
        ]
      },
      {
        id: 'gestao-pessoas-como-dividir-as-tarefas',
        title: 'Como dividir as tarefas (Delegar)',
        chapters: [
          {
            id: 'gestao-pessoas-mapeamento-rapido-de-habilidades',
            title: 'Mapeamento rápido de habilidades',
            contentComponent: 'gestao-pessoas-mapeamento-rapido-de-habilidades'
          },
          {
            id: 'gestao-pessoas-gestao-agil-de-curtissimo-prazo',
            title: 'Gestão ágil de curtíssimo prazo',
            contentComponent: 'gestao-pessoas-gestao-agil-de-curtissimo-prazo'
          },
          {
            id: 'gestao-pessoas-acompanhamento-sem-microgerenciamento',
            title: 'Acompanhamento sem microgerenciamento',
            contentComponent: 'gestao-pessoas-acompanhamento-sem-microgerenciamento'
          }
        ]
      }
    ]
  }
];

export const tracks: Track[] = [
  {
    id: 'game-jam',
    title: 'Trilha Game Jam',
    description: 'Ponta pé inicial para o desenvolvimento de jogos.',
    courseIds: ['algoritmos', 'gestao-pessoas', 'roteiro', 'blender']
  },
  {
    id: 'hackathon',
    title: 'Trilha Hackathon',
    description: 'Aprenda desenvolvimento eficiente de aplicações web.',
    courseIds: ['algoritmos', 'gestao-pessoas']
  }
];
