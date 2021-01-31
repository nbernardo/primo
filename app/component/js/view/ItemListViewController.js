itemList = {
    controller: new ItemListViewController(),
    baseUrl: `${BASE_IP}:4002/catalog/item`,
    editingObject: null,
    newItemObject : null,
    productEdited: false,
    savingProductImg : null
}



function ItemListViewController(){

    this.renderListItems = function(){

        const url = `${itemList.baseUrl}`;
        (new ProwebRequest()).getRequest(url,null, async (res, xhr) => {
            console.log("Valor é: ", res);
            const response = JSON.parse(res);
            const dados = await response.data.map(i => {
                if(i.available) 
                    return this.generateItem(i);
            });
            document.getElementById("vitrine-listItems").innerHTML = dados.join("");
            carrinho.controller.loadCartItemsList();

        });

    }

    this.renderListItemsByType = function(type){

        __VIEW_UTILS__.showSpinnerWithNoEscape({
            feedback: true,
            title: "Buscando online...",
            message1: `Aguarde...`
        });

        const url = `${itemList.baseUrl}/type/${type}`;
        (new ProwebRequest()).getRequest(url,null, async (res, xhr) => {
            console.log("Valor é: ", res);
            const response = JSON.parse(res);
            const dados = await response.data.map(i => this.generateItem(i, 'filter'));
            let result = dados.join("");
            
            let content = `
            <div class="pick_today">
                <div class="row">${result}</div>
            </div>
            `
            __VIEW_UTILS__.hideSpinner();
            __VIEW_UTILS__.showEmptyModel({content, title: "Lista de produtos", removePadding: true, delay: 1000});


        });

    }

    this.mm = function(obj){

        this.nn = obj.nome;
        return this;

    }

    this.generateListItems = function(){

        let items = "";
        for(x = 0; x < 4; x++){
            items += this.generateItem({id: (x+1)});
        }

        return items;

    }


    this.addQty = function(id){

        let qtyElm = document.getElementById(`${id}`);
        let curQty = parseInt(qtyElm.value);
        qtyElm.value = curQty + 1;

    }

    this.reduceQty = function(id){

        let qtyElm = document.getElementById(`${id}`);
        if(qtyElm.value == 1) return false;
        let curQty = parseInt(qtyElm.value);
        qtyElm.value = curQty - 1;

    }

    //(new ItemListViewController()).reduceQty();
    //(new ItemListViewController()).addQty();

    //itemList.controller.reduceQty();

    this.generateItem = function(obj, perspective, imagePath){

        let nome = obj.nome || "Nome produto";
        let imagem = obj.imagem || "img/listing/v8.jpg";
        let preco = obj.preco || "0.5";
        let id = obj._id || Math.random();

        let linkObject = JSON.stringify(obj);
        let transformLinkObject = escape(linkObject);

        let addButton = `

            <p  id="addCartBtn${id}"
                onclick=carrinho.controller.addToCart('${transformLinkObject}','${id}');
                class="objectAddLink bg-success text-white py-2 px-2 mb-0 rounded small">
                Adicionar 
                <i 
                    id="addedToCartMark${id}"
                    class="text-white icofont-tick-mark" 
                    style="display:none; color: white; font-size: 20px; position: absolute;right: 30px;margin-top: -1px;">
                </i>
                <span id="addCartSpinner${id}" class="prowebSpinnintAnimation littleSpinner"></span>
                
            </p>
        
        `;

        let unAvailableButton = `

            <p  id="addCartBtn${id}"
                class="objectAddLink bg-warning text-white py-2 px-2 mb-0 rounded small">
                Disponível em breve 
                <i 
                    id="addedToCartMark${id}"
                    class="text-white icofont-tick-mark" 
                    style="display:none; color: white; font-size: 20px; position: absolute;right: 30px;margin-top: -1px;">
                </i>
                <span id="addCartSpinner${id}" class="prowebSpinnintAnimation littleSpinner"></span>
                
            </p>
        
        `;


        let viewDetailsLink = `
            <span onclick="carrinho.controller.showProductDetail('${id}','${obj.type}')">
                <img src="${imagem}" class="img-fluid item-img w-100 mb-3">
                <h6>${nome}</h6>
            </span>
        `;

        let viewDetailsFromFilterLink = `
            <span onclick="carrinho.controller.showProductDetailFromFilter('${id}','${obj.type}')">
                <img src="${imagem}" class="img-fluid item-img w-100 mb-3">
                <h6>${nome}</h6>
            </span>
        `;


        return `
        
                <div class="col-6 col-md-3 mb-3">
                    <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                        <div class="list-card-image">
                            <span class="text-dark">
                                <!-- 
                                    <div class="member-plan position-absolute"><span class="badge m-3 badge-warning">15%</span></div>
                                -->
                                <div class="p-3"> 
                                
                                    ${perspective == 'filter' ? viewDetailsFromFilterLink : viewDetailsLink}

                                    <div class="d-flex align-items-center">
                                    <h6 class="price m-0 text-success">${preco} Kz</h6> <a data-toggle="collapse" href="#collapseExample${id}" role="button" aria-expanded="false" aria-controls="collapseExample7" class="btn btn-success btn-sm ml-auto">+</a>
                                    
                                    <div class="collapse qty_show" id="collapseExample${id}">
                                        <div> 
                                            <span class="ml-auto" href="#">
                                                <form id='myform' class="cart-items-number d-flex" method='POST' action='#'>
                                                <input type='button' value='-' class='qtyminus btn btn-success btn-sm' onclick="itemList.controller.reduceQty('quantity${id}');" />
                                                <input type='text' name='quantity${id}' id='quantity${id}' value='1' class='form-control' />
                                                <input type='button' value='+' class='qtyplus btn btn-success btn-sm' onclick="itemList.controller.addQty('quantity${id}');" />
                                                </form>   
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                    <br/>
                                    <!-- LOCAL ADD BUTTON -->
                                    ${obj.available ? addButton : unAvailableButton}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

        `;

    } 



    this.generateItemToAdmin = function(obj, perspective, imagePath){

        let nome = obj.nome || "Nome produto";
        let imagem = obj.imagem || "img/listing/v8.jpg";
        let preco = obj.preco || "0.5";
        let id = obj._id || Math.random();

        let linkObject = JSON.stringify(obj);
        let transformLinkObject = escape(linkObject);

        let addButton = `
                <p  id="addCartBtn${id}"
                    class="objectAddLink bg-success text-white py-2 px-2 mb-0 rounded small">
                    Disponível 
                    <span id="addCartSpinner${id}" class="prowebSpinnintAnimation littleSpinner"></span>
                    
                </p>
        `;

        let unAvailableButton = `
            <p  id="addCartBtn${id}"
                class="objectAddLink bg-warning text-white py-2 px-2 mb-0 rounded small">
                Disponível em breve 
                <span id="addCartSpinner${id}" class="prowebSpinnintAnimation littleSpinner"></span>
                
            </p>
        `;


        let viewDetailsLink = `
            <span onclick="carrinho.controller.showProductDetail('${id}','${obj.type}')">
                <img src="${imagem}" class="img-fluid item-img w-100 mb-3">
                <h6 id="itemNomeProduto${id}">${nome}</h6>
            </span>
        `;


        let editButton = `
            <p  id="editingBojectBtn${id}" style="font-size:1rem"
                onclick=itemList.controller.editProduct('${escape(JSON.stringify(obj))}');
                class="objectAddLink  py-2 px-2 mb-0 rounded small">
                 
                <i 
                    id="addedToCartMark${id}"
                    class="icofont-edit" 
                    style="color: black;">
                </i>
                Editar
            </p>
        `;        


        return `
        
                <div class="col-6 col-md-3 mb-3">
                    <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                        <div class="list-card-image">
                            <span class="text-dark">
                                <!-- 
                                    <div class="member-plan position-absolute"><span class="badge m-3 badge-warning">15%</span></div>
                                -->
                                <div class="p-3"> 
                                    ${viewDetailsLink}
                                    <div class="d-flex align-items-center">
                                    <h6 class="price m-0 text-success" id="itemPrecoProduto${id}">${preco} Kz</h6>                                     
                                </div>
                                    <br/>
                                    <!-- LOCAL ADD BUTTON -->
                                    ${obj.available ? addButton : unAvailableButton}
                                    ${editButton}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

        `;

    }


    this.editProduct = function(obj){

        document.getElementById("imagemProduto").classList.remove("required");
        try{
            document.getElementById("imagemProduto").parentNode.style.display = "none";
        }catch(e){}

        let curItem = JSON.parse(unescape(obj));
        this.clearProductForm();
        itemList.editingObject = curItem;

        let formContent = document.getElementById("productForm").innerHTML;
        document.getElementById("prevAdminContent").innerHTML = document.getElementById("epmtyModalBody").innerHTML;
        document.getElementById("epmtyModalBody").innerHTML = formContent;

        document.getElementById("nomeProduto").value = curItem.nome;
        document.getElementById("precoProduto").value = curItem.preco;
        document.getElementById("pontosProduto").value = curItem.pontos;
        document.getElementById("categoriaProduto").value = curItem.type;
        document.getElementById("idProduto").value = curItem._id;

        if(curItem.available){
            document.getElementsByClassName("availableProduct")[0].checked = true;
        }else
            document.getElementsByClassName("availableProduct")[1].checked = true;


    }

    this.clearProductForm = function(){

        document.getElementById("nomeProduto").value = "";
        document.getElementById("precoProduto").value = "";
        document.getElementById("pontosProduto").value = "";
        document.getElementById("categoriaProduto").value = "";
        document.getElementsByClassName("availableProduct")[0].checked = false;
        document.getElementsByClassName("availableProduct")[1].checked = false;

    }


    this.goBackToItemList = function(){

        document.getElementById("epmtyModalBody").innerHTML = document.getElementById("prevAdminContent").innerHTML;

        console.log("Os dois: ",itemList.newItemObject);

        try{

            setTimeout(() => {
                document.getElementById(`editingBojectBtn${document.getElementById("idProduto").value}`).addEventListener('click', () => {
    
                    let itemObj = {
                        ...itemList.editingObject,
                        nome: itemList.newItemObject.nomeProduto,
                        preco: itemList.newItemObject.precoProduto,
                    }
                    itemList.controller.editProduct(escape(JSON.stringify(itemObj)));
                    
                })
            },200);

        }catch(e){
            
        }

    }
    

    this.updateEditingProduct = function(callback){

        let productInputValidation = (new ProwebValidation()).validateRequired("entity-product");
        console.log("Passou no: ",productInputValidation);
        if(productInputValidation){

            let available = document.getElementsByClassName("availableProduct")[0].checked;
            let idProduct = document.getElementById("idProduto").value;

            let itemObj = {
                nomeProduto: document.getElementById("nomeProduto").value,
                precoProduto : document.getElementById("precoProduto").value,
                categoriaProduto : document.getElementById("categoriaProduto").value,
                pontosProduto : document.getElementById("pontosProduto").value,
                available
            }
            let data = JSON.stringify(itemObj);

            (new ProwebRequest()).putJSON(`${itemList.baseUrl}/${idProduct}`,data,(res, xhr) => {

                console.log("Actualizando: ", res);
                console.log("O botão: ", `editingBojectBtn${idProduct}`);

                this.resetItemForm();
                callback();
                document.getElementById(`itemNomeProduto${idProduct}`).innerHTML = itemObj.nomeProduto;
                document.getElementById(`itemPrecoProduto${idProduct}`).innerHTML = itemObj.precoProduto;
                itemList.newItemObject = {
                    ...itemObj,
                    idProduct
                };
    
            });

        }
        
    }    


    this.resetItemForm = function(){

        document.getElementById("nomeProduto").value = "";
        document.getElementById("precoProduto").value = "";
        document.getElementById("categoriaProduto").value = "";
        document.getElementById("pontosProduto").value = "";

    }


    this.selectItemImg = function(){

        let imgContainer = document.getElementById("imagemProduto");
        let imgReader = new FileReader();

        imgReader.onload = function(){

            itemList.savingProductImg = imgReader.result;
            //console.log(imgReader.result);

        }

        imgReader.readAsDataURL(imgContainer.files[0]);

    }


    this.savegProduct = function(callback){

        let productInputValidation = (new ProwebValidation()).validateRequired("entity-product");
        console.log("Passou no: ",productInputValidation);
        if(productInputValidation){

            let available = document.getElementsByClassName("availableProduct")[0].checked;

            let itemObj = {
                nome: document.getElementById("nomeProduto").value,
                preco : document.getElementById("precoProduto").value,
                type : document.getElementById("categoriaProduto").value,
                pontos : document.getElementById("pontosProduto").value,
                imagem: itemList.savingProductImg,
                available
            }
            let data = JSON.stringify(itemObj);

            (new ProwebRequest()).postJSON(`${itemList.baseUrl}`,data,(res, xhr) => {

                callback(res, xhr);
                this.resetItemForm();
    
            });
            return;

        }
        __VIEW_UTILS__.hideSpinner();

    }
    

    return this;

}