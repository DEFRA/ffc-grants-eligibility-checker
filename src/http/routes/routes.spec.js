import { getRouteDefinitions } from "./routes.js";

jest.mock("./grant-type/grant-type.js", () => ({
  routes: [
    { path: "/grant1", method: "GET" },
    { path: "/grant2", method: "POST" },
  ],
}));

describe("getRouteDefinitions", () => {
  it("should return all route definitions", () => {
    const result = getRouteDefinitions();

    expect(result).toEqual([
      { path: "/grant1", method: "GET" },
      { path: "/grant2", method: "POST" },
    ]);
  });
});
