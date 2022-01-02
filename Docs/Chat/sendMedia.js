module.exports = {
    "post": {
        "operationId": "sendMessagesControllerSendMediaUrl",
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
        "summary": "Send a Media Message with url",
        "parameters": [
            {
                "required": true,
                "in": "query",
                "name": "instance_key",
                "description": "Send Data Model",
                "schema": {
                    "type": "string"
                }
            }
        ],
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "properties": {
                            "msg_data": {
                                "$ref": "#/components/schemas/MediaMessage"
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