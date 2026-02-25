// dungeon-gen - Legend Component
//
// Color legend showing room type names and swatches.
//
// Depends on: algorithms/types.ts
// Used by:    App.tsx

import { RoomType, ROOM_COLORS } from "../algorithms/types";

const ROOM_DESCRIPTIONS: Record<RoomType, string> = {
  [RoomType.Safe]: "Starting room",
  [RoomType.Combat]: "Enemy encounter",
  [RoomType.Loot]: "Treasure room",
  [RoomType.Shop]: "Buy items",
  [RoomType.Boss]: "Boss fight",
  [RoomType.Forge]: "Upgrade gear",
};

export function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {Object.values(RoomType).map((type) => (
        <div key={type} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: ROOM_COLORS[type] }}
          />
          <span className="text-sm text-zinc-300">
            {type}
            <span className="text-zinc-500 ml-1">— {ROOM_DESCRIPTIONS[type]}</span>
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500">↑↓ = stairs between levels</span>
      </div>
    </div>
  );
}
