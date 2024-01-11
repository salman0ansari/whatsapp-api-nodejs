import { getSerdePlugin } from "@aws-sdk/middleware-serde";
import { Command as $Command } from "@aws-sdk/smithy-client";
import { ListAccountRolesRequestFilterSensitiveLog, ListAccountRolesResponseFilterSensitiveLog, } from "../models/models_0";
import { deserializeAws_restJson1ListAccountRolesCommand, serializeAws_restJson1ListAccountRolesCommand, } from "../protocols/Aws_restJson1";
export class ListAccountRolesCommand extends $Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountRolesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: ListAccountRolesRequestFilterSensitiveLog,
            outputFilterSensitiveLog: ListAccountRolesResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return serializeAws_restJson1ListAccountRolesCommand(input, context);
    }
    deserialize(output, context) {
        return deserializeAws_restJson1ListAccountRolesCommand(output, context);
    }
}
