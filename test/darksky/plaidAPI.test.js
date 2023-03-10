const { expect } = require("chai");
const Api = require("../../src/api");
const moment = require("moment");
const Helper = require("../../src/util/Helper");

let api;

const transaction = {
  accounts: [
    {
      account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      balances: {
        available: 110,
        current: 110,
        iso_currency_code: "USD",
        limit: null,
        unofficial_currency_code: null,
      },
      mask: "0000",
      name: "Plaid Checking",
      official_name: "Plaid Gold Standard 0% Interest Checking",
      subtype: "checking",
      type: "depository",
    },
  ],
  transactions: [
    {
      account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      amount: 2307.21,
      iso_currency_code: "USD",
      unofficial_currency_code: null,
      category: ["Shops", "Computers and Electronics"],
      category_id: "19013000",
      check_number: null,
      date: "2017-01-29",
      datetime: "2017-01-27T11:00:00Z",
      authorized_date: "2017-01-27",
      authorized_datetime: "2017-01-27T10:34:50Z",
      location: {
        address: "300 Post St",
        city: "San Francisco",
        region: "CA",
        postal_code: "94108",
        country: "US",
        lat: 40.740352,
        lon: -74.001761,
        store_number: "1235",
      },
      name: "Apple Store",
      merchant_name: "Apple",
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null,
      },
      payment_channel: "in store",
      pending: false,
      pending_transaction_id: null,
      account_owner: null,
      transaction_id: "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDjk",
      transaction_code: null,
      transaction_type: "place",
    },
    {
      account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      amount: 2307.21,
      iso_currency_code: "USD",
      unofficial_currency_code: null,
      category: ["Shops", "Computers and Electronics"],
      category_id: "19013000",
      check_number: null,
      date: "2017-01-29",
      datetime: "2017-01-27T11:00:00Z",
      authorized_date: "2017-01-27",
      authorized_datetime: "2017-01-27T10:34:50Z",
      location: {
        address: "300 Post St",
        city: "San Francisco",
        region: "CA",
        postal_code: "94108",
        country: "US",
        lat: 40.740352,
        lon: -74.001761,
        store_number: "1235",
      },
      name: "Apple Store",
      merchant_name: "Apple",
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null,
      },
      payment_channel: "in store",
      pending: false,
      pending_transaction_id: null,
      account_owner: null,
      transaction_id: "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
      transaction_code: null,
      transaction_type: "place",
    },
  ],
  item: {
    available_products: ["balance", "identity", "investments"],
    billed_products: ["assets", "auth", "liabilities", "transactions"],
    consent_expiration_time: null,
    error: null,
    institution_id: "ins_3",
    item_id: "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
    update_type: "background",
    webhook: "https://www.genericwebhookurl.com/webhook",
  },
  total_transactions: 2,
  request_id: "45QSn",
};

describe("Verification tasks for plaid API", async () => {
  before(async () => {
    //Actions to perform before each tests
    api = new Api();
  });
  after(async () => {
    //Actions to perform after each tests
  });

  it("Verify current balance is not greater than available balance", async () => {
    /**
     *
     * For each account
     * - Find current balance
     * - Find available balance
     * - Compare the current balance to the available balance
     * - Expect that the current balance is not greater than the available balance
     *
     */

    let resp = transaction;

    let currentBalance = -1;
    let availableBalance = -1;

    for (i = 0; i < resp.accounts.length; i++) {
      currentBalance = resp.accounts[i].balances.current;
      availableBalance = resp.accounts[i].balances.available;

      expect(
        currentBalance,
        "Current balance is greater than available balance"
      ).to.not.be.greaterThan(availableBalance);
    }
    //Example pseudocode from the instructor:
    //Loop through  accounts array so I can access each account I can use forEach, Map, etc
    //Once I am inside of the array now I will store currentBalance into one variable and availableBalance into another variable
    //I will compare both variable which should result a boolean data type
    //I can simply use expect(result).to.be.true; (or greater than is also available in chai)
    //Note for myself verification needs occur for each account in the array
  });

  it("Verify valid iso_currency_code code for each transaction", async () => {
    let validCurrencyCode = ["USD", "EU", "GBP"];
    let resp = transaction;

    for (i = 0; i < resp.total_transactions; i++) {
      let currencyCode = resp.transactions[i].iso_currency_code;
      expect(validCurrencyCode, "iso currency code is NOT valid").to.include(
        currencyCode
      );
    }
  });

  it("Verify each payment_meta property set to null inside of each transaction", async () => {
    let resp = transaction;

    for (i = 0; i < resp.total_transactions; i++) {
      for (let metaPropertyKey in resp.transactions[i].payment_meta) {
        let metaPropertyValue =
          resp.transactions[i].payment_meta[metaPropertyKey];

        expect(metaPropertyValue).to.be.null;
      }
    }
  });

  it("Verify valid available product types", async () => {
    let expectedProducts = ["balance", "identity", "investments"];

    let resp = transaction;

    let actualProducts = resp.item.available_products;
    expect(
      actualProducts,
      "valid available product types are not as expected"
    ).to.have.members(expectedProducts);
  });

  it.only("Verify webhook link is a valid link type", async () => {
    let resp = transaction;

    let webhook = resp.item.webhook;

    const isWebHookValid = Helper.isValidUrl(webhook);
    expect(isWebHookValid, 'webhook is not a valid link type').to.be.true;

  });
});
