promo = {
    controller: new PromoViewController(),
    request: new ProwebRequest(),
}



function PromoViewController(){

    this.renderPromo = function(obj){

        let divElm = new Div({_class: 'osahan-slider-item mx-2', id: 'porDefinir'});
        let img = new PImage({class: 'img-fluid mx-auto rounded', path: obj.obj});

        divElm.appendChild(img);

        console.log(divElm)

        return divElm;

    }

    this.findAndPromos = function(containerId){

        (new ProwebRequest()).getRequest(`${BASE_IP}:4000/promo/list`,null,(resp, {status}) => {

            const result = eval(resp);
            imageContainer = document.getElementById(containerId);
            promoCount = 0;

            console.log("Resultado: ", result)

            for(obj of result){

                if(obj.obj){
                    //document.getElementById(containerId).appendChild(this.renderPromo(obj));
                    document.getElementById(containerId).getElementsByClassName("promoImageContainer")[promoCount].src = obj.obj;//(this.renderPromo(obj));
                    promoCount++;
                }

                if(promoCount == 2) break;
            }

            
            //return result.map(image => this.renderPromo())
            //console.log(result.length, status);

        })

    }

    return this;

}