/**
 * GitQuest Engine - Network & Distributed Git Sync Simulation
 * Models remote latency, intermittent network partitions, and asynchronous fetch/push transfers.
 */

export class NetworkPacket {
  constructor(type, payload, delayMs = 50) {
    this.type = type;
    this.payload = payload;
    this.delayMs = delayMs;
    this.timestamp = Date.now();
  }
}

export class NetworkSimulation {
  constructor(latencyMs = 100, packetLossRate = 0.0) {
    this.latencyMs = latencyMs;
    this.packetLossRate = packetLossRate;
    this.inFlightQueue = [];
    this.isOnline = true;
  }

  setOnline(online) {
    this.isOnline = Boolean(online);
  }

  send(type, payload, onDelivered) {
    if (!this.isOnline) {
      return { success: false, reason: 'offline' };
    }

    if (Math.random() < this.packetLossRate) {
      return { success: false, reason: 'packet_lost' };
    }

    const packet = new NetworkPacket(type, payload, this.latencyMs);
    this.inFlightQueue.push({ packet, onDelivered });

    setTimeout(() => {
      if (this.isOnline && onDelivered) {
        onDelivered(payload);
      }
    }, this.latencyMs);

    return { success: true, packet };
  }

  flush() {
    for (const item of this.inFlightQueue) {
      if (item.onDelivered) {
        item.onDelivered(item.packet.payload);
      }
    }
    this.inFlightQueue = [];
  }
}
