

    var issuesToAssign = [];

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Basic ZnJhbmtAZnJpY3QuYmU6RXBKc0xxU1dlMG5KRnBuenduMHIwM0Iw");
    // myHeaders.append("Content-Type", "application/json");
   
    
    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };
    
    // fetch("https://frict-mlj.atlassian.net/rest/api/3/issue", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log("FVD OK",result))
    //   .catch(error => console.log('FVD NOK', error));




    


    AP.require('request', function(request){
      AP.context.getContext(function(response){
        projectKey = response.jira.project.key;
        Array.from(document.getElementsByClassName('projectKey')).forEach(element => {
        
          element.innerHTML = response.jira.project.key
        });
        who = 'OTM'
        var myQuery = 'project = WT';
        if (!who || typeof who == 'undefined') {
            console.log("No customer defined yet.  Not allowing anything!");
            myQuery += ' and customer ~ \'' + randomstring.generate(); + '\'';
        } else
            if (who != 'OTM') {
                myQuery += ' and customer ~ \'' + who + '\'';
      }
        var raw = JSON.stringify({fields:['summary', 'attachment', 'status', 'resolutiondate','assignee', 'customfield_10033','customfield_10079', 'customfield_10060', 'customfield_10061', 'customfield_10062', 'customfield_10063', 'customfield_10065', 'customfield_10056', 'customfield_10057','customfield_10059','customfield_10175','customfield_10178','customfield_10179','customfield_10180','customfield_10181','customfield_10182','customfield_10058','customfield_10034'],
        startAt: 0,
        maxResults: 25,jql: "project ="+projectKey});
        
        request({
          url: `/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${projectKey}`,
          type: 'GET',
          
          contentType: 'application/json',
          success: function(responseText){
           let users = JSON.parse(responseText);
           let userHTML = '';
           users.forEach(user=>{
            userHTML += `<li><a href="javascript:void(0)" onClick="assignUser(this)" data-accountID = "${user.accountId}"><span class="ctl-usr-bck" title="${user.displayName}">${user.displayName.charAt(0)}${user.displayName.charAt(1)}</span></a></li>`
           })
           document.getElementById('userHTML').innerHTML = userHTML
          },
          error: function(xhr, statusText, errorThrown){
            console.log(arguments);
          }
        
      });

      request({
        url: `/rest/api/3/field`,
        type: 'GET',
        
        contentType: 'application/json',
        success: function(responseText){
          // document.getElementById('body').innerHTML = responseText
         console.log(JSON.parse(responseText))
        },
        error: function(xhr, statusText, errorThrown){
          console.log(arguments);
        }
      
    });
    
      

          
      
  
      


        request({
          url: '/rest/api/3/search',
          type: 'POST',
          data: raw,
          contentType: 'application/json',
          success: function(responseText){
            // document.getElementById('body').innerHTML = responseText
            response = JSON.parse(responseText)
            let {issues} = response;
            let html = '';
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
                                    <h3>Duration: ${duration}</h3>
                                </div>
                                <div class="ctl-dur-dat">
                                    <span>Start: ${e}</span>
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
            
            });
            document.getElementById('external-events-list').innerHTML = html
          },
          error: function(xhr, statusText, errorThrown){
            console.log(arguments);
          }
        });
      });



    


    
  });
    
  function addIssue(element){
    let issueID = element.getAttribute('data-issueID')
    if(element.checked){
      issuesToAssign = [...issuesToAssign,issueID]
    }
    else{
      let index = issuesToAssign.indexOf(issueID);
      if (index > -1) {
        issuesToAssign.splice(index, 1);
      }
    }
    console.log(issuesToAssign)
    
  }


  function assignUser(element){
    let accountID = element.getAttribute('data-accountID');
    if(issuesToAssign.length>0){
      AP.context.getToken(function(token){
        console.log("JWT token string", token);
      
      AP.require('request', function(request){
      issuesToAssign.forEach(issue=>{

        request({
          url: `/rest/api/3/issue/${issue}/assignee`,
          type: 'PUT',
         
          
          data: JSON.stringify({"accountId": accountID}),
          contentType: 'application/json',
          success: function(responseText){
            getissues()
            
          },
          error: function(xhr, statusText, errorThrown){
            console.log(errorThrown);
          }
        });
      })
    })
  });
    }
    else{
      alert('No issue selected')
    }

  }


  function getissues(){
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
      var raw = JSON.stringify({fields:['summary', 'attachment', 'status', 'resolutiondate','assignee', 'customfield_10033','customfield_10079', 'customfield_10060', 'customfield_10061', 'customfield_10062', 'customfield_10063', 'customfield_10065', 'customfield_10056', 'customfield_10057','customfield_10059','customfield_10175','customfield_10178','customfield_10179','customfield_10180','customfield_10181','customfield_10182','customfield_10058'],
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
              if(element.fields.customfield_10033){
                d = new Date(element.fields.customfield_10033);
                e += `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
              }

        
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
              
        });
        document.getElementById('external-events-list').innerHTML = html
      },
      error: function(xhr, statusText, errorThrown){
        console.log(arguments);
      }
    });
  })
})
  }


  





