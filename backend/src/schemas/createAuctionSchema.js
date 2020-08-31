const schema = {
  properties: {
    body: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        minPrice: {
          type: "number",
        },
      },
      required: ["title", "minPrice"],
    },
  },
  required: ["body"],
};

export default schema;
