itemList = {
    controller: new ItemListViewController(),
}



function ItemListViewController(){

    this.renderListItems = function(){

        document.getElementById("vitrine-listItems").innerHTML = this.generateListItems();

    }


    this.generateListItems = function(){

        let items = "";
        for(x = 0; x < 4; x++){
            items += this.generateItem({id: (x+1)});
        }

        return items;

    }


    this.generateItem = function(obj){

        let nome = obj.nome || "Nome produto";
        let imagem = obj.imagem || "img/listing/v8.jpg";
        let preco = obj.preco || "0.5";
        let id = obj.id || Math.random();

        return `
        
                <div class="col-6 col-md-3 mb-3">
                    <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                        <div class="list-card-image">
                            <a href="product_details.html" class="text-dark">
                                <!-- 
                                    <div class="member-plan position-absolute"><span class="badge m-3 badge-warning">15%</span></div>
                                -->
                                <div class="p-3"> <img src="${imagem}" class="img-fluid item-img w-100 mb-3">
                                    <h6>${nome}</h6>
                                    <div class="d-flex align-items-center">
                                    <h6 class="price m-0 text-success">${preco} Kz</h6> <a data-toggle="collapse" href="#collapseExample${id}" role="button" aria-expanded="false" aria-controls="collapseExample7" class="btn btn-success btn-sm ml-auto">+</a>
                                    <div class="collapse qty_show" id="collapseExample${id}">
                                        <div> 
                                            <span class="ml-auto" href="#">
                                                <form id='myform' class="cart-items-number d-flex" method='POST' action='#'>
                                                <input type='button' value='-' class='qtyminus btn btn-success btn-sm' field='quantity${id}' />
                                                <input type='text' name='quantity${id}' value='1' class='qty form-control' />
                                                <input type='button' value='+' class='qtyplus btn btn-success btn-sm' field='quantity${id}' />
                                                </form>   
                                            </span>
                                        </div>
                                    </div>
                                    </div>
                                    <br/>
                                    <p class="bg-success text-white py-2 px-2 mb-0 rounded small">Adicionar</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

        `;

    }

    return this;

}