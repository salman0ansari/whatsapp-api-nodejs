module.exports = {
    "get": {
        "operationId": "whatsApiQrcodeImg",
        "responses": {
            "200": {
                "description": "None"
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
        "summary": "Get the qrcode",
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