import { Repo, DocHandle } from "@automerge/automerge-repo";
import * as Automerge from "@automerge/automerge";

// SETUP AUTOMERGE
const repo = new Repo({});

type DocType = {
  inklets: Array<{ x: number; y: number }>;
};

const handle: DocHandle<DocType> = repo.create({
  inklets: [],
});

let doc = handle.docSync()!;
let previewRewindDoc: DocType;

// Simulate a bunch of drawing
console.log("Simulate Drawing");
let t = 0;
for (let j = 0; j < 5000; j++) {
  // Collect a bunch of changes
  let inkletsToDraw: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 5; i++) {
    inkletsToDraw.push({
      x:
        200 +
        50 * Math.cos(t * 0.01134) +
        100 * Math.cos(t * 0.0015) +
        10 * Math.cos(t * 0.025) +
        5 * Math.cos(t * 0.15),
      y:
        200 +
        100 * Math.sin(t * 0.00054) +
        14 * Math.sin(t * 0.021) +
        5 * Math.sin(t * 0.15),
    });
    t += 2;
  }

  // Apply the changes
  handle.change((doc) => {
    for (const inklet of inkletsToDraw) {
      doc.inklets.push(inklet);
    }
  });
}

console.log("Get Changes");
const changes = Automerge.getAllChanges(doc);
const decoded = changes.map((change) => {
  return Automerge.decodeChange(change);
});

console.log("Begin rewind");
function rewind(steps: number) {
  //changes[changes.length - 2]

  //if (decoded.length > steps) {
  const previousState = Automerge.view(
    doc,
    decoded[decoded.length - steps].deps,
  );

  previewRewindDoc = previousState;
  //}
}

let rewindNumber = 1;

// SETUP CANVAS
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

// RUN REWINDS
function frame() {
  rewind(rewindNumber);
  rewindNumber += 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const inklet of previewRewindDoc.inklets) {
    ctx.fillRect(inklet.x, inklet.y, 1, 1);
  }

  window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);
