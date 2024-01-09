// schema.js
const Joi = require('joi');

// Joi Schema for User Payload Validation
const userSchemaValidation = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().required(),
    location: Joi.string().required(),
    interests: Joi.array().items(Joi.string()),
    income: Joi.number().required(),
});

// Middleware for Payload Validation
const validatePayload = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = { userSchemaValidation, validatePayload };
