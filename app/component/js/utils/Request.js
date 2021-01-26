const BASE_IP = "http://192.168.1.4";
const __REQUEST__ = new ProwebRequest();
const COMMAND_URL = `${BASE_IP}:4005/event`;

function ProwebRequest(){

    this.url = "";

    this.getRequest = function(purl,content, callback){

        let url = this.url;
        if(purl) url = purl;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onreadystatechange = function(){

            if(xhr.readyState == 4){
                callback(xhr.responseText, xhr);
            }

        }

        xhr.send(content);

    }

    this.postJSON = function(purl,content, callback){

        let url = this.url;
        if(purl) url = purl;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function(){

            if(xhr.readyState == 4){
                callback(xhr.responseText, xhr);
            }

        }

        xhr.send(content);

    }

    this.post = function(purl,content, callback){

        let url = this.url;
        if(purl) url = purl;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.onreadystatechange = function(){

            if(xhr.readyState == 4){
                callback(xhr.responseText, xhr);
            }

        }

        xhr.send(content);

    }

    this.putJSON = function(purl, content, callback){

        let url = this.url;
        if(purl) url = purl;

        let xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                callback(xhr.responseText, xhr);
            }
        }
        xhr.send(content);
    }

    return this;

}
