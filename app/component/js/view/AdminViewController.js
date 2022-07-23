const admin = {
    controller: new AdminViewController(),
    productEditing: false,
}




function AdminViewController(){


    this.hideProductSaveSuccess = function(){
        document.getElementById("productUpdateOk").style.display = "none";
    }

    this.showProductSaveSuccess = function(){
        document.getElementById("productUpdateOk").style.display = "";
    }


    this.addNewProduct = function(){

        this.hideProductSaveSuccess();
        admin.productEditing = false;
        document.getElementById("emptyModal").getElementsByClassName("modal-content")[0].style.marginTop = "-129px";
        document.getElementById("itemListBackBtn").style.display = 'none';
        (new MenuViewController()).sideMenuClose();
        let content = document.getElementById("productForm").innerHTML;
        __VIEW_UTILS__.showEmptyModel({content, title: "Lista de produtos", removePadding: true,});

    }


    this.viewAdminProducts = function(){

        this.hideProductSaveSuccess();
        __VIEW_UTILS__.showSpinnerWithNoEscape({
            feedback: true,
            title: "Buscando online...",
            message1: `Aguarde...`
        });

        document.getElementById("emptyModal").getElementsByClassName("modal-dialog-centered")[0].style.maxWidth = "90%";
        document.getElementById("emptyModal").getElementsByClassName("modal-content")[0].style.marginTop = "-10px";
        
        const url = `${itemList.baseUrl}`;
        (new ProwebRequest()).getRequest(url,null, async (res, xhr) => {
            
            admin.productEditing = true;
            document.getElementById("itemListBackBtn").style.display = '';
            (new MenuViewController()).sideMenuClose();

            const response = JSON.parse(res);
            const dados = await response.data.map(i => itemList.controller.generateItemToAdmin(i));
            let result = dados.join("");
            
            let content = `
                <div class="pick_today">
                    <div class="row">${result}</div>
                </div>
            `;
            __VIEW_UTILS__.hideSpinner();
            __VIEW_UTILS__.showEmptyModel({content, title: "Lista de produtos", removePadding: true, delay: 1500});
            

        });

    }


    this.saveProduct = function(){

        __VIEW_UTILS__.showSpinnerWithNoEscape({
            feedback: true,
            title: "Processando a actualização...",
            message1: `Aguarde...`
        });

        if(admin.productEditing){

            (new ItemListViewController()).updateEditingProduct(() => {
                
                __VIEW_UTILS__.hideSpinner();
                setTimeout(() => {
                    this.showProductSaveSuccess();
                },500);
                          
            });

        }else{

            (new ItemListViewController()).savegProduct((res, xhr) => {

                console.log("Salvo agora: ", res);

                __VIEW_UTILS__.hideSpinner();
                setTimeout(() => {
                    this.showProductSaveSuccess();
                },500);            

            })

        }

    }


    return this;

}