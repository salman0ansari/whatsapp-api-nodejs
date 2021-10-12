module.exports = {
    "post": {
        "operationId": "sendMessagesControllerSendLocation",
        "responses": {
            "200": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/SendMessageReturnInterface"
                        }
                    }
                },
                "description": "Message Sent Successfully successfully"
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
            },
            "404": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/NotFound"
                        }
                    }
                },
                "description": "Number not registered on WhatsApp"
            }
        },
        "summary": "Send a Location Message",
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
        "requestBody": {
            "required": true,
            "description": "Send Data Model",
            "content": {
                "application/json": {
                    "schema": {
                        "properties": {
                            "msg_data": {
                                "$ref": "#/components/schemas/LocationMessage"
                            }
                        },
                        "type": "object",
                        "required": [
                            "msg_data"
                        ]
                    }
                }
            }
        },
        "tags": [
            "SendMessagesController"
        ]
    }
}