module.exports = {
    components: {
        // securitySchemes: {
        //     "Auth": {
        //         "type": "apiKey",
        //         "name": "key",
        //         "in": "query"
        //     },
        //   },
        "schemas": {
            "InitReturnInterface": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": false
                    },
                    "message": {
                        "type": "string",
                        "default": "Initializing successfull"
                    },
                    "key": {
                        "type": "string"
                    }
                }
            },
            "RestoreReturnInterface": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": false
                    },
                    "message": {
                        "type": "string",
                        "default": "All Instances Restored"
                    }
                }
            },
            "UserDataReturnInterface": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": false
                    },
                    "message": {
                        "type": "string"
                    },
                    "instance_key": {
                        "type": "string"
                    },
                    "instance_data": {
                        "type": "object"
                    }
                }
            },
            "LogoutReturnInterface": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "number",
                        "default": 200
                    },
                    "message": {
                        "type": "string",
                        "default": "logout successfull"
                    }
                }
            },
            "DeleteReturn": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": false
                    },
                    "message": {
                        "type": "string",
                        "default": "Instance deleted successfully"
                    }
                }
            }, "Forbidden": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": true
                    },
                    "message": {
                        "type": "string",
                        "default": "invalid key supplied"
                    }
                }
            }, "Unauthorized": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": true
                    },
                    "message": {
                        "type": "string",
                        "default": "phone isn't connected"
                    }
                }
            },
            "GenericError": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The error name",
                        "minLength": 1
                    },
                    "message": {
                        "type": "string",
                        "description": "An error message",
                        "minLength": 1
                    }
                },
                "additionalProperties": true,
                "required": [
                    "name",
                    "message"
                ]
            },
            "NotFound": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "boolean",
                        "default": true
                    },
                    "message": {
                        "type": "string",
                        "default": { "statusCode": 404, "message": "Number is not registered on WhatsApp" }
                    }
                }
            },
            "SendMessageReturnInterface": {
                "type": "object",
                "properties": {
                    "data": {
                        "type": "string",
                        "default": "message_data_here"
                    }
                }
            },
            "TextMessage": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            },
            "BadRequest": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The error name",
                        "minLength": 1,
                        "example": "BAD_REQUEST",
                        "default": "BAD_REQUEST"
                    },
                    "message": {
                        "type": "string",
                        "description": "An error message",
                        "minLength": 1
                    },
                    "status": {
                        "type": "number",
                        "description": "The status code of the exception",
                        "example": 400,
                        "default": 400
                    },
                    "errors": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/GenericError"
                        },
                        "description": "A list of related errors"
                    },
                    "stack": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "The stack trace (only in development mode)"
                    }
                },
                "required": [
                    "name",
                    "message",
                    "status"
                ]
            },
            "LocationMessage": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "caption": {
                        "type": "string"
                    },
                    "coordinates": {
                        "$ref": "#/components/schemas/Coordinates"
                    }
                }
            },
            "Coordinates": {
                "type": "object",
                "properties": {
                    "lat": {
                        "type": "number"
                    },
                    "long": {
                        "type": "number"
                    }
                }
            },

            "ButtonMessage": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "contentText": {
                        "type": "string"
                    },
                    "footerText": {
                        "type": "string"
                    },
                    "buttons": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Button"
                        }
                    },
                    "headerType": {
                        "type": "number",
                        "default": 1
                    }
                }
            },
            "SendVCardData": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "fullName": {
                        "type": "string"
                    },
                    "displayName": {
                        "type": "string"
                    },
                    "organization": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "string"
                    }
                }
            },
            "AddGroupParticipantModel": {
                "type": "object",
                "properties": {
                    "group_id": {
                        "type": "string"
                    },
                    "participants": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "Button":
            {
                "type": "object",
                "properties": {
                    "buttonId": {
                        "type": "string"
                    },
                    "buttonText": {
                        "$ref": "#/components/schemas/ButtonText"
                    },
                    "type": {
                        "type": "number",
                        "default": 1
                    }
                }
            },
            "ButtonText": {
                "type": "object",
                "properties": {
                    "displayText": {
                        "type": "string"
                    }
                }
            },
            "CreateGroupModel": {
                "type": "object",
                "properties": {
                    "group_name": {
                        "type": "string"
                    },
                    "new_participants": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
        }
    }
}