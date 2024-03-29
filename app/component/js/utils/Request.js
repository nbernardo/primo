<<<<<<< HEAD
const BASE_IP = "http://64.225.11.52";
=======
const BASE_IP = "http://192.168.1.5";
>>>>>>> 140c58aa6bb7a002e3c4b2b0fb4096c27c317fed
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
