// TODO: slim import style
import("@automerge/automerge-repo").then(({ Repo, DocHandle }) => {
  // The Repo will load correctly, but worker will not respond to messages
  // Removing the lines below will make the messages work??
  const repo = new Repo({});
  console.log(repo);
  postMessage("ready");
});

self.addEventListener("error", async function (e) {
  console.error("Error in worker", e.message);
});

self.addEventListener("message", async function (e) {
  console.log("Worker got message", e.data);
  this.setTimeout((_) => {
    postMessage("Hello from worker thread");
  }, 1000);
});
