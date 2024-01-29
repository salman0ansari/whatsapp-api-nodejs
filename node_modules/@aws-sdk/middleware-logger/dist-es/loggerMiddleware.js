export const loggerMiddleware = () => (next, context) => async (args) => {
    const { clientName, commandName, inputFilterSensitiveLog, logger, outputFilterSensitiveLog } = context;
    const response = await next(args);
    if (!logger) {
        return response;
    }
    if (typeof logger.info === "function") {
        const { $metadata, ...outputWithoutMetadata } = response.output;
        logger.info({
            clientName,
            commandName,
            input: inputFilterSensitiveLog(args.input),
            output: outputFilterSensitiveLog(outputWithoutMetadata),
            metadata: $metadata,
        });
    }
    return response;
};
export const loggerMiddlewareOptions = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "initialize",
    override: true,
};
export const getLoggerPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
    },
});
