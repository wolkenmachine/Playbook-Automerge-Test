const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

worker.postMessage("Hello from main thread");

worker.addEventListener("message", (e) => {
  console.log("Main thread got message", e.data);
});
