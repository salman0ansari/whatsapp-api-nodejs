module.exports = {
    "get":{
       "operationId":"groupControllerGetAllGroups",
       "responses":{
          "200":{
             "content":{
                "*/*":{
                   "schema":{
                      "type":"string"
                   }
                }
             },
             "description":"Action completed successfully"
          },
          "401":{
             "content":{
                "application/json":{
                   "schema":{
                      "$ref":"#/components/schemas/Unauthorized"
                   }
                }
             },
             "description":"Phone not connected"
          },
          "403":{
             "content":{
                "application/json":{
                   "schema":{
                      "$ref":"#/components/schemas/Forbidden"
                   }
                }
             },
             "description":"Invalid Instance Key"
          }
       },
       "summary":"Get all Groups",
       "parameters":[
          {
             "required":true,
             "in":"query",
             "name":"key",
             "schema":{
                "type":"string"
             }
          }
       ],
       "tags":[
          "GroupController"
       ]
    }
 }