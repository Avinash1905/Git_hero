/**
 * GitQuest Engine - World
 * Master container managing spatial partitioning, multi-room layouts, and environmental collision.
 */

import { GameMap } from './Map.js';
import { SpatialIndex } from './SpatialIndex.js';
import { RoomGraph } from './RoomGraph.js';
import { PathFinder } from './PathFinder.js';
import { GameEvent, TileType, EntityType } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class World {
  constructor(options = {}) {
    this.map = options.map instanceof GameMap ? options.map : new GameMap(options);
    this.spatialIndex = new SpatialIndex(1);
    this.roomGraph = new RoomGraph();
    this.pathFinder = new PathFinder(this.map.tileMap, this.spatialIndex);
    this.activeRoomId = options.activeRoomId || null;
    this.engine = null;
  }

  init(engine) {
    this.engine = engine;
  }

  setMap(map) {
    this.map = map;
    this.pathFinder.setTileMap(map.tileMap);
  }

  get width() {
    return this.map.width;
  }

  get height() {
    return this.map.height;
  }

  get gridSize() {
    return this.map.gridSize;
  }

  addRoom(room) {
    this.roomGraph.addRoom(room);
    if (!this.activeRoomId) {
      this.activeRoomId = room.id;
    }
  }

  getActiveRoom() {
    return this.activeRoomId ? this.roomGraph.getRoom(this.activeRoomId) : null;
  }

  setActiveRoom(roomId) {
    const room = this.roomGraph.getRoom(roomId);
    if (room) {
      this.activeRoomId = roomId;
      room.markDiscovered();
      if (this.engine?.eventBus) {
        this.engine.eventBus.emit(GameEvent.OBJECTIVE_PROGRESS, {
          type: 'room_entered',
          roomId
        });
      }
    }
  }

  isWall(x, y) {
    return this.map.isWall(x, y);
  }

  isHazard(x, y) {
    return this.map.isHazard(x, y);
  }

  isWalkable(x, y, ignoreEntity = null) {
    if (!this.map.isWalkable(x, y)) return false;
    const entities = this.spatialIndex.query(x, y);
    for (const ent of entities) {
      if (ent === ignoreEntity) continue;
      if (typeof ent.isSolid === 'function' && ent.isSolid()) {
        return false;
      }
    }
    return true;
  }

  getEntitiesAt(x, y) {
    return this.spatialIndex.query(x, y);
  }

  getEntitiesOfTypeAt(x, y, type) {
    const list = this.spatialIndex.query(x, y);
    return list.filter(e => e.type === type);
  }

  registerEntity(entity) {
    this.spatialIndex.insert(entity);
  }

  unregisterEntity(entity) {
    this.spatialIndex.remove(entity);
  }

  updateEntityPosition(entity) {
    this.spatialIndex.update(entity);
  }

  reset() {
    this.spatialIndex.clear();
  }
}
