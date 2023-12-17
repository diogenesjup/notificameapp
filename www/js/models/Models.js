class Models{
    

    // TESTAR A DISPONIBILIDADE DA API
    testeApi(){
                
             console.log("TESTE API DESATIVADO");   

    }
    


    // PROC LOGIN
    procLogin(){

       $("#btnViewLogin").html("Processando...");
       
       var loginUsuario = $("#form1a").val();
       var loginSenha   = $("#form1ab").val();
            
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: "https://meuappdigital.com/wp-json/notifica-app/v1/auth-usuarios/",
                  data:{username:loginUsuario,password:loginSenha}
              
              })
              request.done(function (dados) {    

                  $("#btnViewLogin").html("Entrar");        

                  console.log("%c RETORNO DO LOGIN","background:#ff0000;color:#fff;");
                  console.log(dados);

                  if(dados.dias<0){
                    alert("Login ou Senha incorretos");
                    return;
                  }

                  /*
                  if(dados.dias>31){
                    alert("Sua assinatura expirou, entre em contato com o suporte");
                    return;
                  }

                  if(dados.dias>=0 && dados.dias<=31){
                    location.href="dashboard.html";
                  }
                  */

                  // Verifica se há algum produto elegível para redirecionar para a dashboard
                    var podeAcessarDashboard = dados.produtos.some(produto => {
                        return produto.dias_desde_ultima_compra < produto.recorrencia && produto.tipo_app === "APP DE PLATAFORMAS DE REDE SOCIAL";
                    });

                    if (podeAcessarDashboard) {
                        location.href = "dashboard.html";
                        return;
                    }

                    alert("Sua assinatura expirou, entre em contato com o suporte");

                
                  
              });
              request.fail(function (dados) {

                   console.log("API NÃO DISPONÍVEL (procLogin)");
                   console.log(dados);
                   alert("Oops! Algo deu errado... Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");
                   $("#btnViewLogin").html("Login");

              });
              // FINAL CHAMADA AJAX
            
           
           // CONFIRMAR O LOGIN
           //app.login();

    }

    // PROC LOGIN SMS
    procLoginSms(){

      $("#btnViewLogin").html("Carregando...");
       
       event.preventDefault();

       var loginUsuario = $("#loginUsuario").val();

	          // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"token-sms-login.php",
                  data:{token:app.token,tokenSms:app.tokenSms,loginUsuario:loginUsuario}
              
              })
              request.done(function (dados) {        

                  $("#btnViewLogin").html("Próximo");    

                  console.log("%c RETORNO DO LOGIN","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                  	 
                  	 localStorage.setItem("dadosUsuario",dadosUsuario);
                  	 //app.login(dados.id,dados.email,dadosUsuario);

                     app.verificarCodigoSms();
                  
                  }else{
                     
                     //$(".form-control").val("");
                     //aviso("Oops! Login ou senha não encontrados","Verifique os dados inseridos e tente novamente!");
                     
                     // SE O CELULAR NAO ESTIVER CADASTRADO
                     // VAMOS DIRECIONAR O USUÁRIO PARA CONCLUIR O CADASTRO
                    
                     // SALVAR O CELULAR PARA O CADASTRO
                     localStorage.setItem("celularCadastro",dados.celular);

                     app.cadastro();

                  }
                  
              });
              request.fail(function (dados) {

                   $("#btnViewLogin").html("Próximo"); 
                     
                   console.log("API NÃO DISPONÍVEL (procLogin)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }

    // VERIFICAR O CÓDIGO SMS ENVIADO PELO USUÁRIO
    verificarCodigoSms(){

      $("#btnConfirmarCodigo").html("Processando...");

      event.preventDefault();

       var codigoSms = $("#codigoSms").val();

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"verificar-sms.php",
                  data:{token:app.token,codigoSms:codigoSms}
              
              })
              request.done(function (dados) {         

                  $("#btnConfirmarCodigo").html("Confirmar código.");   

                  console.log("%c RETORNO DA VERIFICACAO DO CODIGO DE SMS","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                     
                     localStorage.setItem("dadosUsuario",dadosUsuario);
                     app.login(dados.id,dados.email,dadosUsuario);
                  
                  }else{
                     
                     $(".form-control").val("");
                     aviso("Oops! Código incorreto","Verifique o código recebido e tente novamente. Se ainda tiver dificuldades, tente entrar com o e-mail e senha.");
                     
                  }
                  
              });
              request.fail(function (dados) {

                   $("#btnConfirmarCodigo").html("Confirmar código."); 
                     
                   console.log("API NÃO DISPONÍVEL (verificarCodigoSms)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }


    // PROC CADASTRO
    procCadastro(){

        $("#btnViewCadastro").html("Processando...");

        event.preventDefault();

        /*

        var cpf = $('#cpf').val();
  
                // INICIO CHAMADA AJAX
                var request = $.ajax({
  
                    method: "POST",
                    url: app.urlApiProxy+"cadastro.php",
                    data:{token:app.token,omniToken:app.omniToken,cpf:cpf}
                
                })
                request.done(function (dados) {         

                    $("#btnViewCadastro").html("Cadastrar");   
  
                    console.log("%c RETORNO DO CADASTRO","background:#ff0000;color:#fff;");
                    console.log(dados);
  
                    var dadosUsuario = JSON.stringify(dados);
                    
                    if(dados.sucesso=="200"){

                     
                            if(dados.dados.Cliente){

                                  // SALVAR DADOS RETORNADOS

                                  localStorage.setItem("AreaAtendimentoID",dados.dados.Cliente.AreaAtendimentoID);
                                  localStorage.setItem("AtendimentoVeiculo",dados.dados.Cliente.AtendimentoVeiculo);
                                  localStorage.setItem("Bairro",dados.dados.Cliente.Bairro);
                                  localStorage.setItem("BloqueioTotal",dados.dados.Cliente.BloqueioTotal);
                                  localStorage.setItem("CEP",dados.dados.Cliente.CEP);
                                  localStorage.setItem("CPFCNPJ",dados.dados.Cliente.CPFCNPJ);
                                  localStorage.setItem("Celular",dados.dados.Cliente.Celular);
                                  localStorage.setItem("Cidade",dados.dados.Cliente.Cidade);
                                  localStorage.setItem("ClienteID",dados.dados.Cliente.ClienteID);
                                  localStorage.setItem("CodClienteERP",dados.dados.Cliente.CodClienteERP);
                                  localStorage.setItem("Complemento",dados.dados.Cliente.Complemento);
                                  localStorage.setItem("ComunicacaoChip",dados.dados.Cliente.ComunicacaoChip);
                                  localStorage.setItem("ComunicacaoSatelital",dados.dados.Cliente.ComunicacaoSatelital);
                                  localStorage.setItem("DDCel",dados.dados.Cliente.DDCel);
                                  localStorage.setItem("DDTel",dados.dados.Cliente.DDTel);
                                  localStorage.setItem("DesbloqueioPortal",dados.dados.Cliente.DesbloqueioPortal);
                                  localStorage.setItem("Email",dados.dados.Cliente.Email);
                                  localStorage.setItem("EmissaoPV",dados.dados.Cliente.EmissaoPV);
                                  localStorage.setItem("Endereco",dados.dados.Cliente.Endereco);
                                  localStorage.setItem("Entidade",dados.dados.Cliente.Entidade);
                                  localStorage.setItem("Estado",dados.dados.Cliente.Estado);
                                  localStorage.setItem("InscricaoEstadual",dados.dados.Cliente.InscricaoEstadual);
                                  localStorage.setItem("LojaERP",dados.dados.Cliente.LojaERP);
                                  localStorage.setItem("Nome",dados.dados.Cliente.Nome);
                                  localStorage.setItem("Numero",dados.dados.Cliente.Numero);
                                  localStorage.setItem("ProprietarioID",dados.dados.Cliente.ProprietarioID);
                                  localStorage.setItem("Telefone",dados.dados.Cliente.Telefone);
                                  localStorage.setItem("vendedorid",dados.dados.Cliente.vendedorid);

                                  app.views.cadastroPasso2();

                                  if(dados.dados.Cliente.Email!=null){

                                      $("#email").val(dados.dados.Cliente.Email);

                                  }

                              
                            }else{

                              aviso("Oops! Algo deu errado",dados.dados.Mensagem);

                            }
                       
                       //localStorage.setItem("dadosUsuario",dadosUsuario);
  
                       // SE DEU TUDO CERTO, VAMOS LOGAR O USUÁRIO
                       //app.login(dados.id,dados.email,dadosUsuario);
                    
                    }else{
                       
                       aviso("Oops! Esse e-mail já está cadastrado na nossa plataforma","Verifique os dados inseridos e tente novamente! Caso tenha esquecido sua senha, clique no link \"Esqueci Senha\" na tela de login.");
                    
                    }
                    
                });
                request.fail(function (dados) {

                     $("#btnViewCadastro").html("Cadastrar"); 
                       
                     console.log("API NÃO DISPONÍVEL (procCadastro)");
                     console.log(dados);
                     aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");
  
                });
                // FINAL CHAMADA AJAX

                */

                // CONFIRMAR O LOGIN
                app.login();
  
  
      }


    




    procResetSenha(){

              $("#btnViewResetarSenha").html("Processando...");

              event.preventDefault();
               
              var resetEmail = $("#resetEmail").val();
              
              /*
              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"reset-senha.php",
                  data:{token:app.token,resetEmail:resetEmail}
              
              })
              request.done(function (dados) {     

                  $("#btnViewResetarSenha").html("Resetar senha");       

                  console.log("%c RETORNO DO RESET","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                     
                     app.viewLogin();
                     aviso("Deu certo! Senha resetada","Enviamos para o seu e-mails instruções sobre o reset de senha.");
                     
                  }else{
                     
                     aviso("Oops! E-mail não encontrado","Seu e-mail não foi localizado na plataforma. Verique as informações inseridas e tente novamente.");
                  
                  }
                  
              });
              request.fail(function (dados) {

                   $("#btnViewResetarSenha").html("Resetar senha");  
                     
                   console.log("API NÃO DISPONÍVEL (ResetDeSenha)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX
              */

              app.viewLogin();
              aviso("Deu certo! Senha resetada","Enviamos para o seu e-mails instruções sobre o reset de senha.");
                     

    }

}