const { expect } = require("chai");
const Api = require("../../src/api");
const moment = require("moment");
let api;

describe("User verifies github scenarios", async () => {
  before(async () => {
    //Actions to perform before each tests
    api = new Api();
  });
  after(async () => {
    //Actions to perform after each tests
  });

  it("can verify search repositories", async () => {
    const resp = await api.searchRepositories("postman", "asc", "1");
    // console.log(
    //     '\x1b[36m### Resp: %s\x1b[0m',
    //     JSON.stringify(resp, null, 2)
    //   );

    expect(resp.total_count).to.be.greaterThan(32550);
    expect(resp.incomplete_results).to.be.false;
    expect(resp.items).to.be.an("array");
    expect(resp.items[0].node_id).to.equal("MDEwOlJlcG9zaXRvcnkyNjU3ODI5NzM=");
  });

  it("can verify topics values", async () => {
    const resp = await api.searchRepositories("postman", "asc", "1");
    //TODO Verify topics array to have 2 values and values should be [chinese, postman]

    const topics = resp.items[0].topics;
    expect(topics).to.be.an("array");
    expect(topics).to.have.lengthOf(2);

    const expectedTopics = ["chinese", "postman"];
    expect(topics).to.deep.equal(expectedTopics);
  });

  it ("can verify user login details", async () => {
    const resp = await api.getUserInfo(process.env.GITUSERNAME);

    expect(resp.login).to.equal(process.env.GITUSERNAME);
    //TODO verify id value
  });

  it("can verify user login details", async () => {
    const resp = await api.getUserInfo(process.env.GITUSERNAME);

    expect(resp.login).to.equal(process.env.GITUSERNAME);
    //TODO verify id value
  });

  it ("Verify created date timestamp", async () => {
    const resp = await api.searchRepositories("postman", "asc", "1");

    const item = resp.items[0];

    let createdAt = moment(item.created_at);
    let updatedAt = moment(item.updated_at);

    let isAfter = updatedAt.isAfter(createdAt);
    expect(isAfter).to.be.true;
  });

  it ("Verify user is able to create new repo", async () => {
    const resp = await api.createNewRepo("another_repo_from_postman_class_");

    expect(resp.owner.login).to.equal(process.env.GITUSERNAME);

    let ownerID = 114707010;
    expect(resp.owner.id).to.equal(ownerID);
  });
});

it('Verify user is able to update a repo', async () => {

  //create a new repo
  
  
});

/*

Homework #1
1. Create new test file and import all necessary files and library you need to build and execute your tests
2. Write a new test which validates search repository created_at date is not greater than updated_at date
https://momentjs.com/docs/ 

Homework#2
1. Implement basic authentication on api.js file
2. Implement POST create repository endpoint which takes body parameters

*/
