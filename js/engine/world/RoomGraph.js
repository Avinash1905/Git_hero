/**
 * GitQuest Engine - RoomGraph
 * Topological connectivity graph representing paths, portals, and locked transitions between rooms.
 */

export class RoomConnection {
  constructor(fromRoomId, toRoomId, portalCoord, targetCoord, options = {}) {
    this.fromRoomId = fromRoomId;
    this.toRoomId = toRoomId;
    this.portalCoord = portalCoord;
    this.targetCoord = targetCoord;
    this.isLocked = Boolean(options.isLocked);
    this.requiredKey = options.requiredKey || null;
    this.requiredBranch = options.requiredBranch || null;
    this.twoWay = options.twoWay !== false;
  }
}

export class RoomGraph {
  constructor() {
    this.rooms = new Map(); // roomId -> Room
    this.adjacency = new Map(); // roomId -> Array<RoomConnection>
  }

  addRoom(room) {
    if (!room || !room.id) return;
    this.rooms.set(room.id, room);
    if (!this.adjacency.has(room.id)) {
      this.adjacency.set(room.id, []);
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  getRoomAt(x, y) {
    for (const room of this.rooms.values()) {
      if (room.contains(x, y)) {
        return room;
      }
    }
    return null;
  }

  connect(fromRoomId, toRoomId, portalCoord, targetCoord, options = {}) {
    if (!this.rooms.has(fromRoomId) || !this.rooms.has(toRoomId)) {
      throw new Error(`Cannot connect unknown rooms: ${fromRoomId} -> ${toRoomId}`);
    }

    const conn = new RoomConnection(fromRoomId, toRoomId, portalCoord, targetCoord, options);
    this.adjacency.get(fromRoomId).push(conn);

    if (conn.twoWay) {
      const returnConn = new RoomConnection(toRoomId, fromRoomId, targetCoord, portalCoord, {
        ...options,
        twoWay: false
      });
      this.adjacency.get(toRoomId).push(returnConn);
    }

    return conn;
  }

  getConnections(roomId) {
    return this.adjacency.get(roomId) || [];
  }

  findPathBetweenRooms(startRoomId, goalRoomId) {
    if (startRoomId === goalRoomId) return [startRoomId];
    if (!this.rooms.has(startRoomId) || !this.rooms.has(goalRoomId)) return null;

    const queue = [[startRoomId]];
    const visited = new Set([startRoomId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === goalRoomId) {
        return path;
      }

      const conns = this.getConnections(current);
      for (const conn of conns) {
        if (!visited.has(conn.toRoomId)) {
          visited.add(conn.toRoomId);
          queue.push([...path, conn.toRoomId]);
        }
      }
    }

    return null;
  }

  clear() {
    this.rooms.clear();
    this.adjacency.clear();
  }
}
