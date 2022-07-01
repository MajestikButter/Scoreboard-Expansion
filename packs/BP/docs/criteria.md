[entity-tracked]: #tracking-entity-criteria
[special-writing]: #special-writing

# **Getting Started**

## First steps

1. Give yourself the `op` tag using `/tag @s add op`
2. Type `\help` in chat to view chat commands

&nbsp;

## Creating an Objective

Use the chat command `\scoreboard objectives add <objectiveId> <criteria>` to add an objective.

There are two types of criteria:

- Simple criteria, which have no arguments and look like this: `health`
- Compound criteria, which require an argument to be supplied and look like this: `mbsbe.used:stick`. Compound criteria are written in two parts, the first part being the criteria id and the second being the argument supplied to the criteria, they are: `<criteriaId>:<argument>`. If the argument requires an identifier with a namespace, the `:` normally used is replaced with `.`

&nbsp;

## Tracking Entity Criteria

Some criteria allow you to track entity properties, you can start tracking certain entities by adding them to the scoreboard using `/scoreboard players add <selector> <objective> 0`. You can also stop tracking entities using `/scoreboard players reset <selector> <objective>`.

&nbsp;

## Special Writing

Some criteria have special writing behavior that does a something when a score is changed on a player or entity. These usually mean that they update the property that is being read.

- For example, the `health` criteria supports `Special Writing` and will update the player or entity's health when their score is set.

If a criteria does not support `Special Writing`, nothing will happen when a score is changed on the objective.

&nbsp;

&nbsp;

# **Java Ported Criteria**

## Simple Criteria

### `dummy`

> Normal scoreboard objective criteria that has no special behavior

### `trigger`

> An objective that can be controlled by unopped users via the `\trigger <objective>` command if they are given permission to trigger the objective.
>
> You can enable an objective for a player by using `/tag <target> add enable:<objectiveName>` and replacing `<objectiveName>` with the name of the objective.
>
> **Example**
>
> Ran once: `\scoreboard objectives add spawn trigger`
>
> Ran elsewhere: `/tag @a add enable:spawn`
>
> Now I can run: `\trigger spawn` in chat and the `spawn` objective will increment by one
>
> Using this, I can have another set of command blocks testing if my score is 1 or higher and have it teleport me:
>
> - `execute @a[scores={spawn=1..}] ~~~ tp 0 60 0`
> - `tellraw @a[scores={spawn=1..}] {"rawtext":[{"text":"§bTeleported to Spawn§r"}]}`
> - `scoreboard players reset @a[scores={spawn=1..}] spawn`

### `health`

> [<span style="color:cyan; font-size:20px">**[Entity Tracked]**</span>][entity-tracked] [<span style="color:orange; font-size:20px">**[Special Writing]**</span>][special-writing]

> Stores the player's health value. However, unlike the java variant of this criteria, this objective is writeable. This means that you can run a `scoreboard players set` command to set a players health. Note: this will not allow you to set the player's health above their max health.

### `deathCount`

> Increments when a player dies.

### `level`
> [<span style="color:orange; font-size:20px">**[Special Writing]**</span>][special-writing]

> Stores the player's experience level. Just like the health criteria, this criteria has also been made writeable so you can use `scoreboard players set` to set a player's experience level.

### `playerKillCount`

> Increments when a player kills another player.

### `totalKillCount`

> Increments when a player kills any entity or player.

&nbsp;

## Compound Criteria

### `mined`

> Takes a block identifier as an argument. Increments when a player mines the specified block. This includes creative mode.

### `used`

> Takes an item identifier as an argument. Increments when a player uses/consumes the specified item. Note: this mainly works for items like foods, so it is not identical to the java variant at the moment.

### `killed_by`

> Takes an entity identifier as an argument. Increments when a player is killed by the specified entity.

### `killed`

> Takes an entity identifier as an argument. Increments when a player kills the specified entity.

### **Custom Criteria**

#### `custom:damage_dealt`

> Increments with the amount of damage a player deals to another entity/player when a player attacks something.

#### `custom:damage_taken`

> Increments with the amount of damage a player receives when attacked by another entity/player.

#### `custom:crouch_one_cm`

> Increments when a player is sneaking while moving.

#### `custom:sneak_time`

> Increments while a player is sneaking.

&nbsp;

&nbsp;

# **New Criteria**

