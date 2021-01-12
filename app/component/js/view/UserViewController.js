user = {
    controller: new UserViewController(),
    request: new ProwebRequest(),
}

function UserViewController(){

    this.userLat = 0;
    this.userLng = 0;

    this.setLat = function(lat){
        this.userLat = lat;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        this.userLat = position.coords.latitude;
        this.userLng = position.coords.longitude;
    });

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

    this.getLoggedUser = function(){

        const user = localStorage.getItem("user");
        const userData = JSON.parse(user);

        if(user == null || user == undefined) return {isTrue: false};

        return {
            name: userData.nomeCompleto,
            email: userData.email,
            id: userData.id,
            isTrue : userData.logged ? userData.logged : false
        };
        
    }

    this.saveAddress = function(){

        let fields = __FORM_UTIL__.getFieldValueByClass("entity-userAddress");
        fields["latLng"] = `${this.userLat},${this.userLng}`;
        let obj = {userId: this.getLoggedUser().id, endereco: fields};

        let userAddress = JSON.stringify(obj);

        __VIEW_UTILS__.showSpinnerWithNoEscape({
            feedback: true,
            title: "Registo de endereço",
            message1: `Endereço registado com sucesso`
        });

        __REQUEST__.postJSON(`${BASE_IP}:4001/user/address`, userAddress, (resp, xhr) => {

            __VIEW_UTILS__.showSpinnerFeedback();
            let result = JSON.parse(resp);
            if(result.status == "ok"){
                this.saveAddressOffline(userAddress);
            }

        })

    }

    this.saveAddressOffline = function(address){

        localStorage.setItem("address", address);

    }

    this.getOfflineAddress = function(){

        let fullAddress = localStorage.getItem("address");
        let splittedAddr = JSON.parse(fullAddress);

        if(fullAddress){

            if(splittedAddr.endereco){

                for(field in splittedAddr.endereco){
                
                    if(field != undefined && field != "latLng")
                        document.getElementById(`user${field.capitalize()}`).value = splittedAddr.endereco[field];
                   
                }
            }
        }
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
        
        if(userInputValidation){

            document.getElementById("btnCriarUser").disabled = true;
            // __VIEW_UTILS__ está localizado em app/component/js/utils
            __VIEW_UTILS__.showSpinnerForViewContainer("accountModal");

            (new ProwebRequest()).postJSON(`${BASE_IP}:4001/user`, obj, (res, xhr) => {
                const result = JSON.parse(res);
                
                userObj["id"] = result.id;
                userObj["logged"] = true;

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

    this.findOfflineUser = async function(){

        let loggedUser = await localStorage.getItem("user");
        if(loggedUser){
            loggedUser = JSON.parse(loggedUser);
            return loggedUser;
        }

        return {};

    }

    this.handleNoAuthButton = function(){

        if(__PROWEBAUTH__.isUserLogged()){
            document.getElementById("notAuthButton").innerHTML = "";
            return;
        }

        let buttons = `
        
                    <span class="bg-danger text-white px-3 rounded small m-0 profileButton">
                        <a href="#" data-toggle="modal" data-target="#accountModal" class="text-decoration-none text-white">
                        <i class="text-white icofont-badge" style="color: white; font-size: 18px;"></i> Registar-me
                        </a>
                    </span>
                    &nbsp;
                    <span class="bg-danger text-white  px-3 rounded small m-0 profileButton">
                        <a href="#" id="loginModalButton" data-toggle="modal" data-target="#loginModal" class="text-decoration-none text-white">
                        <i class="text-white icofont-ui-user" style="color: white;"></i> Logar
                        </a>
                    </span>

        `;

        document.getElementById("notAuthButton").innerHTML = buttons;

    }

    this.hideNoAuthButton = function(){
        document.getElementById("notAuthButton").innerHTML = "";
    }

    this.closeLogin = function(){
        document.getElementById("closeLoginButton").click();
    }

    this.logout = async function(){

        let loggedUser = await this.findOfflineUser();

        loggedUser.logged = false;
        localStorage.setItem("user",JSON.stringify(loggedUser));
        this.handleNoAuthButton();
        document.getElementById("toggleButton").click();

    }

    this.login = async function(){

        document.getElementById("loginError").style.display = "none";
        let pass = document.getElementById("loginPassword").value;
        let user = document.getElementById("loginUser").value;
        
        let loggedUser = await this.findOfflineUser();

        if(loggedUser.telefone == user && pass == loggedUser.senha){
            
            loggedUser.logged = true;
            localStorage.setItem("user",JSON.stringify(loggedUser));
            document.getElementById("loginError").style.display = "none";

            this.closeLogin();
            if(carrinho.accessTry){
                carrinho.accessTry = false;
                carrinho.controller.showCartOppened();
            }
            this.handleNoAuthButton();
            
        }else{
            document.getElementById("loginError").style.display = "";
        }
        document.getElementsByClassName("second-nav")[0].innerHTML = menu.controller.generateMainMenu();

    }

    this.getAddress = async function(){

        let curAddress = await localStorage.getItem("address");
        if(curAddress){
            return JSON.parse(curAddress);
        }
        
        return {};

    }

    return this;

}