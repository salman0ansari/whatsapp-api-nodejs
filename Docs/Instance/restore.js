module.exports = {
    "get": {
        "operationId": "whatsApiRestoreSessions",
        "responses": {
            "200": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/RestoreReturnInterface"
                        }
                    }
                },
                "description": "Instance created successfully"
            }
        },
        "summary": "Restore all sessions that existed before serverclose",
        "parameters": [],
        "tags": [
            "Instance"
        ]
    }
}