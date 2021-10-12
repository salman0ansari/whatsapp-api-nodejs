module.exports = {
    "delete": {
        "operationId": "whatsApiLogoutSession",
        "responses": {
            "200": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/LogoutReturnInterface"
                        }
                    }
                },
                "description": "Logout successfull"
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
        "summary": "Logout from current session",
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
        "tags": [
            "Instance"
        ]
    }
}