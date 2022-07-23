import {Container, ITextStyle, Text} from 'pixi.js';
import {defineQuery} from 'bitecs';
import {World} from '../../main';
import {PlayerComponent} from '../../components/PlayerComponent';

export const createInfoBoxSystem = (infoContainer: Container, width: number) => {
  const playerQuery = defineQuery([PlayerComponent]);

  const fontSize = 36;
  const lineSize = fontSize + 20;
  let y = 10;
  const labelStyle: Partial<ITextStyle> = {fontFamily: 'Verdana', fontSize, fill: 0xffffff};
  const valueStyle: Partial<ITextStyle> = {...labelStyle};

  const highScoreLabel = new Text('Highscore:', labelStyle);
  highScoreLabel.position = {x: 10, y};
  infoContainer.addChild(highScoreLabel);

  const highScoreValue = new Text('-1', valueStyle);
  highScoreValue.position = {x: width - 10, y};
  highScoreValue.anchor.x = 1;
  infoContainer.addChild(highScoreValue);
  y += lineSize;

  const scoreLabel = new Text('Score:', labelStyle);
  scoreLabel.position = {x: 10, y};
  infoContainer.addChild(scoreLabel);

  const scoreValue = new Text('100,000,000', valueStyle);
  scoreValue.position = {x: width - 10, y};
  scoreValue.anchor.x = 1;
  infoContainer.addChild(scoreValue);
  y += lineSize;

  const livesLabel = new Text('Lives:', labelStyle);
  livesLabel.position = {x: 10, y};
  infoContainer.addChild(livesLabel);

  const livesValue = new Text('3/3', valueStyle);
  livesValue.position = {x: width - 10, y};
  livesValue.anchor.x = 1;
  infoContainer.addChild(livesValue);

  return (world: World) => {
    const player = playerQuery(world)[0];

    const scoreText = Intl.NumberFormat().format(PlayerComponent.score[player]);
    if (scoreValue.text !== scoreText) scoreValue.text = scoreText;

    const livesText = `${PlayerComponent.lives[player]}/${PlayerComponent.maxLives[player]}`;
    if (livesValue.text !== livesText) livesValue.text = livesText;

    return world;
  };
};
