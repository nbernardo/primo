const __VIEW_UTILS__ = new ViewUtils();

String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.substr(1);
}


function ViewUtils(){

    this.viewToHide = "";
    this.spinningSuccessMessage = "";
    this.afterSpinningContent = "";
    this.spinnerFeedBack = false;


    this.showSpinnerForViewContainer = function(viewToHide){

        this.viewToHide = viewToHide;
        try{
            document.getElementById(viewToHide).getElementsByClassName("modal-content")[0].style.display = "none";
        }catch(e){}

        try{
            document.getElementById("processSpinnerButton").click();
        }catch(e){}

    }


    this.showHiddenSpinnerView = function(){

        document.getElementById(this.viewToHide).getElementsByClassName("modal-content")[0].style.display = "";
        document.getElementById("loadingModal").getElementsByTagName("button")[0].click();

    }

    this.closeModals = function(){

        document.getElementById(this.viewToHide).getElementsByClassName("modal-content")[0].getElementsByTagName("button")[0].click();
        document.getElementById("loadingModal").getElementsByTagName("button")[0].click();

    }

    this.hideSuccessModal = function(){
        document.getElementById("processSuccessButton").click();
    }

    this.showSuccessModal = function(obj){

        let status = "none";
        if(obj.order)
            status = obj.order == true ? "" : "none";

        document.getElementById("userMessage").innerHTML = `${obj.message1}`;
        document.getElementById("continueUserMessage").innerHTML = `${obj.message2 || ""}`;
        document.getElementById("successModalLabel").innerHTML = `${obj.title || "Processado com sucesso"}`;
        document.getElementById("displayOrderPrep").style.display = status;
        document.getElementById("processSuccessButton").click();

    }

    this.generateSuccessModal = function(order){

        console.log("Modal vire chamada");
        let modal = `
        
                <a href="#" data-toggle="modal" data-target="#successModal" id="processSuccessButton" style="display: none;" class="text-decoration-none text-white">
                    <i class="text-white icofont-badge" style="color: white; font-size: 18px;"></i> Processando...
                </a>

                <div class="modal fade" id="successModal" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="successModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-success">
                        <div class="modal-header">
                            <h5 class="modal-title" id="successModalLabel">Login</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                            <div class="row d-flex justify-content-center">
                                <div class="col-md-6">
                                <div class="p-1 text-center">
                                    <i class="icofont-check-circled display-1 text-warning"></i>
                                    <h3 class="text-white font-weight-bold"><span id="userMessage"></span> 🎉</h3>
                                    <p class="text-white" id="continueUserMessage"></p>
                                    <!-- <p class="text-white">Check your order status in <a href="complete_order.html" class="font-weight-bold text-decoration-none text-white">My Order</a> about next steps information.</p> -->
                                </div>
                                <!-- continue -->
                                <div class="bg-white rounded  m-2 text-center" id="displayOrderPrep" style="display:none;">
                                    <h6 class="font-weight-bold mb-2">Preparing your order</h6>
                                    <p class="small text-muted">Your order will be prepared and will come soon</p>
                                    <a href="status_onprocess.html" class="btn rounded btn-warning btn-lg btn-block">Track My Order</a>
                                </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    </div>
                </div>

        `;

        document.getElementById("successModalContainer").innerHTML = modal;

    }


    this.generateSpinningModal = function(){

        let modal = `
        
                        <style>

                        /* CSS SPINNER*/
                        .lds-roller {
                        display: inline-block;
                        position: relative;
                        width: 80px;
                        height: 80px;
                        }
                        .lds-roller div {
                        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                        transform-origin: 40px 40px;
                        }
                        .lds-roller div:after {
                        content: " ";
                        display: block;
                        position: absolute;
                        width: 7px;
                        height: 7px;
                        border-radius: 50%;
                        background: grey;
                        margin: -4px 0 0 -4px;
                        }
                        .lds-roller div:nth-child(1) {
                        animation-delay: -0.036s;
                        }
                        .lds-roller div:nth-child(1):after {
                        top: 63px;
                        left: 63px;
                        }
                        .lds-roller div:nth-child(2) {
                        animation-delay: -0.072s;
                        }
                        .lds-roller div:nth-child(2):after {
                        top: 68px;
                        left: 56px;
                        }
                        .lds-roller div:nth-child(3) {
                        animation-delay: -0.108s;
                        }
                        .lds-roller div:nth-child(3):after {
                        top: 71px;
                        left: 48px;
                        }
                        .lds-roller div:nth-child(4) {
                        animation-delay: -0.144s;
                        }
                        .lds-roller div:nth-child(4):after {
                        top: 72px;
                        left: 40px;
                        }
                        .lds-roller div:nth-child(5) {
                        animation-delay: -0.18s;
                        }
                        .lds-roller div:nth-child(5):after {
                        top: 71px;
                        left: 32px;
                        }
                        .lds-roller div:nth-child(6) {
                        animation-delay: -0.216s;
                        }
                        .lds-roller div:nth-child(6):after {
                        top: 68px;
                        left: 24px;
                        }
                        .lds-roller div:nth-child(7) {
                        animation-delay: -0.252s;
                        }
                        .lds-roller div:nth-child(7):after {
                        top: 63px;
                        left: 17px;
                        }
                        .lds-roller div:nth-child(8) {
                        animation-delay: -0.288s;
                        }
                        .lds-roller div:nth-child(8):after {
                        top: 56px;
                        left: 12px;
                        }
                        @keyframes lds-roller {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                        }

                    </style>


                    <a href="#" data-toggle="modal" data-target="#loadingModal" id="processSpinnerButton" style="display: none;" class="text-decoration-none text-white">
                        <i class="text-white icofont-badge" style="color: white; font-size: 18px;"></i> Processando...
                    </a>
                    <div class="modal fade" id="loadingModal"  aria-labelledby="loadingModalLabel">
                        <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="loadingModalLabel">Processando...</h5>
                                <button type="button" id="spinnerCloseButton" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body" id="spinnerModalContent" style="text-align: center;">

                                <div class="lds-roller">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>

                                <div>
                                    ... Aguarde ...
                                </div>

                            </div>
                            
                        </div>
                        </div>
                    </div>

        `;

        document.getElementById("spinnerModalContainer").innerHTML = modal;
        //setTimeout(() => {$('#loadingModal').modal({backdrop: 'static', keyboard: false})}, 500);

    }

    this.spinningContent = function(){

        return `
                <div class="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div>
                    ... Aguarde ...
                </div>
        `;

    }

    

    this.showSpinnerWithNoEscape = function(obj){

        document.getElementById("spinnerCloseButton").style.display = "none";
        $('#loadingModal').modal({backdrop: 'static', keyboard: false});

        document.getElementById("loadingModalLabel").innerHTML = `${(obj.title || "Processando...")}`;
        
        this.spinnerFeedBack = obj.feedback;
        this.spinningSuccessMessage = `${(obj.message1 ? obj.message1 : 'Processo terminado com sucesso')}`;
        this.afterSpinningContent = `
            <h6>${ this.spinningSuccessMessage} !</h6>
            <div style="margin: 20px auto">
                <button type="button" class="btn btn-success btn-block btn-lg" class="close" data-dismiss="modal" aria-label="Close">Ok</button>
            </div>
        `;


    }


    this.showSpinnerFeedback = function(){

        if(this.spinnerFeedBack){
            setTimeout(() => {
                document.getElementById("spinnerModalContent").innerHTML = this.afterSpinningContent;    
            },500);
        }

    }


    this.showSpinner = function(obj){

        //if(obj.message1) document.getElementById("userMessage").innerHTML = obj.message1;
        document.getElementById("processSpinnerButton").click();

    }

    this.hideSpinner = function(){
        document.getElementById("loadingModal").getElementsByTagName("button")[0].click();
    }


    this.mapView = function(){

    }


    this.loadCss = function(path){

        let cssObj = document.createElement("link");
        cssObj.href = path;
        cssObj.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(cssObj);

    }

    this.loadJS = function(path){

        let jsObj = document.createElement("script");
        jsObj.src = path;
        jsObj.defer = true;
        document.getElementsByTagName("head")[0].appendChild(jsObj);

    }


    return this;


}