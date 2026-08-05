<script lang="ts">
  import AssemblyPaper from "../../AssemblyPaper.svelte";
</script>

<p>No último capítulo vimos um pouco sobre as instruções de código que um processador executa, um outro nome para essas instruções é código assembly, talvez você já tenha visto alguém falar de assembly como sendo a “linguagem” mais complicada de se programar, mas na verdade é o contrário, assembly é uma “linguagem” extremamente simples, seus comandos são extremamente diretos, mas como funciona isso? Até pouco tempo atrás estávamos trabalhando com fios elétricos que ligavam e desligavam para controlar o processador, como conseguimos fazer isso usando o texto agora?</p>

<p>Se você estranhou o uso das aspas no termo “linguagem” no parágrafo passado, o motivo de ter sido usado, é que, assembly é uma conversão direta dos sinais elétricos enviados, mas para entendermos isso temos que entender como funciona o processo de converter um código em assembly em um binário.</p>

<p>Binário? Binário como vimos no primeiro capítulo se refere a um sistema numérico que só contém 2 dígitos, porque essa palavra está sendo empregada nesse contexto agora?</p>

<p>Vamos dar alguns passos para trás, nos últimos capítulos vimos sobre como a unidade de controle recebia uma entrada binária como por exemplo 0110 0010 0011, e internamente dependendo da arquitetura do processador iria redirecionar os sinais para as entradas correta dos outros componentes, como por exemplo, interpretar o 0110 como um comando de soma, e já ativa a ULA passando como entrada os valores 0010 e 0011 que poderiam representar o endereço de memória dos registradores que armazenam os valores a serem somados. Um programa de computador nada mais é que uma lista de instruções como essas para o processador interpretar, acionar os fios certos e computar os dados, como essas instruções são compostas por sequências de números binários, representando literalmente entradas ligadas e desligadas, ficou comum na indústria de computação, chamar os arquivos que contém esses zeros e uns das instruções de binários, já que eles são arquivos que contém somente uns e zeros dentro.</p>

<p>O problema é que é muito difícil escrever binário manualmente, lembrar as sequências de zeros e uns para realizar cada operação, e garantir que você digitou certo e não fez nenhum errinho de escrita, quando o código inteiro está em binário é muito complicado, e pensando nisso, vários engenheiros pararam e surgiram com uma ideia simples, uma “linguagem” onde mapeamos palavras para operações, isto é, sempre que escrevermos “soma” vamos converter para 0110 por exemplo, dessa forma, podemos escrever todo o nosso código em uma linguagem mais humana, usando palavras para representar esses comandos e quando terminarmos, que nosso programa esteja totalmente implementado, podemos fazer o processo de converter essas palavras para binário.</p>

<p>E isso é feito literalmente usando uma tabela de substituição, onde para cada palavra vamos ter uma sequência de zeros e uns equivalentes, dessa forma converter um código assembly para um binário que o processador consegue entender e processar passa a ser um processo de ver a palavra, ir na tabela, e substituir pela representação binária daquela palavra, e fazer isso para todas as palavras, essa tabela de conversão é única para cada arquitetura de processador, e pode ser encontrada no manual da arquitetura, por exemplo hoje em dia a maioria dos procesadores de computador usam a arquitectura x86_64, já no mundo dos celulares é muito comum a arquitetura ARM, que possui várias variações dependendo do uso que aquele processador vai ter, não vamos ver detalhes dessas arquiteturas pois, diferente desse curso que tem apenas um objetivo didático, essas arquiteturas tem utilidade real em dispositivos, e por isso vão incluir várias instruções básicas, usar técnicas e componentes mais avançados do que os que foram discutidos neste curso, o que vimos até agora foram apenas princípios básicos com foco em facilidade de aprendizado, mas que seriam ineficientes para os padrões modernos, por isso vamos usar nossa propria arquitetura simplificada para vermos como um código assembly funciona.</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>Instrução</th>
      <th>Binário</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>FIM</td>
      <td>0000</td>
      <td>Termina o programa e desliga o computador</td>
    </tr>
    <tr>
      <td>CARREGAR</td>
      <td>0001</td>
      <td>Carrega os dados do endereço de memória no registrador especificado</td>
    </tr>
    <tr>
      <td>ARMAZENAR</td>
      <td>0010</td>
      <td>Carrega os dados do registrador A no endereço de memória</td>
    </tr>
    <tr>
      <td>DEFINIR</td>
      <td>0011</td>
      <td>Define o registrador especificado com o valor passado</td>
    </tr>
    <tr>
      <td>SOMAR</td>
      <td>0100</td>
      <td>Soma o registrador A com registrador B e coloca o resultado no registrador A</td>
    </tr>
    <tr>
      <td>SUBTRAIR</td>
      <td>0101</td>
      <td>Subtrai os registradores A e B e coloca o resultado no registrador A</td>
    </tr>
    <tr>
      <td>MAIORQUE</td>
      <td>0110</td>
      <td>Verifica se o registrador A é maior que o registrador B e colocá 0 ou 1 no registrador A</td>
    </tr>
    <tr>
      <td>IGUAL</td>
      <td>0111</td>
      <td>Verifica se o registrador A é igual ao registrador B e colocá 0 ou 1 no registrador A</td>
    </tr>
    <tr>
      <td>PULAR</td>
      <td>1000</td>
      <td>Se o registrador A for 1 roda a próxima linha de código, se não pula ela</td>
    </tr>
    <tr>
      <td>IRPARA</td>
      <td>1001</td>
      <td>Vai para a linha de código especificada</td>
    </tr>
  </tbody>
