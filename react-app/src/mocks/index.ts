 if (typeof window !== "undefined") {
  const { worker } = require("./browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

export {};
