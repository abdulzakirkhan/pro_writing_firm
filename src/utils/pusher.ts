// src/utils/pusher.ts
import Pusher from "pusher-js";

const pusher = new Pusher("f57ef841cfda156f64c6", {
  cluster: "ap2",
  forceTLS: true,
  // encrypted: true (optional, defaults to true now)
});

export default pusher;
