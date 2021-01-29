var totalMembers = '';
 let eventsArray = []
 var containerEl;
 var issuesToAssign = [];
 var selectedAccountId;
 var totalMembers='';
 var selectedIssueId;
 var calendar;
 let eventsArrayFrictFrict = []
   
document.addEventListener('DOMContentLoaded', function() {
    ////
        /* initialize the external events
        -----------------------------------------------------------------*/
    
         containerEl = document.getElementById('external-events-list');
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
    
      initializeCalendar();
    
    });

  function initializeCalendar(){
    eventsArray=[];
    var calendarEl = document.getElementById('calendar');
    Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h*60*60*1000));
      return this;
    }
    calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
      },
      defaultView: 'timeGridWeek',
      initialView:"timeGridWeek",
      timeZone: 'UTC+1',
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      eventDurationEditable:true,
      eventDrop: function(info) {
        let issueKey = info.event._def.extendedProps.key;
          var eventDate = new Date(info.event.end.getTime());
          var startDate = new Date(info.event.start.getTime())
          eventDate.addHours(-1);
          startDate.addHours(-1)
          let json = JSON.stringify({
         
              "fields": {
                  "customfield_10034": eventDate,
                  "customfield_10033":startDate
                
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
                  initializeCalendar()
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
          var eventDate = new Date(info.event.end.getTime());
          eventDate.addHours(-1);
          let json = JSON.stringify({
         
              "fields": {
                  "customfield_10034": eventDate
                
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
  }

    function getissues(callb){
      eventsArray= []
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
          
// /******************** */
request({
          url: `/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${projectKey}`,
          type: 'GET',
          
          contentType: 'application/json',
          success: function(responseText){
           let users = JSON.parse(responseText);
          //  let userHTML = '';
           displayName = ''
           totalMembers=''
           users.forEach(user=>{
            totalMembers +=`<a href="#" class="w3-bar-item w3-button"  onClick="assignUser(this,true)" data-accountID="${user.accountId}">
                            <div>
                                <span class="ctl-usr-bck" id="${user.accountId}" title="${user.displayName}">
                                  ${user.displayName.charAt(0)}${user.displayName.charAt(1)}
                                </span>
                              ${user.displayName.charAt(0)}${user.displayName.charAt(1)}
                              </div>
                            </a> `
          })
          //  document.getElementById('userHTML').innerHTML = userHTML
          },
          error: function(xhr, statusText, errorThrown){
            console.log(arguments);
          }
        
      });
/****************** */
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
            let count = 0;
            issues.forEach(element => {

              if(selectedAccountId !== undefined && ( !element.fields.assignee || selectedAccountId !== element.fields.assignee.accountId)){
                return;
              }
              let assignee = '';
              count = count+1;
              if(element.fields.assignee){
            assignee = ` <div class="ctl-usr-ovr">
            <ul class="ctl-flx-usr">
                <li>
                  <a href="#!">
                    <div class="w3-dropdown-click">
                      <ul class="ctl-flx-usr" onclick="myFunction(${count},${element.id})">
                     <li><a href="#!"><span class="ctl-usr-bck" title="${element.fields.assignee.displayName}">${element.fields.assignee.displayName.charAt(0)}${element.fields.assignee.displayName.charAt(1)}</span></a></li>
                 </ul>
                      <div id="Demo${count}" class="w3-dropdown-content w3-bar-block w3-hide w3-border" >
                     ${totalMembers}
                      </div>
                    </div>
                 </a>
              </li>
            </ul>
        </div>`           
              } else{
                
                assignee = ` <div class="ctl-usr-ovr">
                                <ul class="ctl-flx-usr">
                                    <li>
                                      <a href="#!">
                                        <div class="w3-dropdown-click">
                                          <div onclick="myFunction(${count},${element.id})" class="arrow-down"></div>
                                          <div id="Demo${count}" class="w3-dropdown-content w3-bar-block w3-hide w3-border">
                                         ${totalMembers}
                                          </div>
                                        </div>
                                     </a>
                                  </li>
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
                eventsArray.push({title:element.fields.summary,status:element.fields.status.statusCategory.name,keyToDislay:element.key, start:element.fields.customfield_10033,end:end,key:element.id,assignee:element.fields.assignee.displayName})
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
      

      function getInputValue(value){
        var inputVal = document.getElementById("search").value;
        if(inputVal ===''){
          getissues()
        }else{
          getSearchedIssue(value)
        }
        
    }

    function getSearchedIssue(value){
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
        response = JSON.parse(responseText)
        let {issues} = response;
        let html = '';
        let eventsArray = [];
        let count = 0;
        issues.forEach(element => {  
          let assignee = '';
          let assigneeNew ={
            value:''
          }
          if(element.fields.summary.toLowerCase().indexOf(value.toLowerCase()) !== -1){
              settingDiv(assigneeNew,element,count)
              assignee = assigneeNew.value
            }else{
            return
          }
          let e = "";  
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

  function settingDiv(assignees,element,count){
    count = count+1;
    if(element.fields.assignee){
    assignees.value =` <div class="ctl-usr-ovr">
    <ul class="ctl-flx-usr">
        <li>
          <a href="#!">
            <div class="w3-dropdown-click">
              <ul class="ctl-flx-usr" onclick="myFunction(${count},${element.id})">
             <li><a href="#!"><span class="ctl-usr-bck" title="${element.fields.assignee.displayName}">${element.fields.assignee.displayName.charAt(0)}${element.fields.assignee.displayName.charAt(1)}</span></a></li>
         </ul>
              <div id="Demo${count}" class="w3-dropdown-content w3-bar-block w3-hide w3-border" >
             ${totalMembers}
              </div>
            </div>
         </a>
      </li>
    </ul>
</div>`

  } else{
    assignees.value = ` <div class="ctl-usr-ovr">
                    <ul class="ctl-flx-usr">
                        <li>
                          <a href="#!">
                            <div class="w3-dropdown-click">
                              <div onclick="myFunction(${count},${element.id})" class="arrow-down"></div>
                              <div id="Demo${count}" class="w3-dropdown-content w3-bar-block w3-hide w3-border">
                             ${totalMembers}
                              </div>
                            </div>
                         </a>
                      </li>
                    </ul>
                </div>`
              }
              
  }

  
