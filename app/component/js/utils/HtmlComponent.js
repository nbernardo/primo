
function Div({_class, id}){

    let elm = document.createElement("div");
    
    if(_class) elm.className = _class;
    
    if(id) elm.id = id;

    return elm;

}

function Link(obj){

    let elm = document.createElement("a");
    
    if(obj.path) elm.href = obj.path;
    
    if(obj.id) elm.id = obj.id;

    return elm;

}

function PImage(obj){

    let elm = document.createElement("img");
    
    if(obj.path) elm.src = obj.path;
    if(obj.width) elm.width = obj.width;
    if(obj.height) elm.height = obj.height;
    if(obj.class) elm.class = obj.class;

    return elm;

}



function HtmlComponent(){

    


    return this;



}