</table></div>

<p>Essa é a arquitetura fictícia que vamos usar no curso, vamos escrever o código usando as palavras na coluna de instruções, e um programa chamado assembler, montador em português, vai substituir as palavras pelo equivalente na coluna de binário, essas instruções foram programadas de forma física no nosso processador, para conectar as entradas dos componentes internas por isso essa é a lista que temos, outra coisa que esse programa assembler foi programado para fazer é converter os números decimais para binário automaticamente para a gente, com isso podemos criar qualquer programa que quisermos, vamos ver, para esse primeiro exemplo um sistema de buzina foi conectado ao endereço 300 de memória do computador, assim sempre que seu valor é 1 a buzina liga, e quando é zero ela desliga, também conectamos dois botões um no endereço 100 de memória e outro no endereço 200, sempre que eles são apertados o valor de memória é 1, e quando estão soltos é 0.</p>

<AssemblyPaper code={"1\nDEFINIR B 0\nInicializa B como zero\n2\nCARREGAR A 100\nCarrega o valor do botão 1 no registrador A\n3\nIGUAL\nCompara A e B, se o botão estiver apertado A vai ser 0, se não, vai ser 1\n4\nPULAR\nIgnora a próxima linha se o botão não estiver apertado\n5\nIRPARA 9\nSe o botão for apertado vai para a linha 9 de código\n6\nDEFINIR A 0\nDefine A como 0\n7\nARMAZENAR 300\nSalvamos A no endereço 300 desligando a buzina.\n8\nIRPARA 1\nReiniciar o programa indo para a linha 1\n9\nDEFINIR A 1\ndefine o valor do registrador A como 1\n10\nARMAZENAR 300\nDefine 300 com o valor de A que é 1, ligando a buzina\n11\nIRPARA 1\nReiniciar o programa indo para a linha 1"} />

<p>Esse é um programa que quando o usuário apertar o botão 1 vai ligar a buzina, e quando o usuário solta o botão desliga a buzina. Pode parecer algo simples e inútil, mas exemplifica bem o uso das nossas instruções, talvez o uso do pular na linha 4 tenha confundido um pouco as coisas, então vamos separar esse código em 3 partes, e examiná-las individualmente, vamos primeiro ver o que está acontecendo nas linhas 1 à 5:</p>

<AssemblyPaper code={"1\nDEFINIR B 0\nInicializa B como zero\n2\nCARREGAR A 100\nCarrega o valor do botão 1 no registrador A\n3\nIGUAL\nCompara A e B, se o botão estiver apertado A vai ser 0, se não, vai ser 1\n4\nPULAR\nIgnora a próxima linha se o botão não estiver apertado\n5\nIRPARA 9\nSe o botão for apertado vai para a linha 9 de código"} />

