import { useBackend, useLocalState } from "../backend";
import { Window } from "../layouts";
import { Button, Dropdown, Flex, LabeledList, Stack, Box, NoticeBox} from "../components";
import { GameIcon } from "../components/GameIcon";

type Power = {
  name: string;
  icon: string;
  description: string;
  owned: boolean;
  cost: number;
};

type StaticData = {
  icons: {
    genom: string;
    spell_background: string;
    spell_unlocked_background: string;
  };
};

type InputData = {
  powers: Power[];
  points: number;
} & StaticData;

const PowerIcon = (props: Power) => {
  const { data } = useBackend<InputData>();
  const { icons } = data;

  const backgroundImage = props.owned
    ? icons.spell_unlocked_background
    : icons.spell_background;

    return (
      <div className="PowerIcon">
        <GameIcon
          className="PowerBackroundImage"
          html={backgroundImage}
        ></GameIcon>
        <GameIcon className="PowerIcon" html={props.icon}></GameIcon>
      </div>
    );
  };

const PowerCard = (props: Power) => {
  const { data, act } = useBackend<InputData>();

  const buyPower = (powerName) => {
    act("mutate", {
      power_name: powerName,
    });
  };

  return (
    <Flex
      className={`PowerCard ${props.owned ? "PowerCard--owned" : ""}`}
      direction="column"
    >
      <Flex align="center">
        {PowerIcon(props)}
        <span className="PowerName">{props.name}</span>
      </Flex>
      <p>
        <b>Cost:</b> {props.cost === 0 ? "Free" : props.cost}
      </p>
      <p>{props.description}</p>
      {props.owned ? (
        ""
      ) : props.cost > data.points ? (
        <p
          className="EvolveButton EvolveButton--not-enough"
          title="You have not enough evolution points."
        >
          Not Enough
        </p>
      ) : (
        <p className="EvolveButton" onClick={() => buyPower(props.name)}>
          Evolve
        </p>
      )}
    </Flex>
  );
};

export const Undead = (props: any) => {
  const { data } = useBackend<InputData>();
  return (
    <Window theme="changeling" width={412} height={500}>
      <link rel="stylesheet" type="text/css" href="exocet.css" />
      <link rel="stylesheet" type="text/css" href="pelagiad.css" />
      <Window.Content scrollable>
        <Flex direction="column" align="center">
          <p className="EvolutionPoints">Mutation points: {data.points}</p>
          <Flex
            width="100%"
            id="PowersList"
            direction="column"
            justify="space-between"
          >
          {data.powers.map((p) => PowerCard(p))}
          </Flex>
        </Flex>
      </Window.Content>
    </Window>
  );
};
