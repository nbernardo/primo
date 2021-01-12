const carrinho = {
    controller: new CarrinhoViewController(),
}

function CarrinhoViewController(){

    this.curDateTime = "";
    this.itemsOnCart = [];
    this.invoicesObj = [];

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

    this.getInvoice = function(id){

        let invoice = localStorage.getItem(id);
        return invoice ? JSON.parse(invoice) : [];

    }

    this.cartItemsCount = function(){

        this.getActiveInvoice().then(r => {

            let totalItems = this.getInvoice(r.id);
            document.getElementById("itensOnCarrinho").innerHTML = `\(${totalItems.length}\)`;

        })

    }

    this.addToCart = function(item){
     
        let removedEscapeObject = JSON.parse(unescape(item));
        
        this.getActiveInvoice().then(r => {

            const {id, active} = r;

            let activatedInvoice = this.getInvoice(id);
            activatedInvoice.push(removedEscapeObject);
            saveItem(id,activatedInvoice);
    
        });
        
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
        return `${this.curDateTime} - ${document.getElementById("deliveryTime").value}`;
    }

    this.cartView = function(){

        let modal = `
        
        <div class="modal fade" id="carrinhoModal" tabindex="-1" role="dialog" aria-labelledby="carrinhoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="carrinhoModalLabel">Carrinho de compras</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                                                <button class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                <span class="c-number">1</span> Carrinho (3 iten(s))
                                                </button>
                                            </h2>
                                            </div>
                                            <!-- body cart items -->
                                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                            <div class="card-body p-0 border-top">
                                                <div class="osahan-cart">

                                                    <div class="cart-items bg-white position-relative border-bottom">
                                                        <a href="product_details.html" class="position-absolute">
                                                        <span class="badge badge-danger m-3">10%</span>
                                                        </a>
                                                        <div class="d-flex  align-items-center p-3">
                                                        <a href="product_details.html"><img src="img/cart/g1.png" class="img-fluid"></a>
                                                        <a href="product_details.html" class="ml-3 text-dark text-decoration-none w-100">
                                                            <h5 class="mb-1">Bread</h5>
                                                            <p class="text-muted mb-2"><del class="text-success mr-1">$1.20kg</del> $0.98/kg</p>
                                                            <div class="d-flex align-items-center">
                                                                <p class="total_price font-weight-bold m-0">$2.82</p>
                                                                <form id='myform' class="cart-items-number d-flex ml-auto" method='POST' action='#'>
                                                                    <input type='button' value='-' class='qtyminus btn btn-success btn-sm' field='quantity' />
                                                                    <input type='text' name='quantity' value='1' class='qty form-control' />
                                                                    <input type='button' value='+' class='qtyplus btn btn-success btn-sm' field='quantity' />
                                                                </form>
                                                            </div>
                                                        </a>
                                                        </div>
                                                    </div>

                                                    <div class="cart-items bg-white position-relative border-bottom">
                                                        <div class="d-flex  align-items-center p-3">
                                                        <a href="product_details.html"><img src="img/cart/g2.png" class="img-fluid"></a>
                                                        <a href="product_details.html" class="ml-3 text-dark text-decoration-none w-100">
                                                            <h5 class="mb-1">Spinach</h5>
                                                            <p class="text-muted mb-2"><del class="text-success mr-1">$1.20kg</del> $0.98/kg</p>
                                                            <div class="d-flex align-items-center">
                                                                <p class="total_price font-weight-bold m-0">$3.82</p>
                                                                <form id='myform' class="cart-items-number d-flex ml-auto" method='POST' action='#'>
                                                                    <input type='button' value='-' class='qtyminus btn btn-success btn-sm' field='quantity' />
                                                                    <input type='text' name='quantity' value='1' class='qty form-control' />
                                                                    <input type='button' value='+' class='qtyplus btn btn-success btn-sm' field='quantity' />
                                                                </form>
                                                            </div>
                                                        </a>
                                                        </div>
                                                    </div>


                                                    <div>
                                                        <a href="#" class="text-decoration-none btn btn-block p-3" type="button" data-toggle="collapse" data-target="#collapsetwo" aria-expanded="true" aria-controls="collapsetwo">
                                                        <div class="rounded shadow bg-success d-flex align-items-center p-3 text-white">
                                                            <div class="more">
                                                                <h6 class="m-0">Total da factura $8.52</h6>
                                                                <p class="small m-0">Continuar</p>
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
                                                    <button class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapsetwo" aria-expanded="true" aria-controls="collapsetwo">
                                                    <span class="c-number">2</span> Order Address <a href="#"  data-toggle="modal" data-target="#exampleModal" class="text-decoration-none text-success ml-auto"> <i class="icofont-plus-circle mr-1"></i>Confirmar o endereço</a>
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
                                                                            <p class="small text-muted m-0">1001 Veterans Blvd</p>
                                                                            <p class="small text-muted m-0">Benfica, CA 94063</p>
                                                                            <p class="pt-2 m-0 text-right"><span class="small"><a href="#"  data-toggle="modal" data-target="#exampleModal" class="text-decoration-none text-info">Alterar</a></span></p>
                                                                        </div>
                                                                        <span class="btn btn-light border-top btn-lg btn-block">
                                                                        &nbsp;
                                                                        </span>
                                                                    </div>
                                                                </label>
                                                            </div>

                                                            
                                                            <a href="#" class="btn btn-success btn-lg btn-block mt-3" type="button" data-toggle="collapse" data-target="#collapsethree" aria-expanded="true" aria-controls="collapsethree">Continue</a>
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
                                                    <button class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapsethree" aria-expanded="true" aria-controls="collapsethree">
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
                                                        <a href="#" class="btn btn-success btn-lg btn-block" type="button" data-toggle="collapse" data-target="#collapsefour" aria-expanded="true" aria-controls="collapsefour">Agendar</a>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                        <!-- cart payment -->
                                        <div class="card border-0 osahan-accor rounded shadow-sm overflow-hidden mt-3">
                                            <!-- payment header -->
                                            <div class="card-header bg-white border-0 p-0" id="headingfour">
                                            <h2 class="mb-0">
                                                <button class="btn d-flex align-items-center bg-white btn-block text-left btn-lg h5 px-3 py-4 m-0" type="button" data-toggle="collapse" data-target="#collapsefour" aria-expanded="true" aria-controls="collapsefour">
                                                <span class="c-number">4</span> Payment
                                                </button>
                                            </h2>
                                            </div>
                                            <!-- body payment -->
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
                                                <h6 class="mb-1 font-weight-bold">Osahan Fresh Store</h6>
                                                <p class="mb-0 small text-muted"><i class="feather-map-pin"></i> 2036 2ND AVE, NEW YORK, NY 10029</p>
                                            </div>
                                            </div>
                                            <div>
                                            <div class="bg-white p-3 clearfix">
                                                <p class="font-weight-bold small mb-2">Bill Details</p>
                                                <p class="mb-1">Item Total <span class="small text-muted">(3 item)</span> <span class="float-right text-dark">$3140</span></p>
                                                <p class="mb-1">Store Charges <span class="float-right text-dark">$62.8</span></p>
                                                <p class="mb-3">Delivery Fee <span  data-toggle="tooltip" data-placement="top" title="Delivery partner fee - $3" class="text-info ml-1"><i class="icofont-info-circle"></i></span><span class="float-right text-dark">$10</span></p>
                                                <h6 class="mb-0 text-success">Total Discount<span class="float-right text-success">$1884</span></h6>
                                            </div>
                                            <div class="p-3 border-top">
                                                <h5 class="mb-0">TO PAY  <span class="float-right text-danger">$1329</span></h5>
                                            </div>
                                            </div>
                                        </div>
                                        <p class="text-success text-center">Your Total Savings on this order $8.52</p>
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

    return this;

}