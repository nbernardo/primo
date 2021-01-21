user = {
    controller: new UserViewController(),
    request: new ProwebRequest(),
    baseUrl: `${BASE_IP}:4001/user`,
    pagesPath: "/template/"
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
            id: userData.id || userData._id,
            isTrue : userData.logged ? userData.logged : false,
            telefone: userData.telefone,
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

        __REQUEST__.postJSON(`${user.baseUrl}/address`, userAddress, (resp, xhr) => {

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

    this.saveUserOffline = function(userObj){

        clearOfflineUserData(false);

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
        __VIEW_UTILS__.hideSpinner();
        document.getElementById("btnCriarUser").disabled = false;

        setTimeout(() => {
            this.handleNoAuthButton();
            handleUserMenu();
        },500);

        this.clearField();

    }

    this.saveUser = function(){
        
        this.clearUserCreationValidation();
        let userObj = this.getFields();
        let obj = JSON.stringify(userObj);
        let passwordValidate = this.isPasswordAndConfOk();
        let userInputValidation = (new ProwebValidation()).validateRequired("entyti-user");

        if(!passwordValidate.result) return false;
        if(userInputValidation){
            // __VIEW_UTILS__ está localizado em app/component/js/utils
            __VIEW_UTILS__.showSpinnerForViewContainer("accountModal");
            (new ProwebRequest()).postJSON(`${user.baseUrl}`, obj, (res, xhr) => {
                let result = JSON.parse(res);
                userObj["id"] = result.id || null;
                userObj["logged"] = true;

                if(result.status == "ok"){
                    this.saveUserOffline(userObj);
                }else{
                    //Houve um problema
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

        return null;

    }

    this.userProfileHomeButtons = function(){

        let myAccountButtons = `

                    <style>

                        .loggedUserButtons span:first-child{
                            margin-left:0;
                        }

                        .loggedUserButtons{

                            flex-direction: column; 
                            background: #28a745 !important;
                            text-align: center; 
                            width: 68px; 
                            height: 80px; 
                            display: flex; 
                            float: left; 
                            border-radius: 10%; 
                            margin-top: -10px !important; 
                            align-items: center;
                            justify-content: center;
                            margin-left: 10px !important;
                            padding-top:2px;
                        }

                        .loggedUserButtonsIcon{
 
                            text-align: center; 
                            width: 45px; 
                            height: 45px; 
                            display: flex; 
                            border-radius: 100%;
                            align-items: center;
                            justify-content: center;
                            color: green;
                            background: white;
                            font-size: 20px;

                        }

                        .loggedUserButtonsText{
                            font-size:.65rem !important;
                            font-weight:bold;
                            color:white;
                        }

                    </style>

                    <div id="loggedUserButtons" style="height: 35px;">

                        <span class="text-green m-0 loggedUserButtons">
                            <a href="#" id="loginModalButton" data-toggle="modal" data-target="#loginModal" class="text-decoration-none text-green loggedUserButtonsIcon">
                                <i class="text-green icofont-teacher" ></i>
                            </a>
                            <span class="loggedUserButtonsText">Meus<br>dados</span>
                        </span>

                        <span class="text-green m-0 loggedUserButtons" style="left:10px; background: #fd7e14 !important;">
                            <a href="#" id="loginModalButton" data-toggle="modal" data-target="#loginModal" class="text-decoration-none text-green loggedUserButtonsIcon">
                                <i class="text-green icofont-badge" style="color: #fd7e14 !important;"></i>
                            </a>
                            <span class="loggedUserButtonsText">Meus<br>Pontos</span>
                        </span>


                        <span class="text-green m-0 loggedUserButtons" style="background: #6c757d !important">
                            <a href="#" id="loginModalButton" onclick="user.controller.getInvoices()"  class="text-decoration-none text-green loggedUserButtonsIcon">
                                <i class="text-green icofont-listing-number" style="color: #6c757d !important"></i>
                            </a>
                            <span class="loggedUserButtonsText">Minhas Encomendas</span>
                        </span>

                    </div>

        `;

        return myAccountButtons;

    }

    this.handleNoAuthButton = function(){

        let isUserLogged = __PROWEBAUTH__.isUserLogged();
        if(isUserLogged){
            document.getElementById("notAuthButton").innerHTML = this.userProfileHomeButtons();
            return;
        }

        if(window.location.pathname.indexOf("my_account.html") >= 0){
            window.location = `${window.location.origin}${user.pagesPath}index.html`
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

        try{
            document.getElementById("notAuthButton").innerHTML = buttons;
        }catch(e){}

    }

    this.hideNoAuthButton = function(){
        document.getElementById("notAuthButton").innerHTML = "";
    }

    this.closeLogin = function(){
        document.getElementById("closeLoginButton").click();
    }

    this.logout = async function(){

        let loggedUser = await this.findOfflineUser();

        if(loggedUser){

            loggedUser.logged = false;
            localStorage.setItem("user",JSON.stringify(loggedUser));
            this.handleNoAuthButton();
            handleUserMenu();
            document.getElementById("toggleButton").click();

        }

    }

    const handleUserMenu = function(){

        setTimeout(() => {
            document.getElementsByClassName("second-nav")[0].innerHTML = (new MenuViewController()).generateMainMenu();
        },500);

    }

    this.login = async function(){

        document.getElementById("loginError").style.display = "none";
        let pass = document.getElementById("loginPassword").value;
        let user = document.getElementById("loginUser").value;
        
        let loggedUser = await this.findOfflineUser();
        __VIEW_UTILS__.showSpinnerWithNoEscape({title: "Processando o login",});

        if(loggedUser){

            if(loggedUser.telefone == user && pass == loggedUser.senha){

                this.loginOffline(loggedUser);
                return true;

            }else
                this.processOnlineLogin(user, pass);
        }else{
            this.processOnlineLogin(user, pass, true);
        }
       
    }

    this.processOnlineLogin = function(user, pass, noUserOff){

        if(noUserOff) console.log("*** No User offline ***");

        this.loginOnline(user, pass, (res) => {
            
            console.log("*** Searching online 1 ***");
            let result = JSON.parse(res);

            if(!result.status){
                document.getElementById("loginError").style.display = "";
                __VIEW_UTILS__.hideSpinner();
                return false;
            }

            let curUser = result.data;
            curUser.logged = true;
            curUser.senha = pass;
            clearOfflineUserData(false);
            localStorage.setItem("user", JSON.stringify(curUser));
            let curAddress = {endereco: curUser.endereco || {}};
            localStorage.setItem("address", JSON.stringify(curAddress));
            this.handleNoAuthButton();
            handleUserMenu();
            this.closeLogin();
            __VIEW_UTILS__.hideSpinner();
            document.getElementById("loginPassword").value = "";
            document.getElementById("loginUser").value = "";

        })

    }


    const clearOfflineUserData = function(showCart){

        Object.keys(localStorage).forEach(item => {
            localStorage.removeItem(item);
        });

        carrinho.controller.cartItemsCount();
        //carrinho.controller.renderCartView();
        carrinho.controller.clearCart();
        if(showCart == undefined || showCart == true || showCart == null)
            carrinho.controller.showCartOppened();

    }


    this.loginOffline = function(loggedUser){

        console.log("*** Offline Searching ***");
        loggedUser.logged = true;
        localStorage.setItem("user",JSON.stringify(loggedUser));
        document.getElementById("loginError").style.display = "none";

        this.closeLogin();
        if(carrinho.accessTry){
            carrinho.accessTry = false;
            carrinho.controller.showCartOppened();
        }
        __VIEW_UTILS__.hideSpinner();
        this.handleNoAuthButton();
        handleUserMenu();

        document.getElementById("loginPassword").value = "";
        document.getElementById("loginUser").value = "";

    }

    this.loginOnline = function(userLogin, pass, callback){

        let curUser = JSON.stringify({telefone: userLogin, senha: pass});
        (new ProwebRequest()).postJSON(`${user.baseUrl}/login`,curUser, (res, xhr) => {
            
            callback(res);

        });

    }

    this.getAddress = async function(){

        let curAddress = await localStorage.getItem("address");
        if(curAddress){
            return JSON.parse(curAddress);
        }

        return {};

    }

    this.processShowInvoices = function(){
        
    }

    this.getInvoices = async function(){
        
        if(navigator.onLine){
            console.log("Está online:");
            
            __VIEW_UTILS__.showSpinnerWithNoEscape({
                feedback: true,
                title: "Buscando online...",
                message1: `Carregando as encomenda!`,
                message2: `Aguarde um instante`
            });
            
            carrinho.controller.findInvoicesByUser(this.getLoggedUser().id, async (res) => {

                
                __VIEW_UTILS__.hideSpinner();
                const invoices = await carrinho.controller.getAllInvoices();
                __VIEW_UTILS__.showEmptyModel({content: invoices, title: `As últimas ${carrinho.controller.totalListInvoices} encomendas`});

            });
            return true;
        }

        const invoices = await carrinho.controller.getAllInvoices();
        __VIEW_UTILS__.showEmptyModel({content: invoices, title: `As últimas ${carrinho.controller.totalListInvoices} encomendas`});

    }

    return this;

}