<p>As 3 primeiras linhas de código são bem diretas, a primeira define o valor no nosso registrador B com o valor de 0, depois chamamos a instrução CARREGAR, que vai pegar o valor do endereço de memória 100, onde conectamos o botão 1, e vai carregar o valor no registrador A, se o botão estiver apertado o valor no registrador A vai ser 1, se não vai ser 0. Em seguida, rodamos o IGUAL que compara o valor de A e B, se o botão estiver apertado, A vai ser 1, e B vai ser 0, e portanto, a comparação vai falhar, substituindo o valor do registrador A por 0, zero de falso ou seja não são iguais, porém, se o botão não estiver apertado, o valor de A depois da instrução CARREGAR, vai ser 0 e quando rodarmos a instrução IGUAl vamos comparar se 0 e 0 são iguais, e são, portanto o valor de 1, que significa verdadeiro, eles são iguais, vai ser colocado no registrador A, por fim, chamamos a instrução PULAR, que pula 1 linha de código caso o valor de A seja 1, isso significa que, se o botão estiver apertado, a comparação do IGUAL falha, e portanto A vai ter o valor de 0, fazendo a instrução PULAR não fazer nada e executar o código da linha 5 normalmente, mas se o botão não estiver apertado o valor de A vai ser 1 após o IGUAL, e por isso a instrução PULAR vai pular a linha 5 e executar diretamente a linha 6 de código. A linha 5 sendo uma instrução para ir diretamente para a linha 9 de código, faz com que se o botão for pressionado as linhas 6 à 8 sejam ignoradas completamente, mas se o botão não for pressionado, como pulamos a linha 5 vamos executar a linha 6 em diante normalmente.</p>

<AssemblyPaper code={"6\nDEFINIR A 0\nDefine A como 0\n7\nARMAZENAR 300\nSalvamos A no endereço 300 desligando a buzina.\n8\nIRPARA 1\nReiniciar o programa indo para a linha 1"} />

<p>Nas linhas 6, 7 e 8 temos as instruções que vão ser executadas se o botão não for pressionado, como vimos anteriormente, se o botão não for pressionado pulamos a linha 5 e executamos diretamente a linha 6, nela vamos definir o valor de A para 0 substituindo qualquer valor que estivesse lá antes, depois armazenamos o valor de A que é 0 no endereço de memoria 300, que é o endereço ligado à nossa buzina, como 0 significa falso, ou desligado, isso tem o efeito de desligar a buzina caso ela estivesse ligada. Em seguida, na linha 8 falamos para o processador voltar a primeria linha de código, efetivamente recomeçando o programa, já que ele vai redefinir o valor de B, e carregar novamente em A o estado do botão e refazer toda a comparação como se estivesse sendo executado pela primeira vez, é por isso que é importante definir de forma explícita os valores que queremos em A e B no início do código ao invés de assumir que quando chamarmos nosso código os endereços de memória e registradores vão estar do jeito que queremos que já estejam, seja preenchidos com zeros ou uns. Por fim, perceba que o processador não consegue chegar a linha 9 de código se o botão estiver pressionado, já que ele sempre vai pular da linha 4 para a 6 e depois quando chegar na 8 voltar para a linha 1.</p>

<AssemblyPaper code={"9\nDEFINIR A 1\ndefine o valor do registrador A como 1\n10\nARMAZENAR 300\nDefine 300 com o valor de A que é 1, ligando a buzina\n11\nIRPARA 1\nReiniciar o programa indo para a linha 1"} />

<p>Caso o botão esteja pressionado e portanto a instrução PULAR não seja executada, vamos executar a instrução da linha 5 que fala para o processador ir direto para a linha 9, onde vamos definir A com o valor de 1, e logo em seguida armazenar esse valor no endereço 300 onde fica nossa buzina, por fim falamos para o processador ir direto para a primeira linha do programa, basicamente reiniciando-o.</p>

<p>Perceba que mesmo tendo um conjunto de instruções simples com apenas 10 instruções possíveis, é possível criar programas extremamente complexos apenas combinando essas 10 instruções, nosso programinha tinha apenas 11 linhas de código, mas nada nos impediria de criar programas com 200 ou até mesmo 10 mil linhas de código, assim como poderíamos conectar ao invés de botões e buzinas, dispositivos complexos como placas de vídeo, placas de rede, e criar programas que desenham gráficos complexos na tela ou se comunicam pela internet, e tudo isso sem precisar modificar nosso conjunto de instruções, apenas carregando e armazenando valores em endereços de memória específicos, executando operações aritméticas simples e performando pulos e avançando ou voltando para linhas de código específicos, conseguimos interagir com dispositivo externos e efetuar qualquer lógica que quisermos, isso é, se conseguirmos mentalmente quebrar o problema que queremos resolver em passos simples que podemos resolver usando apenas essas 11 instruções.</p>

