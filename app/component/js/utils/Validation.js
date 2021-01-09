
function ProwebValidation(){

    this.clearRequiredValidations = function(fieldClassGroup){

        let allFields = document.getElementsByClassName(fieldClassGroup);

        for(x = 0; x < allFields.length; x++){
            try{
                allFields[x].style.border = "1px solid #cacdd0";
                allFields[x].parentNode.getElementsByClassName("requiredLabel")[0].style.display = "none";
            }catch(e){}
            
        }
    }

    this.validateRequired = function(fieldClassGroup){

        this.clearRequiredValidations(fieldClassGroup);

        let errorNumbers = 0;
        let allFields = document.getElementsByClassName(fieldClassGroup);
        for(x = 0; x < allFields.length; x++){

            if(allFields[x].classList.contains("required") && allFields[x].value == ""){
                allFields[x].style.border = "1px solid #dc3545";
                allFields[x].parentNode.getElementsByClassName("requiredLabel")[0].style.display = "";
                errorNumbers++;
                this.resetFieldBorder(allFields[x]);
            }

        }

        return (errorNumbers > 0) ? false : true;

    }

    this.resetFieldBorder = function(elm){

        let thisElm = elm;
        thisElm.onkeyup = function(){
            thisElm.parentNode.getElementsByClassName("requiredLabel")[0].style.display = "none";
            thisElm.style.border = "1px solid #cacdd0";
        }

    }

    return this;

}