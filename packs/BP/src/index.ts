import "./classes/ObjectiveMap";

// import { Debug } from "mbcore-gametest";
// import { World, world } from "mojang-minecraft";
// function subEvent(event: keyof World["events"]) {
//   const eventClass = world.events[event];
//   eventClass.subscribe((evd) =>
//     console.warn(`${event}: ${Debug.format(evd, " §7|", 0)}`)
//   );
// }
// function subAllEvents(ignore: string[]) {
//   for (let event in world.events) {
//     if (ignore.includes(event)) continue;
//     subEvent(event as keyof World["events"]);
//   }
// }
// subAllEvents(['tick', 'chat', 'beforeChat']);

// import { MinecraftBlockTypes, world } from "mojang-minecraft";
// world.events.beforeChat.subscribe(() => {
//   const tagMap: { [tag: string]: string[] } = {};
//   for (const type of MinecraftBlockTypes.getAllBlockTypes()) {
//     const p = type.createDefaultBlockPermutation();
//     p.getTags().forEach((v) => {
//       if (!tagMap[v]) tagMap[v] = [];
//       tagMap[v].push(type.id.replace("minecraft:", ""));
//     });
//   }
//   let md = "### Block Tags";
//   for (let tag in tagMap) {
//     md += `\n#### ${tag}\n\`` + tagMap[tag].join(', ') + "`";
//   }
//   console.warn(md);
// });
