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

> Stores the player's health value. However, unlike the java variant of this criteria, this objective is writeable. This means that you can run a `scoreboard players set` command to set a players health. Note: this will not allow you to set the player's health above their max health.

### `deathCount`

> Increments when a player dies.

### `level`

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

### Position Criteria

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
> For example, if the player's coordinate is 10.313 and the argument is set to 2, the output score will be 1031. Setting the score of an objective with this type will also set the player's position on that coordinate.
