module.exports = {
    "get": {
        "operationId": "whatsApiInit",
        "responses": {
            "200": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/InitReturnInterface"
                        }
                    }
                },
                "description": "Instance created successfully"
            }
        },
        "summary": "Initialize the WhatsApp Instance",
        "parameters": [],
        "tags": [
            "Instance"
        ]
    }
}