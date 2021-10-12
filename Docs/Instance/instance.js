module.exports = {
    "get": {
        "operationId": "whatsApiGetInstanceData",
        "responses": {
            "200": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/UserDataReturnInterface"
                        }
                    }
                },
                "description": "Your instance data"
            },
            "403": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Forbidden"
                        }
                    }
                },
                "description": "Invalid Instance Key"
            }
        },
        "summary": "Get the instance data",
        "parameters": [
            {
                "in": "query",
                "name": "key",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        // security: [{
        //     Auth: []
        //   }],
        "tags": [
            "Instance"
        ]
    }
}