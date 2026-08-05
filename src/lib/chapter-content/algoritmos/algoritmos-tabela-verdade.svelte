<p>Talvez você tenha ficado um pouco confuso no final do último capítulo, com todo aquele, contrário de, se esse e aquele, somente, ambos, e realmente quando você está lendo um parágrafo de texto, como esse por exemplo, é muito fácil se confundir sobre as entradas e saídas esperadas de uma porta lógica e acabar tendo que voltar e reler o texto várias vezes, foi justamente pensando nisso que foi criada a tabela verdade, que por mais que tenha um nome que possa parecer algo complexo de início, a tabela verdade nada mais é que uma tabela onde listamos todas as entradas do nosso circuito e qual a saída esperada, isso nos ajuda a garantir que não vamos errar nenhuma condição que o nosso circuito pode atender, isso se torna extremamente útil especialmente para circuitos com um grande número de entradas e saídas.</p>

<p>A tabela verdade mais simples é a de um NOT GATE, no caso um circuito que consiste apenas de um NOT GATE, veja só:</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>Entrada A</th>
      <th>Saída 1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
    </tr>
  </tbody>
</table></div>

<p>Não existe uma regra para o nome das entradas e saídas, porém, é muito comum ver uma tabela verdade que usam as letras do alfabeto para nomear as entradas.</p>

<p>Perceba que listamos todas as entradas possíveis, isto é, se a entrada “A” estiver desligada (0) e quando ela for ligada (1), e qual a saída esperada, no caso do nosso circuito ele consiste apenas de um NOT GATE, então ele vai apenas retornar a saída contrária à entrada.</p>

<p>Agora vamos ver uma tabela mais complexa de um AND GATE, uma porta lógica que recebe duas entradas, que vamos chamar de “A” e “B”, e que vai retornar em uma saída, que vamos chamar de saída “R”, verdadeiro (1) quando as duas entradas forem verdadeiras, e falso (0) quando as duas entradas forem diferentes ou falsas.</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>Entrada A</th>
      <th>Entrada B</th>
      <th>Saída R</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>1</td>
    </tr>
  </tbody>
</table></div>

<p>Pode parecer algo bobo, mas isso é somente porque estamos vendo casos simples, circuitos que consistem apenas de 1 porta lógica, em circuitos maiores com 4, 10, 50 entradas e saídas, é extremamente útil ter uma forma padronizada de listar as entradas e quais saídas são esperadas, mais à frente neste curso vamos quando formos ver circuitos capazes de calcular operações aritméticas usando binário, vamos usar de forma extensiva a tabela verdade para planejarmos quais resultados temos que obter para nossas entradas.</p>


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
