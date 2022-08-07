export default {
  routes: [
    {
      method: "POST",
      path: "/scan",
      handler: "scan.scanDirectory",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
