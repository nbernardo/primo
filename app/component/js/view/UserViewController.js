user = {
    controller: new UserViewController(),
    request: new ProwebRequest(),
}

function UserViewController(){

    this.getFields = function(){

        let filedsClass = "entyti-user";
        let fields = document.getElementsByClassName(filedsClass);
        let values = {}

        for(x = 0; x < fields.length; x++){
            values[fields[x].id] = fields[x].value;
        }

        return values;

    }

    this.clearField = function(){
 
        let filedsClass = "entyti-user";
        let fields = document.getElementsByClassName(filedsClass);
        
        for(x = 0; x < fields.length; x++){
            fields[x].value = "";
        }
        
    }

    this.isPasswordAndConfOk = function(){

        let senha = document.getElementById("senha");
        let conf = document.getElementById("senhaConf");

        if(document.getElementsByClassName("senhaRequiredLabel")[0].style.display == ""){
            return false;
        }

        let result = (senha.value == conf.value);
        if(!result){
            document.getElementById("senhaConf-emptyError").style.display = "";
        }

        return {
            result: result
        };
    }

    this.clearUserCreationValidation = function(){
        
        this.passwordFieldsValidation("1px solid #cacdd0");
        document.getElementById("senhaConf-emptyError").style.display = "none";
    }

    this.passwordFieldsValidation = function(color){

        const fieldColor = color;
        document.getElementById("senha").style.border = fieldColor;
        document.getElementById("senhaConf").style.border = fieldColor;

    }

    this.saveUser = function(){
        
        this.clearUserCreationValidation();
        let userObj = this.getFields();
        let obj = JSON.stringify(userObj);
        let passwordValidate = this.isPasswordAndConfOk();
        let userInputValidation = (new ProwebValidation()).validateRequired("entyti-user");

        if(!passwordValidate.result){
            console.log("Não passou");
            return;
        }
        
        console.log("Resultado validação: ",userInputValidation);

        if(userInputValidation){

            console.log("Entrou");
            document.getElementById("btnCriarUser").disabled = true;
            // __VIEW_UTILS__ está localizado em app/component/js/utils
            __VIEW_UTILS__.showSpinnerForViewContainer("accountModal");

            (new ProwebRequest()).postJSON(`${BASE_IP}:4001/user`, obj, (res, xhr) => {
                const result = JSON.parse(res);
                
                userObj["id"] = result.id;

                if(result.status == "ok"){
                    resultObj = {
                        ...userObj
                    }
    
                    localStorage.setItem("user", JSON.stringify(userObj));
                    __VIEW_UTILS__.closeModals();
                    __VIEW_UTILS__.showSuccessModal({
                            order: false, 
                            message1: `${userObj.nomeCompleto}, parabens, sua conta foi crida e com sucesso, e você já está logado na App`, 
                            message2: "A partir da agora você poderá não só navegar, mas também fazer encomendas a partir da App"
                        });
                    document.getElementById("btnCriarUser").disabled = false;
                    this.clearField();
                }
            })
        }

    }


    this.renderAddressOnMap = function(){
        __PROWEBMAP__.renderMap("localMap");
    }

    return this;

}