const __CALENDAR__ = new ProwebCalendar();


function ProwebCalendar(){

    this.renderCalendarFor = function(viewContainer, obj){
        
        __VIEW_UTILS__.loadJS("../component/js/mobiscroll.javascript.min.js");
        __VIEW_UTILS__.loadCss("../component/css/mobiscroll.javascript.min.css");

        document.getElementById(viewContainer).innerHTML = this.calendarView();


        setTimeout(() => {

            mobiscroll.setOptions({
                locale: mobiscroll.localePtBR,  // Specify language like: locale: mobiscroll.localePl or omit setting to use default
                theme: 'ios',                 // Specify theme like: theme: 'ios' or omit setting to use default
                themeVariant: 'light',         // More info about themeVariant: https://docs.mobiscroll.com/5-0-2/javascript/calendar#opt-themeVariant
                
            });

            mobiscroll.datepicker('#demo-mobile-picker-inline', {
                
                locale: mobiscroll.localePtBR,
                controls: ['calendar', 'time'],       // More info about controls: https://docs.mobiscroll.com/5-0-2/javascript/calendar#opt-controls
                display: 'inline'             // Specify display mode like: display: 'bottom' or omit setting to use default
            });

            mobiscroll.eventcalendar("#demo-mobile-picker-inline", {
                onCellClick: obj.onDateSelect ? obj.onDateSelect : function(){}
            });

            if(obj.timeLocalInputId){

                mobiscroll.datepicker(`#${obj.timeLocalInputId}`, {
                    controls: ['time']
                });

            }
            /*
            mobiscroll.datepicker('#dateTimeDeliver', {
                controls: ['time'],
                timeFormat: 'HH:mm',
                touchUi: true
            });
            */


        }, 500);

        /* 
        <script src="../component/js/mobiscroll.javascript.min.js"></script>
        <script src="../component/css/mobiscroll.javascript.min.css"></script>
        */

    }


    this.calendarView = function(){

        let view = `

                <style type="text/css">
            
                    .md-mobile-picker-inline {
                
                        margin: 6px 0 12px 0;
                        width: 99%;
                        margin: 0 auto;
                
                    }
            
                </style>

                <div mbsc-page class="demo-mobile-desktop-usage">
                    <div style="height:100%">

                        <div class="md-mobile-picker-inline">
                            <div id="demo-mobile-picker-inline"></div>
                        </div>

                    </div>
                </div>
        `;

        return view;


    }

    return this;

}