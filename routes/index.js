var express = require('express');
var router = express.Router();
var request = require('request')
const ST = require('stjs');
/* GET home page. */
router.get('/', async function(req, res, next) {
let tasks = await filter();
  res.render('index', { title: 'Express', tasks:tasks.issues });
});

async function filter(who, cutomFilter) {
    who = 'OTM';

    //-->customer --> 
    //resolutionDateBegin -->     
    //resolutionDateEnd -->     

    var myQuery = 'project = WT';
    if (!who || typeof who == 'undefined') {
        console.log("No customer defined yet.  Not allowing anything!");
        myQuery += ' and customer ~ \'' + randomstring.generate(); + '\'';
    } else
        if (who != 'OTM') {
            myQuery += ' and customer ~ \'' + who + '\'';
  }
   


    // 'Job type'


    // console.log(myQuery);

    var startAt = 0;

   

    var options = {
        method: 'POST',
        url: 'https://otm-zenith.atlassian.net/rest/api/3/search',
        headers:
        {
            Authorization: 'Basic ZnJhbmsudmFuZGFtbWVAb3RtZ3JvdXAuYmU6TUxDaW83Z0Q1bTk3NkxtbXRUSllCNDE1',
            //Authorization: 'Basic ZnJhbmtAb3RtLmJlOkJrUGs2ZWYxYm84SFdBZ2JVOUQ3QTkyQg==',
            'Content-Type': 'application/json'
        },
        body:
        { //jql: 'project = WT2 and type = Epic and summary ~ "700 voertuigen"',
            jql: myQuery,
            startAt: startAt,
            maxResults: 25,
            //         fields: [ 'summary' , 'status', 'customfield_10011','customfield_10012'],
            fields: ['summary', 'attachment', 'status', 'resolutiondate', 'customfield_10079', 'customfield_10060', 'customfield_10061', 'customfield_10062', 'customfield_10063', 'customfield_10065', 'customfield_10056', 'customfield_10057','customfield_10059','customfield_10175','customfield_10178','customfield_10179','customfield_10180','customfield_10181','customfield_10182','customfield_10058'],
            fieldsByKeys: false
        },
        json: true
    };

    return new Promise(function (resolve, reject) {
        console.log(options);
        request(options, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                // console.log(res);
                // console.log(body);

                var template = {
                    "startAt": "{{startAt}}",
                    "maxResults": "{{maxResults}}",
                    "total": "{{total}}",
                    "issues": {
                        "{{#each issues}}": {
                            "id": "{{this.id}}",
                            "key": "{{this.key}}",
                            "summary": "{{this.fields.summary}}",
                            "status": "{{this.fields.status.name}}",
                            "contactInfo": "{{this.fields.customfield_10079}}",
                            "jobType": "{{this.fields.customfield_10060.value}}",
                            "installationAddress": "{{this.fields.customfield_10061}}",
                            "vehiculeBrand": "{{this.fields.customfield_10062}}",
                            "vehiculeType": "{{this.fields.customfield_10063}}",
                            "contact": "{{this.fields.customfield_10065}}",
                            "customer": "{{this.fields.customfield_10056}}",
                            "customerReference": "{{this.fields.customfield_10057}}",
                            "licencePlate": "{{this.fields.customfield_10059}}",
                            "resolutiondate": "{{this.fields.resolutiondate}}",
                            "attachments": "{{this.fields.attachment}}",
                            "salesorder":"{{this.fields.customfield_10175}}",
                            "crf1":"{{this.fields.customfield_10178}}",
                            "crf2":"{{this.fields.customfield_10179}}",
                            "crf3":"{{this.fields.customfield_10180}}",
                            "crf4":"{{this.fields.customfield_10181}}",
                            "crf5":"{{this.fields.customfield_10182}}",
                            "platenumber":"{{this.fields.customfield_10058}}"
                        }
                       
                    }
                };

                resolve(ST.select(body).transformWith(template).root());

            } else {
                log.warn("WARNING WARNING WARNING");
                log.error(error);
                log.error(body);
                reject(body + error);
            }
        });
    });
}

module.exports = router;
