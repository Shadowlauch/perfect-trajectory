import {Container, Graphics} from 'pixi.js';
import {defineQuery, enterQuery, entityExists} from 'bitecs';
import {World} from '../../main';
import {BossComponent} from '../../components/BossComponent';
import {Transform} from '../../components/Transform';
import {Enemy} from '../../components/Enemy';

const color = 0xff0000;
export const createBossHpUiComponent = (ui: Container) => {
  const bossQuery = defineQuery([BossComponent]);
  const enterSpriteQuery = enterQuery(bossQuery);
  //const exitSpriteQuery = exitQuery(spriteQuery);
  const hpGraphicsMap: Map<number, [Container, Graphics, Graphics]> = new Map();

  return (world: World) => {

    for (const boss of enterSpriteQuery(world)) {
      const container = new Container();
      ui.addChild(container);

      const border = new Graphics();
      border.lineStyle({color: color, width: 1, alpha: 0.5});
      border.arc(0, 0, 70, 0, Math.PI * 2);
      border.closePath();
      border.arc(0, 0, 62, 0, Math.PI * 2);
      container.addChild(border);

      const fillings = new Graphics();
      container.addChild(fillings);

      hpGraphicsMap.set(boss, [container, border, fillings]);
    }

    for (const boss of bossQuery(world)) {
      const [container,, fillings] = hpGraphicsMap.get(boss)!;
      const enemyId = BossComponent.stageEid[boss];
      container.visible = entityExists(world, enemyId);

      container.x = Transform.position.x[enemyId];
      container.y = Transform.position.y[enemyId];

      if (container.visible) {
        const hpAngle = (1 - (Enemy.hp[enemyId] / Enemy.maxHp[enemyId])) * Math.PI * 2 || Math.PI * 4;
        fillings.clear();
        fillings.lineStyle({color: color, width: 1});
        fillings.arc(0, 0, 69, -Math.PI / 2, hpAngle - Math.PI / 2, true);
        fillings.endFill()
        fillings.arc(0, 0, 63, -Math.PI / 2, hpAngle - Math.PI / 2, true);
        fillings.endFill();
        fillings.lineStyle({color: 0xffffff, width: 4});
        fillings.arc(0, 0, 66, -Math.PI / 2, hpAngle - Math.PI / 2, true);
      }
    }


    return world;
  };
};
