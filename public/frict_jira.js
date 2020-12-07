

    

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Basic ZnJhbmtAZnJpY3QuYmU6RXBKc0xxU1dlMG5KRnBuenduMHIwM0Iw");
    // myHeaders.append("Content-Type", "application/json");
    who = 'OTM'
    var myQuery = 'project = WT';
    if (!who || typeof who == 'undefined') {
        console.log("No customer defined yet.  Not allowing anything!");
        myQuery += ' and customer ~ \'' + randomstring.generate(); + '\'';
    } else
        if (who != 'OTM') {
            myQuery += ' and customer ~ \'' + who + '\'';
  }
    var raw = JSON.stringify({fields:['summary', 'attachment', 'status', 'resolutiondate','assignee', 'customfield_10079', 'customfield_10060', 'customfield_10061', 'customfield_10062', 'customfield_10063', 'customfield_10065', 'customfield_10056', 'customfield_10057','customfield_10059','customfield_10175','customfield_10178','customfield_10179','customfield_10180','customfield_10181','customfield_10182','customfield_10058'],
    startAt: 0,
    maxResults: 25});
    
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
        
        request({
          url: `/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${projectKey}`,
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
              html = `${html}<div class="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
              <div class="fc-event-main">
                  <div class="ctl-com-blo">
                      <div class="ctl-des-top">
                          <p>${element.fields.summary}</p>
                      </div>
                      <div class="ctl-tit-bot">
                          <div class="ctl-tit-lft">
                              <div class="ctl-chk-lft">
                                  <label for="drop-remove"></label> <input type="checkbox" id="drop-remove"/>
                              </div>
                              <div class="ctl-txt-rit">
                                  <span>${element.key}</span>
                              </div>
                              <div class="clearfix"></div>
                          </div>
                          <div class="ctl-dur-rit">
                              <div class="ctl-dur-hor">
                                  <h3>Duration: 1h 45m</h3>
                              </div>
                              <div class="ctl-dur-dat">
                                  <span>Start: 20/11/09 T 8:00</span>
                              </div>
                              <div class="clearfix"></div>
                          </div>
                          <div class="clearfix"></div>
                      </div>
                      <div class="ctl-usr-ovr">
                          <ul class="ctl-flx-usr">
                              <li><a href="#!"><span class="ctl-usr-bck">FD</span></a></li>
                          </ul>
                      </div>
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





