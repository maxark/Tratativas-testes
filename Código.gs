// Constantes mantidas...
const ID_BASE_DADOS = "1njXVq2gohrquJCGsZkV5AmBTTvlnDuAnYHaPahw0PF4"; 

// NOVA ROTA PARA RECEBER REQUISIÇÕES DO GITHUB
function doPost(e) {
  try {
    // Como o front enviará como text/plain (para evitar erro de CORS), fazemos o parse manual
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data || {};
    var responseData = {};

    // Roteador de Ações
    switch(action) {
      case 'getPendentesGlobais':
        responseData = getPendentesGlobais();
        break;
      case 'getHistoricoGlobal':
        responseData = getHistoricoGlobal();
        break;
      case 'sincronizarTempoReal':
        // Agora recebemos o email do frontend, já que Session.getActiveUser() não funcionará
        responseData = sincronizarTempoReal(data.item, data.acao, data.emailRep);
        break;
      case 'resolverPendenteGlobal':
        responseData = resolverPendenteGlobal(data.rowIdx, data.resolucao, data.emailRep);
        break;
      default:
        return outputJSON({ success: false, message: "Ação não encontrada." });
    }

    return outputJSON({ success: true, data: responseData });

  } catch(error) {
    return outputJSON({ success: false, message: error.toString() });
  }
}

// Função utilitária para converter respostas para JSON e permitir saída
function outputJSON(object) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}

// OBS: Suas lógicas internas continuam iguais, apenas altere a resolverPendenteGlobal 
// para receber o e-mail como parâmetro, já que não temos mais getEmailUsuario() na API.
