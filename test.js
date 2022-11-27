const test = require("tape");
const sleep = require("sleep-promise");
const Hyperswarm = require("hyperswarm");
const sodium = require("sodium-universal");
const b4a = require("b4a");
const { default: DHTFlood } = require("./");
const crypto = require("crypto");

const topicName = crypto.randomBytes(10);

test("Broadcast through several peers", (t) => {
  t.plan(2);

  Promise.all([createPeer(100), createPeer(300), createPeer(500)]).then(
    (peers) => {
      const peer1 = peers.shift();
      const peer2 = peers.shift();
      const peer3 = peers.shift();
      const flood1 = new DHTFlood({ swarm: peer1 });
      const flood2 = new DHTFlood({ swarm: peer2 });
      const flood3 = new DHTFlood({ swarm: peer3 });
      const data = Buffer.from("Hello World");

      flood1.on("message", () => t.error("Got own message"));

      flood2.on("message", (message) => {
        t.deepEquals(message, data, "Data got  broadcast");
      });
      flood3.on("message", (message) => {
        t.deepEquals(message, data, "Data got  broadcast");
      });

      function maybeFlood() {
        if (peer1.peers.size === 2) {
          flood1.broadcast(data);
          peer1.removeListener("connection", maybeFlood);
        }
      }

      peer1.on("connection", maybeFlood);

      t.teardown(() => {
        [peer1, peer2, peer3].forEach((item) => item.destroy());
      });
    }
  );
});

async function createPeer(ms) {
  await sleep(ms / 2);
  const swarm = new Hyperswarm();
  await swarm.dht.ready();
  await swarm.listen();

  const topic = b4a.allocUnsafe(32);
  sodium.crypto_generichash(topic, b4a.from(topicName));

  swarm.join(topic);

  await sleep(ms / 2);

  return swarm;
}
