const __FORM_UTIL__ = new FormUtil();

function FormUtil(){

    this.getFieldValueByClass = function(className){

        let fields = document.getElementsByClassName(className);
        let resultFields = {};
        
        for(let x = 0; x < fields.length; x++){

            resultFields[fields[x].dataset.field] = fields[x].value;

        }

        return resultFields;

    }

    return this;

}