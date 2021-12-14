// Criando variáveis parar adicionar um eventlistner e capturar o conteúdo
// das tags button e input e uma variável que irá cuidar do que a função
//"run" irá criar no HTML

var submitButton = document.querySelector("#app form button");
var zipCodeField = document.querySelector("#app form div.container input");
var content = document.querySelector("#app main");

//Eventlistner dizendo que quando o botão for pressionado, a função "run"
// deve ser executada

submitButton.addEventListener("click", run);

//Função run

function run(event) {
  event.preventDefault();

  //Isolando o valor do CEP que foi informado na tag input
  var zipCode = zipCodeField.value;

  //Tratando exceções, basicamente essa parte do codigo está tirando os pontos,
  //vírgulas e espaços em branco que o usuário possa digitar e venha a
  //ocasionar algum erro
  zipCode = zipCode.replace(" ", "");
  zipCode = zipCode.replace(".", "");
  zipCode = zipCode.replace(",", "");
  zipCode = zipCode.trim();

  //Fazendo a requisição pela API do ViaCEP com o Axios que foi importado na
  //linha 79 do arquivo index.html
  axios
    //Usando o metodo "get" para fazer a requisição e utilizando a variavel
    //"zipCode" - que armazena o valor do CEP digitado - para mudar a URL do
    //request de acordo com o CEP digitado na tag "input"
    .get("https://viacep.com.br/ws/" + zipCode + "/json/")

    //then/catch para o tratamento de exceções
    .then((res) => {
      //Limpando o conteúdo da variável content - que controla o que irá
      //aparecer dentro da tag "main" - para que sempre que algum novo CEP
      //for digitado, apaga as informações da requisição antiga, pois não
      //queremos uma lista e sim informações isoladas para cada requisição
      content.innerHTML = "";

      //Sem esse if, se fosse digitado um valor de oito digitos, mesmo que
      //não fosse um CEP válido ele iria fazer o request e não trataria esse
      //valor como um erro(não cairia no catch).
      //Na API se você tenta buscar um CEP inexistente vc recebe um objeto
      //chamado "erro" que é igual a "true", basicamente o que eu fiz aqui foi:
      //se o objeto "erro" existir, mostre que o CEP é inválido
      if (res.data.erro) {
        throw new Error("CEP inválido");
      }

      //Criando a tag p
      var line = document.createElement("p");

      //Aqui quando digitava um CEP com o final 000 - nao contem o nome de ruas-
      //aparecia uma vírgula indesejada na resposta, então fiz essa lógica para
      //a vírgula aparecer apenas quando a resposta do request conter o
      //nome da rua
      var virgula = ", ";
      if (res.data.logradouro == "") {
        virgula = "";
      }

      //Criando o texto final que aparecerá quando o request for concluído
      var text = document.createTextNode(
        zipCode +
          ": " +
          res.data.logradouro +
          virgula +
          res.data.localidade +
          "/" +
          res.data.uf
      );

      //Essa linha diz que o conteúdo da tag "p" será o texto
      //que foi criado acima na variável text, que imprime todas as informações
      //do request, ou seja, as informações do request ficarão numa tag "p",
      //serão um parágrafo
      line.appendChild(text);

      //Aqui diz que a variável "content" será pai da variável "line" no HTML,
      //ou seja, no HTML a tag "p" ficará dentro da tag "main"
      content.appendChild(line);
    })
    .catch((err) => {
      //Se o request nao passar no tratamento de exceções ele virá para esse
      //código, vai limpar todos o request defeituoso e mostrar
      //uma mensagem de erro
      content.innerHTML = "";
      var line = document.createElement("p");

      var text = document.createTextNode("Verifique o CEP e tente novamente");

      line.appendChild(text);
      content.appendChild(line);
    });
}

/*
                                 _
                                | \
                                | |
                                | |
           |\                   | |
          /, ~\                / /
         X     `-.....-------./ /
          ~-. ~  ~              |
             \             /    |
              \  /_     ___\   /
              | /\ ~~~~~   \ |
              | | \        || |
              | |\ \       || )
             (_/ (_/      ((_/ 

  Sim isso é um gato, é tipo minha marca registrada pra falar que o código é
  original e feito pelo Jezz           
*/
