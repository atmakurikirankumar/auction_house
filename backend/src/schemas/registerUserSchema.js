const schema = {
  properties: {
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
      required: ["name", "email", "password"],
    },
  },
  required: ["body"],
};

export default schema;
