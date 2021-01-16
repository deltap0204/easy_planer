
 let eventsArray = [

]
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
                right: ''
            },
            defaultView: 'timeGridWeek',
            initialView:"timeGridWeek",
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            eventDurationEditable:true,
            drop: function(arg) {
               //customfield_10033
               var issueKey = arg.draggedEl.getAttribute('data-key'); 
               let json = JSON.stringify({
               
                "fields": {
                    "customfield_10033": arg.dateStr
                  
                }
              })
                AP.require('request', function(request){
                    request({
                        url: `/rest/api/3/issue/${issueKey}`,
                        type: 'PUT',
                        data:json,
                        contentType: 'application/json',
                        success: function(responseText){
                        getissues()
                        },
                        error: function(xhr, statusText, errorThrown){
                          console.log(arguments);
                        }
                      
                    });
              
                })
                    arg.draggedEl.parentNode.removeChild(arg.draggedEl);
                    console.log(arg)
               
                
            },
            events:function(a,b,c,d){
               getissues(b)
            },
            eventResize:function(info){
                let issueKey = info.event._def.extendedProps.key;
                let json = JSON.stringify({
               
                    "fields": {
                        "customfield_10034": info.event.end.toISOString()
                      
                    }
                  })
                    AP.require('request', function(request){
                        request({
                            url: `/rest/api/3/issue/${issueKey}`,
                            type: 'PUT',
                            data:json,
                            contentType: 'application/json',
                            success: function(responseText){
                            getissues()
                            },
                            error: function(xhr, statusText, errorThrown){
                              console.log(arguments);
                            }
                          
                        });
                  
                    })
                
            },
            
        });
        calendar.render();
    
    });



    function getissues(callb){
        AP.context.getContext(function(response){
          projectKey = response.jira.project.key;
          who = 'OTM'
          var myQuery = 'project = WT';
          if (!who || typeof who == 'undefined') {
              console.log("No customer defined yet.  Not allowing anything!");
              myQuery += ' and customer ~ \'' + randomstring.generate(); + '\'';
          } else
              if (who != 'OTM') {
                  myQuery += ' and customer ~ \'' + who + '\'';
        }
          var raw = JSON.stringify({fields:['summary', 'attachment', 'status', 'resolutiondate','assignee', 'customfield_10033','customfield_10079', 'customfield_10060', 'customfield_10061', 'customfield_10062', 'customfield_10063', 'customfield_10065', 'customfield_10056', 'customfield_10057','customfield_10059','customfield_10175','customfield_10178','customfield_10179','customfield_10180','customfield_10181','customfield_10182',',customfield_10058','customfield_10034'],
          startAt: 0,
          maxResults: 25,jql: "project ="+projectKey});
        AP.require('request', function(request){
        request({
          url: '/rest/api/3/search',
          type: 'POST',
          data: raw,
          contentType: 'application/json',
          success: function(responseText){
              
            issuesToAssign = []
            // document.getElementById('body').innerHTML = responseText
            response = JSON.parse(responseText)
            let {issues} = response;
            let html = '';
            let eventsArray = [];
            issues.forEach(element => {
              let assignee = '';
              if(element.fields.assignee){
                assignee = ` <div class="ctl-usr-ovr">
                <ul class="ctl-flx-usr">
                    <li><a href="#!"><span class="ctl-usr-bck" title="${element.fields.assignee.displayName}">${element.fields.assignee.displayName.charAt(0)}${element.fields.assignee.displayName.charAt(1)}</span></a></li>
                </ul>
            </div>`
              }

              let e = "";
              let de = "";
              let duration = "";
              if(element.fields.customfield_10033){
                let end = '';
                if(element.fields.customfield_10034){
                    end = element.fields.customfield_10034
    
                    const date1 = new Date(element.fields.customfield_10033);
                    const date2 = new Date(element.fields.customfield_10034);
                    var seconds = Math.floor((date2 - (date1))/1000);
var minutes = Math.floor(seconds/60);
var hours = Math.floor(minutes/60);
var days = Math.floor(hours/24);

hours = hours-(days*24);
minutes = minutes-(days*24*60)-(hours*60);
seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
duration += `${hours} h ${minutes} m`

                  }
                eventsArray.push({title:element.fields.summary, start:element.fields.customfield_10033,end:end,key:element.id})

                d = new Date(element.fields.customfield_10033);
                e += `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

                dd = new Date(element.fields.customfield_10034);
                de += `${dd.getDate()}-${dd.getMonth()}-${dd.getFullYear()}`;

              }
              
               
              if(e==""){

                html = `${html}<div class="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event" data-key="${element.id}">
                <div class="fc-event-main">
                    <div class="ctl-com-blo">
                        <div class="ctl-des-top">
                            <p>${element.fields.summary}</p>
                        </div>
                        <div class="ctl-tit-bot">
                            <div class="ctl-tit-lft">
                                <div class="ctl-chk-lft">
                                    <label for="drop-remove"></label> <input type="checkbox" onClick="addIssue(this)" data-issueID="${element.id}" id="drop-remove"/>
                                </div>
                                <div class="ctl-txt-rit">
                                    <span>${element.key}</span>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <div class="ctl-dur-rit">
                                <div class="ctl-dur-hor">
                                    <h3></h3>
                                </div>
                                <div class="ctl-dur-dat">
                                    <span></span>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                       ${assignee}
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>`;
            
              }


            });
            document.getElementById('external-events-list').innerHTML = html
            callb(eventsArray)
          },
          error: function(xhr, statusText, errorThrown){
            console.log(arguments);
          }
        });
      })
    })
      }


  