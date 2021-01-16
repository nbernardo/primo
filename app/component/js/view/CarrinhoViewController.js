const carrinho = {
    controller: new CarrinhoViewController(),
    accessTry: false,
    baseUrl: `${BASE_IP}:4003/shop`,
}

function CarrinhoViewController(){

    const currentLocalTime = new Date();
    this.curDateTime = `${currentLocalTime.getDate()}/${currentLocalTime.getMonth()}/${currentLocalTime.getFullYear()}`;
    this.itemsOnCart = [];
    this.invoicesObj = [];
    this.totalAmount = 0;
    this.totalItems = 0;
    this.totalListInvoices = 0;

    this.createInvoice = async function(curInvoice){

        console.log("*** Para os que vão ***");
        this.invoicesObj.push(curInvoice);
        await localStorage.setItem("invoices_", JSON.stringify(this.invoicesObj));
        return curInvoice;
    }

    this.getActiveInvoice = async function(){

        let invoices = await localStorage.getItem("invoices_");
        let invoiceId = (new Date()).getTime();
        
        if(invoices == null || invoices == undefined || invoices == null){
        
            this.invoicesObj = [];
            curInvoice = {id: invoiceId, active: true};
            return this.createInvoice(curInvoice);

        }

        this.invoicesObj = JSON.parse(invoices);

        if(this.invoicesObj.filter(inv => inv.active).length == 0){

            curInvoice = {id: invoiceId, active: true};
            return this.createInvoice(curInvoice);

        }
        
        return await this.invoicesObj.filter(inv => inv.active)[0];

    }

    //METHODS TO INVOICE
    this.getAllInvoices = async function(){

        let invoicesIds = await localStorage.getItem("invoices_");
        let allInvoices = JSON.parse(invoicesIds);

        const mapInvoice = function(id){
            return JSON.parse(localStorage.getItem(id))
        }

        const invocesCard = await allInvoices.map(inv => {
            let curInvoice = mapInvoice(inv.id);
            if(curInvoice)
                return this.calculateInvoiceValue(curInvoice, inv.id)
            return null;
        });

        this.totalListInvoices = invocesCard.filter(inv => inv != null).length;

        return this.invoiceViewCard(invocesCard.join(""));
        
    }

    //METHODS TO INVOICE
    this.calculateInvoiceValue = function(inv, idInv){
        console.log(inv);

        let totalInvoice = 0;

        if(inv.length > 0){
            let totalItem = parseInt(inv.length) - 1;    
            for(let item of inv){

                if(Object.keys(item).includes("_id")){
                    totalInvoice += (parseInt(item.preco) * parseInt(item.qtd));
                }
            }
            return this.invoceCard({...inv, totalInvoice, totalItem, id: idInv});
        }

        return null;

    }

    //METHODS TO INVOICE
    this.invoceCard = function(obj){

        if(obj[0].details){
        }else{
            return "";
        }

        const invoiceSTatus = {
            "close": `<p class="bg-warning text-white py-1 px-2 rounded small m-0">Em progresso</p>`,
            "done": `<p class="bg-success text-white py-1 px-2 mb-0 rounded small">Entregue</p>`,
            "canceled": `<p class="bg-danger text-white py-1 px-2 rounded small m-0">Cancelado</p>`
        }

        return `

            <div class="order-body">
                        
                <div class="pb-3">
                    <a href="status_canceled.html" class="text-decoration-none text-dark">
                        <div class="p-3 rounded shadow-sm bg-white">
                            <div class="d-flex align-items-center mb-3">
                                ${invoiceSTatus[obj[0].details.status]}
                                <p class="text-muted ml-auto small m-0"><i class="icofont-clock-time"></i>${obj[0].details.date.split("T")[0]} </p>
                            </div>
                            <div class="d-flex">
                                <p class="text-muted m-0">N. encomenda<br>
                                    <span class="text-dark font-weight-bold">#${obj.id}</span>
                                </p>
                                <p class="text-muted m-0 ml-auto">N. itens<br>
                                    <span class="text-dark font-weight-bold">${obj.totalItem}</span>
                                </p>
                                <p class="text-muted m-0 ml-auto">Total factura<br>
                                    <span class="text-dark font-weight-bold">${obj.totalInvoice} Kz</span>
                                </p>
                            </div>
                        </div>
                    </a>
                </div>

            </div>
        
        `;

    }

    this.invoiceViewCard = function(invoices){

        return `
        
        <section class="py-4 osahan-main-body">
        <div class="container">
           <div class="row">
              <div class="col-md-3">
                 <ul class="nav nav-tabs custom-tabs border-0 flex-column bg-white rounded overflow-hidden shadow-sm p-2 c-t-order" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                       <a class="nav-link border-0 text-dark py-3 active" id="completed-tab" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="true">
                       <i class="icofont-check-alt mr-2 text-success mb-0"></i> Entregues</a>
                    </li>
                    <li class="nav-item border-top" role="presentation">
                       <a class="nav-link border-0 text-dark py-3" id="progress-tab" data-toggle="tab" href="#progress" role="tab" aria-controls="progress" aria-selected="false">
                       <i class="icofont-wall-clock mr-2 text-warning mb-0"></i> EM progresso</a>
                    </li>
                    <li class="nav-item border-top" role="presentation">
                       <a class="nav-link border-0 text-dark py-3" id="canceled-tab" data-toggle="tab" href="#canceled" role="tab" aria-controls="canceled" aria-selected="false">
                       <i class="icofont-close-line mr-2 text-danger mb-0"></i> Canceladas</a>
                    </li>
                 </ul>
              </div>
              
              <div class="tab-pane fade show active" style="width: 100%;" id="completed" role="tabpanel" aria-labelledby="completed-tab">
                ${invoices}
              </div>
                
            </div>

           </div>
        </div>


        `


    }


    this.getInvoice = async function(id){

        let invoice = await localStorage.getItem(id);
        return invoice ? JSON.parse(invoice) : [];

    }

    this.cartItemsCount = function(){

        this.getActiveInvoice().then(async (r) => {

            let totalItems = await this.getInvoice(r.id);
            document.getElementById("itensOnCarrinho").innerHTML = `\(${totalItems.length}\)`;

        })

    }

    this.disableAddToCartButton = function(idBtn){

        document.getElementById("addCartBtn"+idBtn).style.backgroundColor = "#28a7457a";
        document.getElementById("addCartBtn"+idBtn).classList.remove("bg-success");
        document.getElementById("addCartBtn"+idBtn).classList.add("no-action");
        document.getElementById("addCartSpinner"+idBtn).style.display = "inline-block";

    }

    this.enableAddToCartButton = function(idBtn){

        document.getElementById("addCartBtn"+idBtn).classList.add("bg-success");
        document.getElementById("addCartBtn"+idBtn).classList.remove("no-action");
        document.getElementById("addCartSpinner"+idBtn).style.display = "none";

    }

    this.markAddedToCart = function(idBtn){
        document.getElementById("addedToCartMark"+idBtn).style.display = "";
    }

    this.unmarkAddedToCart = function(idBtn){
        document.getElementById("addedToCartMark"+idBtn).style.display = "none";
    }

    this.getCurrentCartItems = function(){

        let curItems = localStorage.getItem("curCartItems");
        if(curItems){
            return JSON.parse(curItems);
        }
        return {};
    }

    this.addItemToCartItemsList = function(idItem){
        
        let itemsList = { ...this.getCurrentCartItems() };
        itemsList[idItem] = 0;
        localStorage.setItem("curCartItems",JSON.stringify(itemsList));

    }
    
    this.removeItemFromCartItemsList = function(idItem){
        
        let itemsList = { ...this.getCurrentCartItems() };
        let newItemList = JSON.stringify(itemsList);
        newItemList = newItemList.replace(`"${idItem}":0,`,"").replace(`,"${idItem}":0`,"").replace(`"${idItem}":0`,"");

        console.log({oldItem: itemsList, newItem: newItemList});

        //.replace(`"${idItem}":0,`,"").replace(`"${idItem}":0`,""); //Deleta o item se estives no fim do array
        localStorage.setItem("curCartItems",newItemList);

    }

    this.loadCartItemsList = function(){
        
        setTimeout(() => {
            let itemsList = { ...this.getCurrentCartItems() };
            Object.keys(itemsList).forEach(i => {
                //console.log(i);
                this.markAddedToCart(i);
            });
        },300);

    }

    this.clearCheckCartItemsList = function(){
        
        let itemsList = { ...this.getCurrentCartItems() };
        Object.keys(itemsList).forEach(i => {
            //console.log(i);
            this.unmarkAddedToCart(i);
        });
        
    }

    this.addToCart = async function(item, idItem){
     
        if(document.getElementById("addCartBtn"+idItem).classList.contains("no-action")){
            return false;
        }
        
        this.disableAddToCartButton(idItem);

        let removedEscapeObject = JSON.parse(unescape(item));
        let qtd = document.getElementById("quantity"+removedEscapeObject._id).value;
        removedEscapeObject.qtd = qtd || 1;

        this.getActiveInvoice().then(async (r) => {
            
            let activatedInvoice = await this.getInvoice(r.id);
            let itemToRemove = activatedInvoice.findIndex(it => it._id == removedEscapeObject._id);

            //console.log("Retorno: ", itemToRemove); //Check if the item exists already 
            if(itemToRemove >= 0){
                //Remove exissting Item to be replaced 
                activatedInvoice.splice(itemToRemove,1);
            }
            //Insert the replacing item
            activatedInvoice.push(removedEscapeObject);
            saveItem(r.id,activatedInvoice);
            setTimeout(() => {
                this.enableAddToCartButton(idItem);
                this.markAddedToCart(idItem);
            }, 400);

            this.addItemToCartItemsList(idItem);
    
        });
        
    }

    this.removeFromCart = function(item){

        this.getActiveInvoice().then(async (r) => {
            
            let activatedInvoice = await this.getInvoice(r.id);
            let itemToRemove = activatedInvoice.findIndex(it => it._id == item);
            
            //Remove exissting Item to be replaced 
            activatedInvoice.splice(itemToRemove,1);
            await saveItem(r.id,activatedInvoice);
            removeFromView(item);
        });

    }

    const removeFromView = function(idItem){
        document.getElementById(`item-on-cart-${idItem}`).style.display = "none";
        document.getElementById("addedToCartMark"+idItem).style.display = "none";
        carrinho.controller.removeItemFromCartItemsList(idItem);
    }

    this.cartItem = function(obj){

        let totalAmount = obj.preco * obj.qtd;
        this.totalAmount += parseInt(totalAmount);
        this.totalItems += parseInt(obj.qtd);

        return `
        
                <div class="cart-items bg-white position-relative border-bottom" id="item-on-cart-${obj._id}">

                    <button type="button" style="margin-right: 10px;" onclick="carrinho.controller.removeFromCart('${obj._id}')" class="close">
                        <span aria-hidden="true" style="color: red; font-size: 1.9rem;">&times;</span>
                    </button>

                    <a href="product_details.html" class="position-absolute">
                    <span class="badge badge-danger m-3">10%</span>
                    </a>
                    <div class="d-flex  align-items-center p-3">
                        <a href="product_details.html"><img src="${obj.imagem}" class="img-fluid"></a>
                        <span class="ml-3 text-dark text-decoration-none w-100">
                            <h5 class="mb-1">${obj.nome}</h5>
                            <p class="text-muted mb-2">${obj.preco} Kz / Unidade</p>
                            <div class="align-items-center">
                                <p class="total_price font-weight-bold m-0">Tot: ${(totalAmount)} Kz</p>
                                <form id='myform' class="cart-items-number d-flex ml-auto" style="padding-top: 7px; padding-left: 10px;" method='POST' action='#'>
                                    <span style="font-size:11px; font-weight:bold;">Qtd:</span> 
                                    &nbsp;<input style="max-width: 50%; margin-top:-7px;" type='text' id='quantity${obj._id}_' name='quantity${obj._id}_' value='${obj.qtd}' class='qty form-control' />
                                </form>
                            </div>
                        </span>
                    </div>
                </div>

        `

    }

    this.showAppropriateView = function(){

        carrinho.accessTry = true;
        if(__PROWEBAUTH__.isUserLogged() == null){
            document.getElementById("loginModalButton").click();            
            return;
        }

        carrinho.accessTry = false;          
        this.showCartOppened();

    }

    this.clearCart = function(){

        try{
            document.getElementById("itensOnCarrinho").innerHTML = "(0)";
        }catch(e){};

        document.getElementById("itensOnCart").innerHTML = "";

        document.getElementById("totalFactura").innerHTML = `0 Kz`;
        document.getElementById("endTotalAmount").innerHTML = `0 Kz`;
        document.getElementById("totalValor").innerHTML = `0 Kz`;
        document.getElementById("totalItems").innerHTML = `0 itens`
        user.controller.renderAddressOnMap();

    }

    this.openProductsList = function(){

        let isOppened = document.getElementById("collapseOne").classList.contains("show");
        if(!isOppened){
            document.getElementById("btnListProduct").click();
        }
    }

    this.showCartOppened = function(){

        this.totalAmount = 0;
        this.openProductsList();

        this.getActiveInvoice().then(async (r) => {

            let totalItems = document.getElementById("itensOnCarrinho").innerHTML.toString();
            totalItems = totalItems.replace("(","").replace(")","");

            document.getElementById("showCartItemCount").innerHTML = `${totalItems} `;
            let curInvoice = await this.getInvoice(r.id);

            if(curInvoice.length == 0){
                this.cartEmptyAlert();
                return false;
            }

            let itemsToShow = curInvoice.map(it => this.cartItem(it));
            
            document.getElementById("itensOnCart").innerHTML = itemsToShow;

            document.getElementById("totalFactura").innerHTML = `${this.totalAmount} Kz`;
            document.getElementById("endTotalAmount").innerHTML = `${this.totalAmount} Kz`;
            document.getElementById("totalValor").innerHTML = `${this.totalAmount} Kz`;
            document.getElementById("totalItems").innerHTML = `${this.totalItems} itens`
            document.getElementById("carrinhoModalButton").click();
            user.controller.renderAddressOnMap();

        })

    }


    const saveItem = async function(id,item){

        let newItem = JSON.stringify(item);
        await localStorage.setItem(id,newItem);
        (new CarrinhoViewController()).cartItemsCount();

    }

    this.renderCartView = function(){

        document.getElementById("cartViewContainer").innerHTML = this.cartView();
        __CALENDAR__.renderCalendarFor("orderScheduler", {
            timeLocalInputId : "deliveryTime",
            onDateSelect : (event, inst) => {
                
                let day = event.date.getDate();
                let month = parseInt(event.date.getMonth()) + 1;
                let year = event.date.getFullYear();
                
                this.curDateTime = `${day}/${month}/${year}`;

            }
        })

    }

    this.getDeliveryDateTime = function(){
        if(document.getElementById("deliveryTime").value == ""){
            return false;
        }
        return `${this.curDateTime} - ${document.getElementById("deliveryTime").value}`;
    }

    this.cartView = function(){

        let modal = `
        
        <div class="modal fade" id="carrinhoModal" tabindex="-1" role="dialog" aria-labelledby="carrinhoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="carrinhoModalLabel">Carrinho de compras</h5>
                        <button type="button" id="carModalCloseBtn" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">

                        <!-- CARRINHO CONTENT -->

                        <section class="py-4 osahan-main-body">
                            <div class="container">
                                <div class="row">
                                <div class="col-lg-8">
                                    <div class="accordion" id="accordionExample">
                                        <!-- cart items -->
                                        <div class="card border-0 osahan-accor rounded shadow-sm overflow-hidden">
                                            <!-- cart header -->
                                            <div class="card-header bg-white border-0 p-0" id="headingOne">
                                            <h2 class="mb-0">
                                            
                                                <button id="btnListProduct" class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    <span class="c-number">1</span> 
                                                    Carrinho (<span id="showCartItemCount">3</span> iten(s))
                                                </button>
                                            </h2>
                                            </div>
                                            <!-- body cart items -->
                                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                            <div class="card-body p-0 border-top">
                                                <div class="osahan-cart">

                                                    <div id="itensOnCart"></div>

                                                    <div onclick="carrinho.controller.getDeliveryAddress()">
                                                        <a href="#" class="text-decoration-none btn btn-block p-3" type="button" data-toggle="collapse" data-target="#collapsetwo" aria-expanded="true" aria-controls="collapsetwo">
                                                            <div class="rounded shadow bg-success d-flex align-items-center p-3 text-white">
                                                                <div class="more">
                                                                    <h6 class="m-0">Total da factura <span id="totalFactura"></span></h6>
                                                                    <p class="small m-0">Ver o endereço de recebimento</p>
                                                                </div>
                                                                <div class="ml-auto"><i class="icofont-simple-right"></i></div>
                                                            </div>
                                                        </a>
                                                    </div>

                                                </div>
                                            </div>
                                            </div>
                                        </div>

                                        <!-- cart address -->
                                        <div class="card border-0 osahan-accor rounded shadow-sm overflow-hidden mt-3">
                                            <!-- address header -->
                                            <div class="card-header bg-white border-0 p-0" id="headingtwo">
                                                <h2 class="mb-0">
                                                    <button onclick="carrinho.controller.getDeliveryAddress()" class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapsetwo" aria-expanded="true" aria-controls="collapsetwo">
                                                    
                                                        <span class="c-number">2</span> Endereço de entrega 
                                                        <!--
                                                        <a href="#"  data-toggle="modal" data-target="#exampleModal" class="text-decoration-none text-success ml-auto"> 
                                                            <i class="icofont-plus-circle mr-1"></i>Confirmar o endereço
                                                        </a>
                                                        -->
                                                    </button>
                                                </h2>
                                            </div>
                                            <!-- body address -->
                                            <div id="collapsetwo" class="collapse" aria-labelledby="headingtwo" data-parent="#accordionExample">
                                                <div class="card-body p-0 border-top">
                                                    <div class="osahan-order_address">
                                                        <div class="p-3 row">
                                                            <div class="custom-control col-lg-6 custom-radio mb-3 position-relative border-custom-radio">
                                                                <input type="radio" id="customRadioInline1" name="customRadioInline1" class="custom-control-input" checked>
                                                                <label class="custom-control-label w-100" for="customRadioInline1">
                                                                    <div>
                                                                        <div class="p-3 bg-white rounded shadow-sm w-100">
                                                                            
                                                                            <div class="d-flex align-items-center mb-2">
                                                                                <p class="mb-0 h6">Morada</p>
                                                                                <p class="mb-0 badge badge-success ml-auto"><i class="icofont-check-circled"></i> Confirmada</p>
                                                                            </div>
                                                                            <p class="small text-muted m-0"><span id="deliveryDistrict">(bairro)</span></p>
                                                                            <p class="small text-muted m-0">
                                                                                <span id="deliveryStreet">(rua)</span>, 
                                                                                <span id="deliveryHouse">(numero)</span>
                                                                            </p>
                                                                            <!--
                                                                            <p class="pt-2 m-0 text-right"><span class="small"><a href="#"  data-toggle="modal" data-target="#exampleModal" class="text-decoration-none text-info">Alterar</a></span></p>
                                                                            -->
                                                                            
                                                                        </div>
                                                                        <!-- <span class="btn btn-light border-top btn-lg btn-block">&nbsp;</span> -->
                                                                    </div>

                                                                </label>
                                                            </div>

                                                            <!--
                                                                O MAPA É RENDERIDAZO PELA CHAMADA DO
                                                                CÓDIGO user.controller.renderAddressOnMap()
                                                            -->
                                                            <div id="localMap"></div>

                                                            
                                                            <a href="#" class="btn btn-success btn-lg btn-block mt-3" type="button" data-toggle="collapse" data-target="#collapsethree" aria-expanded="true" aria-controls="collapsethree">
                                                                Selecionar date de entrega
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- cart delivery -->
                                        <div class="card border-0 osahan-accor rounded shadow-sm overflow-hidden mt-3">
                                            
                                            <!-- delivery header -->
                                            <div class="card-header bg-white border-0 p-0" id="headingthree">
                                                <h2 class="mb-0">
                                                    <button id="dateDeliverySelectBtn" class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapsethree" aria-expanded="true" aria-controls="collapsethree">
                                                        <span class="c-number">3</span> Data de entrega
                                                    </button>
                                                </h2>
                                            </div>

                                            <!-- body delivery --> 
                                            <div id="collapsethree" class="collapse" aria-labelledby="headingthree" data-parent="#accordionExample">
                                                <div class="card-body p-0 border-top">
                                                    <div class="osahan-order_address">
                                                        <div class="schedule" id="orderScheduler"></div>
                                                        <div class="text-center mb-1 py-2">
                                                            <!-- <p class="display-2"><i class="icofont-ui-calendar text-success"></i></p> -->
                                                            <input id="deliveryTime" style="width:98%; margin: 0 auto;" mbsc-input data-input-style="outline" data-label-style="stacked" class="form-control" placeholder="Selecione a hora" />
                                                            
                                                            <input id="delivaryDateTime" type="hidden" />
                                                        </div>
                                                    </div>
                                                    <div class="p-3">
                                                        <!--
                                                        <a href="#" class="btn btn-success btn-lg btn-block" type="button" data-toggle="collapse" data-target="#collapsefour" aria-expanded="true" aria-controls="collapsefour">
                                                            Agendar
                                                        </a>
                                                        -->
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                        <!-- cart payment -->
                                        
                                        <div class="card border-0 osahan-accor rounded shadow-sm overflow-hidden mt-3">
                                            
                                            <div class="card-header bg-white border-0 p-0" id="headingfour">
                                            <!--
                                            <h2 class="mb-0">
                                                <button class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapsefour" aria-expanded="true" aria-controls="collapsefour">
                                                <span class="c-number">4</span> Pagamento
                                                </button>
                                            </h2>
                                            </div>
                                            
                                            <div id="collapsefour" class="collapse" aria-labelledby="headingfour" data-parent="#accordionExample">
                                            <div class="card-body px-3 pb-3 pt-1 border-top">
                                                <div class="schedule">
                                                    <ul class="nav nav-tabs justify-content-center nav-fill" id="myTab" role="tablist">
                                                        <li class="nav-item" role="presentation">
                                                        <a class="nav-link active text-dark" id="credit-tab" data-toggle="tab" href="#credit" role="tab" aria-controls="credit"
                                                            aria-selected="true">
                                                            <p class="mb-0 font-weight-bold"><i class="icofont-credit-card mr-2"></i> Credit/Debit Card</p>
                                                        </a>
                                                        </li>
                                                        <li class="nav-item" role="presentation">
                                                        <a class="nav-link text-dark" id="banking-tab" data-toggle="tab" href="#banking" role="tab" aria-controls="banking"
                                                            aria-selected="false">
                                                            <p class="mb-0 font-weight-bold"><i class="icofont-globe mr-2"></i> Net Banking</p>
                                                        </a>
                                                        </li>
                                                        <li class="nav-item" role="presentation">
                                                        <a class="nav-link text-dark" id="cash-tab" data-toggle="tab" href="#cash" role="tab" aria-controls="cash"
                                                            aria-selected="false">
                                                            <p class="mb-0 font-weight-bold"><i class="icofont-dollar mr-2"></i> Cash on Delivery</p>
                                                        </a>
                                                        </li>
                                                    </ul>
                                                    <div class="tab-content bg-white" id="myTabContent">
                                                        <div class="tab-pane fade show active" id="credit" role="tabpanel" aria-labelledby="credit-tab">
                                                        <div class="osahan-card-body pt-3">
                                                            <h6 class="m-0">Add new card</h6>
                                                            <p class="small">WE ACCEPT <span class="osahan-card ml-2 font-weight-bold">( Master Card / Visa Card / Rupay )</span></p>
                                                            <form>
                                                                <div class="form-row">
                                                                    <div class="col-md-12 form-group">
                                                                    <label class="form-label font-weight-bold small">Card number</label>
                                                                    <div class="input-group">
                                                                        <input placeholder="Card number" type="number" class="form-control">
                                                                        <div class="input-group-append"><button id="button-addon2" type="button" class="btn btn-outline-secondary"><i class="icofont-credit-card"></i></button></div>
                                                                    </div>
                                                                    </div>
                                                                    <div class="col-md-8 form-group"><label class="form-label font-weight-bold small">Valid through(MM/YY)</label><input placeholder="Enter Valid through(MM/YY)" type="number" class="form-control"></div>
                                                                    <div class="col-md-4 form-group"><label class="form-label font-weight-bold small">CVV</label><input placeholder="Enter CVV Number" type="number" class="form-control"></div>
                                                                    <div class="col-md-12 form-group"><label class="form-label font-weight-bold small">Name on card</label><input placeholder="Enter Card number" type="text" class="form-control"></div>
                                                                    <div class="col-md-12 form-group">
                                                                    <div class="custom-control custom-checkbox">
                                                                        <input type="checkbox" id="custom-checkbox1" class="custom-control-input">
                                                                        <label title="" type="checkbox" for="custom-checkbox1" class="custom-control-label small pt-1">Securely save this card for a faster checkout next time.</label>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        </div>
                                                        <div class="tab-pane fade" id="banking" role="tabpanel" aria-labelledby="banking-tab">
                                                        <div class="osahan-card-body pt-3">
                                                            <form>
                                                                <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
                                                                    <label class="btn btn-outline-secondary active">
                                                                    <input type="radio" name="options" id="option1" checked=""> HDFC
                                                                    </label>
                                                                    <label class="btn btn-outline-secondary">
                                                                    <input type="radio" name="options" id="option2"> ICICI
                                                                    </label>
                                                                    <label class="btn btn-outline-secondary">
                                                                    <input type="radio" name="options" id="option3"> AXIS
                                                                    </label>
                                                                </div>
                                                                <div class="form-row pt-3">
                                                                    <div class="col-md-12 form-group">
                                                                    <label class="form-label small font-weight-bold">Select Bank</label><br>
                                                                    <select class="custom-select form-control">
                                                                        <option>Bank</option>
                                                                        <option>KOTAK</option>
                                                                        <option>SBI</option>
                                                                        <option>UCO</option>
                                                                    </select>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        </div>
                                                        <div class="tab-pane fade" id="cash" role="tabpanel" aria-labelledby="cash-tab">
                                                        <div class="custom-control custom-checkbox pt-3">
                                                            <input type="checkbox" class="custom-control-input" id="customControlAutosizing">
                                                            <label class="custom-control-label" for="customControlAutosizing">
                                                                <b>Cash</b><br>
                                                                <p class="small text-muted m-0">Please keep exact change handy to help us serve you better</p>
                                                            </label>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href="checkout.html" class="btn btn-success btn-lg btn-block mt-3" type="button">Continue</a>
                                            </div>
                                            -->
                                            </div>
                                        </div>
                                        

                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="sticky_sidebar">
                                        <div class="bg-white rounded overflow-hidden shadow-sm mb-3 checkout-sidebar">
                                            <div class="d-flex align-items-center osahan-cart-item-profile border-bottom bg-white p-3">
                                            <img alt="osahan" src="img/starter1.jpg" class="mr-3 rounded-circle img-fluid">
                                            <div class="d-flex flex-column">
                                                <h6 class="mb-1 font-weight-bold">PPRIMO</h6>
                                                <p class="mb-0 small text-muted"><i class="feather-map-pin"></i> FAZEMOS POR SI </p>
                                            </div>
                                            </div>
                                            <div>
                                            <div class="bg-white p-3 clearfix">
                                                <p class="font-weight-bold small mb-2">Detalhe de encomenda</p>
                                                <p class="mb-1">
                                                    Total produtos 
                                                    <span class="small text-muted"><span id="totalItems">(3 item)</span></span> 
                                                    <span class="float-right text-dark" id="totalValor"></span>
                                                </p>
                                                <!-- <p class="mb-1">Store Charges <span class="float-right text-dark">$62.8</span></p> -->
                                                <p class="mb-3">Taxa de entrega <span  data-toggle="tooltip" data-placement="top" title="Delivery partner fee - $3" class="text-info ml-1"><i class="icofont-info-circle"></i></span><span class="float-right text-dark">Gratis</span></p>
                                                
                                                <!--
                                                <h6 class="mb-0 text-success">Total desconto<span class="float-right text-success">$1884</span></h6>
                                                -->
                                            </div>
                                                <div class="p-3 border-top">
                                                    <h5 class="mb-0">A PAGAR  <span class="float-right text-danger" id="endTotalAmount">$1329</span></h5>
                                                </div>

                                                <div class="p-3">
                                                    <a href="#" onclick="carrinho.controller.checkout()" class="btn btn-success btn-lg btn-block" type="button">
                                                        <i class="text-white icofont-tick-mark" style="color: white; font-size: 14px;"></i> &nbsp;Finalizar e enviar o pedido
                                                    </a>
                                                </div>


                                            </div>
                                        </div>
                                        <!-- <p class="text-success text-center">Your Total Savings on this order $8.52</p> -->
                                    </div>
                                </div>
                                </div>
                            </div>
                        </section>

                    </div>
                
                </div>
            </div>
        </div>
        `

        return modal;

    }


    this.cartButton = function(){

        let modalTarget = ""; 
        if(__PROWEBAUTH__.isUserLogged()){
            modalTarget = `data-target="#carrinhoModal"`;
        }

        let button = `
        
            <a href="#" data-toggle="modal" ${modalTarget} class="text-decoration-none text-white">
                <i class="text-white icofont-shopping-cart" style="color: white; font-size: 14px;"></i> 
                <span id="itensOnCarrinho">
                ( <span>...</span> )
                </span>
            </a>

        `;

    }


    this.getDeliveryAddress = async function(){

        (new UserViewController()).getAddress().then(fullAddress => {

            let address = fullAddress.endereco;

            document.getElementById("deliveryDistrict").innerHTML = address.destrito;
            document.getElementById("deliveryStreet").innerHTML = address.rua;
            document.getElementById("deliveryHouse").innerHTML = address.casa;
    

        });
        
    }


    this.closeInvice = function(id){

        const oldStatus = `{"id":${id},"active":true}`;
        const newStatus = `{"id":${id},"active":false}`;
        
        console.log("Before: ", oldStatus);
        console.log("After: ", newStatus);

        let invoice = localStorage.getItem("invoices_").replace(oldStatus,newStatus);
        localStorage.setItem("invoices_",invoice);
        this.clearCart();

    }

    this.checkoutProcessFeedback = function(){

        document.getElementById("carModalCloseBtn").click();

        __VIEW_UTILS__.showSpinnerWithNoEscape({
            feedback: true,
            title: "Enviando minha solicitação",
            message1: `Solicitação enviada com sucesso`,
            failMessage: navigator.onLine ? `Sua internet está desligada, precisa ligar para finalizar e enviar a solicitação` : `Não foi possível enviar a solicitação, verifique a sua conexão de internet e tente navamente`
        });

    }

    this.closeCartView = function(){
        document.getElementById("carModalCloseBtn").click();
    }

    this.noDeliveryDateAlert = function(){
        this.closeCartView();
        __VIEW_UTILS__.showModalAlert(
                {
                    failMessage: "Preencha a data e hora de entrega", 
                    title: "Falha ao finalizar",
                    onOk: () => {
                        document.getElementById("carrinhoModalButton").click();
                        document.getElementById("dateDeliverySelectBtn").click();
                    }
                })
    }

    this.cartEmptyAlert = function(){

        __VIEW_UTILS__.showModalAlert(
            {
                failMessage: "O carrinho de compras está vazio", 
                title: "Sem produtos",
                onOk: () => {
                    document.getElementById("carrinhoModalButton").click();
                    document.getElementById("dateDeliverySelectBtn").click();
                }
            })
    }

    this.clearCartItemList = function(){
        
        this.clearCheckCartItemsList();
        localStorage.setItem("curCartItems","{}");
        
    }

    this.checkout = function(){

        this.getActiveInvoice().then(async (r) => {

            const deliveryDate = this.getDeliveryDateTime();
            const invoice = await this.getInvoice(r.id);

            if(!deliveryDate){
                this.noDeliveryDateAlert();
                return false;
            }

            if(invoice.length == 0){
                this.cartEmptyAlert();
                return false;
            }

            const loggedUser = (new UserViewController()).getLoggedUser();
            const newStateInvoice = [...invoice];
            const data = JSON.stringify({userId: loggedUser.id, cartItems: invoice, deliveryDate});
            
            this.checkoutProcessFeedback();
            (new ProwebRequest()).postJSON(`${carrinho.baseUrl}`,data,(res) => {

                try{
                    let response = JSON.parse(res);
                    if(response.result.ok){
    
                        newStateInvoice.unshift({"details": {"status": "close", "deliveryDate": deliveryDate, "onlineId": response.obj.insertedId, "date" : new Date()}});
                        localStorage.setItem(r.id,JSON.stringify(newStateInvoice));
                        this.closeInvice(r.id);
                        __VIEW_UTILS__.showSpinnerFeedback();
                        document.getElementById("deliveryTime").value = "";
                        this.clearCartItemList();
                        return true;
                        
                    }
                }catch(e){ console.log("Houve um erro: ", e);}
                __VIEW_UTILS__.showSpinnerFail();
                document.getElementById("deliveryTime").value = "";
                this.clearCartItemList();
                
            });
                        
        })

    }

    return this;

}