<p>Por isso que assembly, é considerada a linguagem mais simples, porém, a mais difícil de se programar, sua dificuldade não vem de comando complexos, nesse quesito ela é extremamente simples, possuindo apenas poucas instruções que executam ações bem definidas pela arquitetura do processador, a dificuldade real vem, de você conseguir resolver seu problema apenas usando essas poucas instruções primitivas, é tipo tentar fazer um almoço inteiro sem nenhum utensílio, é possível, você vai ter que criar suas próprias facas, potes, panelas do zero, e isso demanda habilidade, e é difícil já que você vai ter que criar muita coisa do zero, mas os conceitos base não são complexos.</p>

<p>Antes de finalizarmos este capítulo fica aqui mais um exemplo de programa complexo que podemos executar, esse programa recebe um número através de clicks no botão 1, por exemplo para o número 8 o usuário apertou o botão 8 vezes, em seguida o usuário aperta o botão 2, e pode inserir outro número, ao apertar o botão 2 novamente o computador vai multiplicar os dois números e exibir o resultado na forma de beeps da buzina, compreender o que está acontecendo nesse programa fica como exercício para o leitor.</p>

<AssemblyPaper code={"01\nDEFINIR B 0\nDefine B como 0 para ser usado na comparação\n\n; Botão 1\n02\nCARREGAR A 100\nCarrega o valor de botão 1 no registrador A\n03\nIGUAL\nCompara com B, 0 se apertado, 1 se não apertado\n04\nPULAR\nVai para a linha 06 se não apertado, 05 se apertado\n05\nIRPARA 12\nVai lidar com a lógica do botão 1 apertado\n; Botão 2\n06\nDEFINIR B 0\nGarante que B seja 0\n07\nCARREGAR A 200\nCarrega o botão 2 no registrador A\n08\nIGUAL\nCompara com B, 0 se apertado, 1 se não apertado\n09\nPULAR\nLinha 10 se apertado, 11 se não apertado\n10\nIRPARA 27\nLida com a lógica do botão 2 apertado\n11\nIR PARA 01\nVolta para o início do programa se não apertado\n; Botão 1 apertado\n12\nCARREGAR A 502\nPuxa o valor no endereço 502 onde armazenamos se estamos no primeiro ou segundo número da operação\n13\nDEFINIR B 0\nGarante que B seja 0, 0 é primeiro número, 1 é segundo número\n14\nIGUAL\nRegistrador A vira 0 se for o segundo número, e 1 se for o primeiro número\n15\nPULAR\nVai para a linha 17 incrementar o primeiro número\n16\nIRPARA 22\nVai para a linha 22 incrementar o segundo número\n\n\n; Incrementar o primeiro número\n17\nDEFINIR B 1\nDefine B para 1 para usarmos na soma\n18\nCARREGAR A 500\nCarrega o valor do primeiro número armazenado no endereço 500\n19\nSOMAR\nSoma o valor do primeiro número resgatado do endereço 500 com 1 do registrador B\n20\nARMAZENAR 500\nGuarda o resultado da soma de volta no endereço 500\n21\nIRPARA 01\nVolta para o início do programa\n; Incrementar o segundo número\n22\nDEFINIR B 1\nDefine B como 1 para a soma\n23\nCARREGAR A 501 \nCarrega em A o valor do número 2 localizado no endereço 501\n24\nSOMAR\nSoma o valor do número 2 com 1 do registrador B\n25\nARMAZENAR 501\nSalva o valor somado de volta no endereço 501\n26\nIRPARA 01\nVolta para o início do programa\n; Botão 2 apertado\n27\nCARREGAR A 502\nCarrega a informação se estamos no número 1 ou 2\n28\nDEFINIR B 1\nDefine B como 1 para ser usado na soma\n29\nSOMAR\nSe o estado do endereço 502 for 0 vira 1, se já for 1 vira 2\n30\nARMAZENAR 502\nGuarda o resultado de volta na memória\n31\nDEFINIR B 2\nDefine B como 2 para a comparação\n32\nIGUAL\nVerifica se o estado é 2 ou não (realizar multiplicação e saída)\n33\nPULAR\nSe o estado for 2 vá para a linha 35, se não para a linha 34\n\n\n34\nIRPARA 01\nVolta para o início para processar os botões até o estado ser 2\n; Multiplicar Número 1 e 2\n35\nDEFINIR A 0\nzera o valor de A\n36\nARMAZENAR 503\nArmazena o valor de 0 em 503 onde vai ser o resultado da multiplicação\n37\nCARREGAR A 501\nCarrega o valor do número 2\n38\nARMAZENAR 504\nContador de multiplicação\n; Ciclo de multiplicação\n39\nDEFINIR B 0\nPara fins de verificação\n40\nCARREGAR A 504\nCarrega o contador em A\n41\nIGUAL\nO Contador chegou a 0?\n42\nPULAR\nSe chegou a zero pule para a linha 43\n43\nIRPARA 45\nVá para 45 para realizar as operações matemáticas\n44\nIRPARA 54\nVá para 54 tocar a buzina quantas vezes estiver no endereço 503\n; Matemática da Multiplicação\n45\nCARREGAR A 503\nCarrega o resultado da multiplicação em A\n46\nCARREGAR B 500\nCarrega o valor do número 1 em B\n47\nSOMAR\nSoma o valor existente do resultado com o número 1\n48\nARMAZENAR 503\nSalva o novo resultado da multiplicação\n49\nCARREGAR A 504\nCarrega o contador de multiplicação\n50\nDEFINIR B 1\nPara fins de subtrair\n\n\n51\nSUBTRAIR\nDiminui 1 do contador de multiplicação\n52\nARMAZENAR 504\nSalva o valor atualizado do contador de multiplicação\n53\nIRPARA 39\nVoltar para o ciclo de multiplicação\n; Buzina\n54\nDEFINIR B 0\nPara fins de verificação\n55\nCARREGAR A 503\nCarrega o valor final da multiplicação\n56\nIGUAL\nVerifica se o resultado da multiplicação é 0\n57\nPULAR\nSe for 0 execute a linha 59, se não a 58\n58\nIRPARA 60\nCiclo de apitar a buzina\n59\nFIM\nFinaliza o programa e desliga o computador\n; Apitar buzina\n60\nDEFINIR A 1 \nPara ligar a buzina\n61\nARMAZENAR 300\nLigar a buzina\n62\nCARREGAR A 503\nCarrega o resultado da multiplicação\n63\nDEFINIR B 1\nPara fins de subtrair\n64\nSUBTRAIR\nReduz 1 do resultado da multiplicação\n65\nARMAZENAR 503\nSalva o valor com redução na memória\n66\nDEFINIR A 0 \nPara desligar a buzina\n67\nARMAZENAR 300\nDesliga a buzina\n68\nIRPARA 54\nVoltar para o ciclo da buzina"} />

<p>Dica: foque em um caminho lógico, por exemplo botão 1 apertando quando o estado está no número 2, ao invés de tentar processar toda a lógica de uma vez só.</p>

<p>Antes de finalizarmos este capítulo, algumas observações sobre esse programa, perceba que mesmo sem uma instrução para multiplicar números, conseguimos usar as instruções já existentes para isso, e perceba também, que mesmo as instruções do processador serem simples, e o programa fazendo algo simples, o código é grande e complexo, e por isso hoje em dia é extremamente raro encontrar programadores que usam assembly no dia a dia, invés disso é preferível usar linguagens de nível mais alto.</p>


<style>
  .table-scroll {
    margin: 1.75rem 0;
    overflow-x: auto;
  }

  .tabela {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    background: var(--surface);
  }

  .tabela th,
  .tabela td {
    padding: 0.75rem 0.9rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--border);
  }

  .tabela th {
    background: var(--accent-soft);
    color: var(--text);
    font-weight: 700;
  }

  .tabela tbody tr:last-child td {
    border-bottom: 0;
  }

</style>
