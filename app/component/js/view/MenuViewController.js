menu = {
    controller: new MenuViewController(),
}

function MenuViewController(){

    this.renderMenu = function(viewTitle = "PPRIMO"){

        document.getElementsByClassName("mobile-nav")[0].innerHTML = this.generateTopBar().replace("(current)",viewTitle);
        document.getElementsByClassName("bottom-nav")[0].innerHTML = this.generateBottomMenu();
        document.getElementsByClassName("second-nav")[0].innerHTML = this.generateMainMenu();
        
    }

    this.renderTopBar = function(){

    }


    this.generateTopBar = function(){

        return `
        
                <div class="title d-flex align-items-center">
                    <a href="home.html" class="text-decoration-none text-dark d-flex align-items-center">
                        <img class="osahan-logo mr-2" src="img/logo.svg">
                        <h4 class="font-weight-bold text-success m-0">(current)</h4>
                    </a>
                    <p class="ml-auto m-0" style="visibility: hidden;">
                        <a href="listing.html" class="text-decoration-none bg-white p-1 rounded shadow-sm d-flex align-items-center">
                        <i class="text-dark icofont-sale-discount"></i>
                        <span class="badge badge-danger p-1 ml-1 small">50%</span>
                        </a>
                    </p>

                    <a href="#" style="display: none;" data-toggle="modal" id="carrinhoModalButton" data-target="#carrinhoModal">&nbsp;</a>
                    <span 
                       onclick="carrinho.controller.showAppropriateView()" 
                       class="bg-color-head text-white  rounded  profileButton" 
                       style="right: 0; width: 70px; height: 42px;">
                       
                       <a href="#" class="text-decoration-none text-white">
                          <i class="text-white icofont-shopping-cart" style="color: white; font-size: 14px;"></i> 
                          <span id="itensOnCarrinho">
                             ( <span>...</span> )
                          </span>
                       </a>
                    </span>

                    
                    <a class="toggle ml-3" id="toggleButton" href="#"><i class="icofont-navigation-menu"></i></a>
                </div>
                <a href="search.html" class="text-decoration-none" style="display:none;">
                    <div class="input-group mt-3 rounded shadow-sm overflow-hidden bg-white">
                    <div class="input-group-prepend">
                        <button class="border-0 btn btn-outline-secondary text-success bg-white"><i class="icofont-search"></i></button>
                    </div>
                    <input type="text" class="shadow-none border-0 form-control pl-0" placeholder="Search for Products.." aria-label="" aria-describedby="basic-addon1">
                    </div>
                </a>

        `;

    }

    const authorizedMenu = function(section){

        
        if(__PROWEBAUTH__.isUserLogged() == null) return '';

        const loggedInSections = {
            "meusDadosOld" : `
                        <li>
                            <a href="my_account.html"><i class="icofont-ui-user mr-2"></i>Minha conta</a>
                            <!--
                            <ul>
                                <li><a class="dropdown-item" href="my_account.html">Meus dados</a></li>
                                <li><a class="dropdown-item" href="promos.html">Meus pontos</a></li>
                                <li><a class="dropdown-item" href="my_address.html">Meu endereço</a></li>
                                <li><a class="dropdown-item" href="terms_conditions.html">Termos & condições</a></li>
                                <li><a class="dropdown-item" href="help_support.html">Ajuda</a></li>
                                <li><a class="dropdown-item" href="#" onclick="user.controller.logout()">Sair</a></li>
                            </ul>
                            -->
                        </li>
            `, 
            "meusPontosOld" : `
                    <li>
                        <a href="index.html">
                            <i class="icofont-money-bag mr-3" style="font-size: 20px;"></i> Meus Pontos
                        </a>
                    </li>
            `,

            "meusDados" : ``, 
            "meusPontos" : ``,

        }

        return loggedInSections[section];
        
    }

    this.generateMainMenu = function(){

        return `
            
                ${authorizedMenu("meusDados")}
                ${authorizedMenu("meusPontos")}

                <li><a href="index.html"><i class="icofont-cloud-refresh mr-2" style="font-size: 25px;"></i> Actualizar</a></li>
                <!--
                    <li>
                        <a href="#"><i class="icofont-login mr-2"></i> Autenticação</a>
                        <ul>
                            <li><a class="dropdown-item" href="signin.html">Login</a></li>
                            <li><a class="dropdown-item" href="signup.html">Nova conta</a></li>
                            <li><a href="verification.html">Verificação</a></li>
                        </ul>
                    </li>
                -->
                <!--
                    <li><a class="dropdown-item" href="cart.html">Carrinho de compras</a></li>
                -->
                <li><i class="icofont-cube mr-2" style="font-size:20px;"></i>Nosso serviços</li>

                <!-- 
                    <li><a class="dropdown-item" href="listing.html">Listing</a></li>
                    <li><a class="dropdown-item" href="product_details.html">Detail</a></li>
                    <li><a class="dropdown-item" href="picks_today.html">Trending</a></li>
                    <li><a class="dropdown-item" href="recommend.html">Recommended</a></li>
                    <li><a class="dropdown-item" href="fresh_vegan.html">Most Popular</a></li>
                    <li><a class="dropdown-item" href="checkout.html">Checkout</a></li>
                    <li><a class="dropdown-item" href="successful.html">Successful</a></li>
                -->

                <li>
                    <i class="icofont-sub-listing mr-2"></i> Minhas solicitações
                    <!--
                    <ul>
                        <li><a class="dropdown-item" href="my_order.html">Factura</a></li>
                        <li><a class="dropdown-item" href="status_complete.html">Entregues</a></li>
                        <li><a class="dropdown-item" href="status_onprocess.html">EM Processo</a></li>
                        <li><a class="dropdown-item" href="status_canceled.html">Cancelada</a></li>
                        <li><a class="dropdown-item" href="review.html">Rever</a></li>
                    </ul>
                    -->
                </li>

                <li>
                    <a href="#a" class="dropdown-item" onclick="user.controller.logout()"><i class="icofont-logout mr-2"></i> Sair</a>
                </li>

        `;

    }


    this.generateBottomMenu = function(){

        return `
                <li class="email">
                <a class="text-success" href="home.html">
                    <p class="h5 m-0"><i class="icofont-cloud-refresh text-success"></i></p>
                    Início
                </a>
                </li>
                <li class="github">
                <a href="cart.html">
                    <p class="h5 m-0"><i class="icofont-cart"></i></p>
                    Carrinho
                </a>
                </li>
                <li class="ko-fi">
                <a href="help_ticket.html">
                    <p class="h5 m-0"><i class="icofont-headphone"></i></p>
                    Ajuda
                </a>
                </li>
        `;

    }

    return this;


}