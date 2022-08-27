import {Container, Graphics} from 'pixi.js';
import {defineQuery, enterQuery, entityExists, exitQuery, hasComponent} from 'bitecs';
import {World} from '../../main';
import {BossComponent} from '../../components/BossComponent';
import {TransformComponent} from '../../components/TransformComponent';
import {EnemyComponent} from '../../components/EnemyComponent';

const color = 0xff0000;
export const createBossHpUiSystem = (ui: Container) => {
  const bossQuery = defineQuery([BossComponent]);
  const enterSpriteQuery = enterQuery(bossQuery);
  const exitSpriteQuery = exitQuery(bossQuery);
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
      container.visible = entityExists(world, enemyId) && hasComponent(world, EnemyComponent, enemyId);

      container.x = TransformComponent.position.x[enemyId];
      container.y = TransformComponent.position.y[enemyId];

      if (container.visible) {
        const hpRotation = (1 - (EnemyComponent.hp[enemyId] / EnemyComponent.maxHp[enemyId])) * Math.PI * 2 || Math.PI * 4;
        fillings.clear();
        fillings.lineStyle({color: color, width: 1});
        fillings.arc(0, 0, 69, -Math.PI / 2, hpRotation - Math.PI / 2, true);
        fillings.endFill()
        fillings.arc(0, 0, 63, -Math.PI / 2, hpRotation - Math.PI / 2, true);
        fillings.endFill();
        fillings.lineStyle({color: 0xffffff, width: 4});
        fillings.arc(0, 0, 66, -Math.PI / 2, hpRotation - Math.PI / 2, true);
      }
    }

    for (const boss of exitSpriteQuery(world)) {
      const [container] = hpGraphicsMap.get(boss)!;
      container.destroy({children: true});
      hpGraphicsMap.delete(boss);
    }

    return world;
  };
};
