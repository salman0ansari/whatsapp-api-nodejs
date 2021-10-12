module.exports = {
    "delete": {
        "operationId": "whatsApiDeleteInstance",
        "responses": {
            "200": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/DeleteReturn"
                        }
                    }
                },
                "description": "Instance deleted successfully"
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
        "summary": "Delete the current instance",
        "parameters": [
            {
                "required": true,
                "in": "query",
                "name": "key",
                "description": "Instance key",
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