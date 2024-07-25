var parser = require('../index.js');
var expect = require('expect.js');
var helpers = require('./helpers.js');
var encode = parser.encode;
var decode = parser.decode;

describe('parser', function() {
  it("encodes a nested Buffer", (done) => {
    helpers.test_bin(
      {
        type: PacketType.EVENT,
        data: ["a", { b: ["c", Buffer.from("abc", "utf8")] }],
        id: 23,
        nsp: "/cool",
      },
      done
    );
  });

  it("throws an error when adding an attachment with an invalid 'num' attribute (string)", () => {
    const decoder = new Decoder();

    expect(() => {
      decoder.add('51-["hello",{"_placeholder":true,"num":"splice"}]');
      decoder.add(Buffer.from("world"));
    }).to.throwException(/^illegal attachments$/);
  });

  it("throws an error when adding an attachment with an invalid 'num' attribute (out-of-bound)", () => {
    const decoder = new Decoder();

    expect(() => {
      decoder.add('51-["hello",{"_placeholder":true,"num":1}]');
      decoder.add(Buffer.from("world"));
    }).to.throwException(/^illegal attachments$/);
  });

  it("throws an error when adding an attachment without header", () => {
    const decoder = new Decoder();

    expect(() => {
      decoder.add(Buffer.from("world"));
    }).to.throwException(/^got binary data when not reconstructing a packet$/);
  });

  it("throws an error when decoding a binary event without attachments", () => {
    const decoder = new Decoder();

    expect(() => {
      decoder.add('51-["hello",{"_placeholder":true,"num":0}]');
      decoder.add('2["hello"]');
    }).to.throwException(/^got plaintext data when reconstructing a packet$/);
  });
  it('encodes a Buffer', function() {
      helpers.test_bin({
        type: parser.BINARY_EVENT,
        data: ['a', new Buffer('abc', 'utf8')],
        id: 23,
        nsp: '/cool'
      });
  });

  it('encodes a binary ack with Buffer', function() {
    helpers.test_bin({
      type: parser.BINARY_ACK,
      data: ['a', new Buffer('xxx', 'utf8'), {}],
      id: 127,
      nsp: '/back'
    })
  });
});
