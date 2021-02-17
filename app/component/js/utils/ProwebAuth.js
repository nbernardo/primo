const __PROWEBAUTH__ = new ProwebAuth();
const ProwebAuthBucket = {
    privileges : false,
}

function ProwebAuth(){

    this.isUserLogged = function(){

        let loggetUser = localStorage.getItem("user");

        console.log("CHecou: ", loggetUser);

        if(loggetUser){
            loggetUser = JSON.parse(loggetUser);
            return loggetUser.logged ? true : null;
        }
        return loggetUser;

    }

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


    this.setAdminPrivileges = function(){

        ProwebAuthBucket.privileges = "ADMIN";

    }

    this.getAdminPrivileges = function(){

        if(this.isUserLogged()){

            let loggetUser = localStorage.getItem("user");
            loggetUser = JSON.parse(loggetUser);
            return loggetUser.admin ? "ADMIN" : 'NORMAL';

        }
        return ProwebAuthBucket.privileges;

    }


    return this;

}