import { Repo, DocHandle } from "@automerge/automerge-repo";

const repo = new Repo({});
type DocType = {
  list: Array<string>;
};

const handle: DocHandle<DocType> = repo.create({
  list: ["a", "b", "c"],
});

handle.change((doc) => {
  let index = doc.list.indexOf("b");
  console.log(JSON.stringify(doc.list), index);
});
