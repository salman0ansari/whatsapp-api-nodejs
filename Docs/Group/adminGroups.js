module.exports = {
    "get":{
       "operationId":"groupControllerGetAdminGroups",
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
       "summary":"Get all groups in which you are admin or super-admin",
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