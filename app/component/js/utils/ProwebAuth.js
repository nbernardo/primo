const __PROWEBAUTH__ = new ProwebAuth();

function ProwebAuth(){

    this.checkPageViewPermission = function(){

        const user = localStorage.getItem("user");
        const userData = JSON.parse(user);

        if(user != null && user != undefined){
            if(userData.logged){

            }else{
                document.body.innerHTML = `
                <h5 style="margin:50% auto; width:90%; text-align:center;">
                    <i class="icofont-worried"></i>
                    Lamentamos, não tem privilégios para aceder esta interface, faça o login para poder ter o devido acesso 
                </h5>
                `;
                console.warn("User access denied!");
            }
        };

    }


    return this;

}