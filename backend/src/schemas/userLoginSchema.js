const schema = {
  properties: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
      required: ["email", "password"],
    },
  },
  required: ["body"],
};

export default schema;
