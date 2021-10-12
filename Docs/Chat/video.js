module.exports = {
    "post": {
        "operationId": "sendMessagesControllerSendVideo",
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
        "summary": "Send a Video",
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
            },
            {
                "in": "query",
                "name": "caption",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "requestBody": {
            "required": false,
            "content": {
                "multipart/form-data": {
                    "schema": {
                        "properties": {
                            "file": {
                                "type": "string",
                                "format": "binary"
                            }
                        },
                        "type": "object"
                    }
                }
            }
        },
        "tags": [
            "SendMessagesController"
        ]
    }
}