const __PROWEBMAP__ = new ProwebMap();


function ProwebMap(){

    mapView = function(obj, containerId){

        console.log(obj);

        let lat = obj.coords ? obj.coords.latitude : obj.lat;
        let lng = obj.coords ? obj.coords.longitude : obj.lng;
        
        var mymap = L.map(containerId).setView([lat, lng], 14);

        /* VISÂO DE SATELITE */
        // L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">PPRIMO</a>'
        }).addTo(mymap);

        L.marker([lat, lng]).addTo(mymap)
           .bindPopup('Sua localização actual')
           .openTooltip();

    }

    this.renderMap = function(containerId){

        if(location.protocol == ":https"){

            navigator.geolocation.getCurrentPosition((obj) => {
                mapView(obj, containerId);
            })

         }else{

            let obj = {
               lat: -8.957516, lng: 13.184455
            }
            mapView(obj, containerId);

         }

    }

    return this;

}