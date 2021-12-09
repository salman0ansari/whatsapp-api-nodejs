module.exports = {
    "get": {
        "operationId": "groupControllerGetInviteCode",
        "responses": {
            "200": {
                "content": {
                    "*/*": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "description": "Action completed successfully"
            },
            "401": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Unauthorized"
                        }
                    }
                },
                "description": "Phone not connected"
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
        "summary": "Get invite code of a group",
        "parameters": [
            {
                "required": true,
                "in": "query",
                "name": "instance_key",
                "schema": {
                    "type": "string"
                }
            },
            {
                "required": true,
                "in": "query",
                "name": "group_id",
                "schema": {
                    "type": "string"
                }
            }
        ],
        "tags": [
            "GroupController"
        ]
    }
}