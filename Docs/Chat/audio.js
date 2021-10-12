module.exports = {
    "post": {
        "operationId": "sendMessagesControllerSendAudio",
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
        "summary": "Send a Audio",
        "parameters": [
            {
                "in": "query",
                "name": "key",
                "required": true,
                "schema": {
                    "type": "string"
                }
            },
            {
                "in": "query",
                "name": "id",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "requestBody": {
            "required": true,
            "content": {
                "multipart/form-data": {
                    "schema": {
                        "properties": {
                            "file": {
                                "type": "string",
                                "format": "binary",
                                "minLength": 1
                            }
                        },
                        "type": "object",
                        "required": [
                            "file"
                        ]
                    }
                }
            }
        },
        "tags": [
            "SendMessagesController",
        ]
    }
}