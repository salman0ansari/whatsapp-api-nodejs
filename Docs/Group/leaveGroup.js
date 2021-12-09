module.exports = {
    "delete": {
        "operationId": "groupControllerLeaveGroup",
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
        "summary": "Leave a particular group",
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
                "in": "query",
                "name": "group_id",
                "required": false,
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