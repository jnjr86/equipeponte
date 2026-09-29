const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../api/contact.js");
const payload = {
  name: "Teste",
  email: "teste@example.com",
  message: "Mensagem de teste local.",
  company: "",
};
async function call(body, extra = {}) {
  const response = {
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(n) {
      this.code = n;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    },
  };
  await handler(
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "localhost",
        origin: "http://localhost",
      },
      body,
      ...extra,
    },
    response,
  );
  return response;
}
test("rejects invalid fields and header injection", async () => {
  for (const body of [
    null,
    {},
    { ...payload, email: "invalid" },
    { ...payload, name: "x\r\nBcc: x" },
    { ...payload, message: "short" },
  ])
    assert.equal((await call(body)).code, 400);
});
test("rejects method, content type, foreign origin and oversized body", async () => {
  assert.equal((await call(payload, { method: "GET" })).code, 405);
  assert.equal((await call(payload, { headers: {} })).code, 415);
  assert.equal(
    (
      await call(payload, {
        headers: {
          "content-type": "application/json",
          host: "localhost",
          origin: "https://elsewhere.example",
        },
      })
    ).code,
    403,
  );
  assert.equal(
    (await call({ ...payload, message: "x".repeat(13000) })).code,
    413,
  );
});
test("reports missing configuration without sending", async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM;
  assert.equal((await call(payload)).code, 503);
});
test("delivery uses a fixed recipient and reports provider failure honestly", async () => {
  process.env.RESEND_API_KEY = "mock";
  process.env.CONTACT_FROM = "Site <site@example.com>";
  const original = global.fetch;
  try {
    global.fetch = async (url, init) => {
      const sent = JSON.parse(init.body);
      assert.deepEqual(sent.to, ["equipeponte@gmail.com"]);
      assert.equal(sent.reply_to, payload.email);
      return { ok: true, json: async () => ({ id: "mock-id" }) };
    };
    assert.equal(
      (await call({ ...payload, to: "elsewhere@example.com" })).code,
      200,
    );
    global.fetch = async () => ({ ok: false });
    assert.equal((await call(payload)).code, 502);
  } finally {
    global.fetch = original;
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FROM;
  }
});
