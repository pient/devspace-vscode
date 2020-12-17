import utils from "../../../src/core/utils";

suite("Core utils Test Suite", () => {
  test("utils setObjectsByKey test", () => {
    let items = [
      { id: "id_1", v: "v_1" },
      { id: "id_2", v: "v_2" },
      { id: "id_3", v: "v_3" },
    ];

    let results1 = utils.setObjectsByKey(items.slice(0), [{ id: "id_1", v: "b1_1" }], "id");
    console.log("results1 --->", results1);
  });
});