## Simple Criteria

### `mbsbe.totalPlaced`

> Increments when a player places any block

### `mbsbe.totalMined`

> Increments when a player mines any block

### `mbsbe.totalInteractWithBlock`

> Increments when a player starts interacting with any block

### `mbsbe.totalInteractingWithBlock`

> Increments while a player is interacting with any block

### `mbsbe.totalUsed`

> Increments when a player uses any item, works with most items.

### `mbsbe.travelOneCm`

> Increments when a player moves.

### `mbsbe.chat`

> Increments when a player sends a message in chat.

&nbsp;

## Compound Criteria

### `mbsbe.interactingWithBlock`

> Takes a block identifier as an argument. Increments while a player is interacting with a specified block.

### `mbsbe.interactWithBlock`

> Takes a block identifier as an argument. Increments when a player starts interacting with a specified block.

### `mbsbe.placed`

> Takes a block identifier as an argument. Increments when a player places the specified block.

### `mbsbe.used`

> Takes an item identifier as an argument. Increments when a player starts using a specified item, works with most items.

### `mbsbe.usedOn`

> Takes an item identifier as an argument. Increments when a player starts using a specified item on any block, works with most items.

### `mbsbe.usingOn`

> Takes an item identifier as an argument. Increments while a player is using a specified item on any block, works with most items.

### `mbsbe.movement`

> [<span style="color:cyan; font-size:20px">**[Entity Tracked]**</span>][entity-tracked] [<span style="color:orange; font-size:20px">**[Special Writing]**</span>][special-writing]

> Takes a positive integer as an argument. The argument will specify how many decimals to include in the output score. Stores the movement value of the player or entity being tracked (used for ground speed, changes when a player is sprinting or gains a speed modifying effect)

### Position Criteria

> [<span style="color:cyan; font-size:20px">**[Entity Tracked]**</span>][entity-tracked] [<span style="color:orange; font-size:20px">**[Special Writing]**</span>][special-writing]

> Position criteria:
>
> - `mbsbe.positionX`
> - `mbsbe.positionY`
> - `mbsbe.positionZ`
>
> Position criteria are used to store the player's position.
>
> Each position criteria takes a positive integer as an argument. The argument will specify how many decimals to include in the output score.
>
> For example, if the player's position on one axis is 10.313 and the argument is set to 2, the output score will be 1031. Setting the score of an objective with this type will also set the player's position on that coordinate.

### Velocity Criteria

> [<span style="color:cyan; font-size:20px">**[Entity Tracked]**</span>][entity-tracked] [<span style="color:orange; font-size:20px">**[Special Writing]**</span>][special-writing]

> Velocity criteria:
>
> - `mbsbe.velocityX`
> - `mbsbe.velocityY`
> - `mbsbe.velocityZ`
>
> Velocity criteria are used to store the player's velocity.
>
> Each velocity criteria takes a positive integer as an argument. The argument will specify how many decimals to include in the output score.
>
> For example, if the player's velocity on one axis is 10.313 and the argument is set to 2, the output score will be 1031. Setting the score of an objective with this type will also set the player's velocity on that axis.

### Rotation Criteria

> [<span style="color:cyan; font-size:20px">**[Entity Tracked]**</span>][entity-tracked] [<span style="color:orange; font-size:20px">**[Special Writing]**</span>][special-writing]

> Rotation criteria:
>
> - `mbsbe.rotationX`
> - `mbsbe.rotationY`
>
> Rotation criteria are used to store the player's rotation.
>
> Each rotation criteria takes a positive integer as an argument. The argument will specify how many decimals to include in the output score.
>
> For example, if the player's rotation on one axis is 18.324 degrees and the argument is set to 2, the output score will be 1832. Setting the score of an objective with this type will also set the player's rotation on that axis.

### View Vector Criteria

> [<span style="color:cyan; font-size:20px">**[Entity Tracked]**</span>][entity-tracked]

> View vector criteria:
>
> - `mbsbe.viewVectorX`
> - `mbsbe.viewVectorY`
> - `mbsbe.viewVectorZ`
>
> View vector criteria are used to store the player's view vector.
>
> Each view vector criteria takes a positive integer as an argument. The argument will specify how many decimals to include in the output score.
>
> For example, if the player's view vector on one axis is 10.313 and the argument is set to 2, the output score will be 1031.
