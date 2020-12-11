document.addEventListener('DOMContentLoaded', function() {
    ////
        /* initialize the external events
        -----------------------------------------------------------------*/
    
        var containerEl = document.getElementById('external-events-list');
        new FullCalendar.Draggable(containerEl, {
            itemSelector: '.fc-event',
            eventData: function(eventEl) {
                return {
                    title: eventEl.innerText.trim()
                }
            }
        });
    
        //// the individual way to do it
        // var containerEl = document.getElementById('external-events-list');
        // var eventEls = Array.prototype.slice.call(
        //   containerEl.querySelectorAll('.fc-event')
        // );
        // eventEls.forEach(function(eventEl) {
        //   new FullCalendar.Draggable(eventEl, {
        //     eventData: {
        //       title: eventEl.innerText.trim(),
        //     }
        //   });
        // });
    
        /* initialize the calendar
        -----------------------------------------------------------------*/
    
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            eventDurationEditable:true,
            drop: function(arg) {
               
                AP.require('request', function(request){
                    request({
                        url: `/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${projectKey}`,
                        type: 'GET',
                        
                        contentType: 'application/json',
                        success: function(responseText){
                        console.log(responseText)
                        },
                        error: function(xhr, statusText, errorThrown){
                          console.log(arguments);
                        }
                      
                    });
              
                })
                    arg.draggedEl.parentNode.removeChild(arg.draggedEl);
                    console.log(arg.draggedEl.getAttribute('data-key'))
               
                
            }
        });
        calendar.render();
    
    });