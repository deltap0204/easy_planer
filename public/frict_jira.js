
function myFunction(){
    console.log("SUBMITTING THE FOLLOWING");
    console.log("First name : " + document.getElementById("fname").value);
    console.log("Last name : " + document.getElementById("lname").value);

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Basic ZnJhbmtAZnJpY3QuYmU6RXBKc0xxU1dlMG5KRnBuenduMHIwM0Iw");
    // myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"fields":{"summary":"Main order flow broken","project":{"id":"10001"},"issuetype":{"id":"10005"},"description":{"type":"doc","version":1,"content":[{"type":"paragraph","content":[{"text":"Order entry fails when selecting supplier.","type":"text"}]}]}}});
    
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
        request({
          url: '/rest/api/3/issue',
          type: 'POST',
          data: raw,
          contentType: 'application/json',
          success: function(responseText){
            console.log();console.log();console.log();console.log();console.log();console.log();console.log();
            console.log(responseText);
          },
          error: function(xhr, statusText, errorThrown){
            console.log();console.log();console.log();console.log();console.log();console.log();console.log();
            console.log(arguments);
          }
        });
      });









}