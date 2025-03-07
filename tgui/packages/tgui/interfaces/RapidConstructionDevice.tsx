import { BooleanLike, classes } from "common/react";
import { capitalize } from "../../common/string";
import { useState } from "react";

import { useBackend, useLocalState } from "../backend";
import {
  Box,
  Button,
  LabeledList,
  Section,
  Stack,
  Tabs,
  Icon,
} from "../components";
import { GameIcon } from "../components/GameIcon";
import { AirlockMainSection } from "./AirlockElectronics";
import { Window } from "../layouts";

type Data = {
  matterLeft: number;
  root_categories: string[];
  selected_root: string;
  categories: Category[];
  selected_category: string;
  selected_design: string;
  display_tabs: BooleanLike;
};

type Category = {
  cat_name: string;
  designs: Design[];
};

type Design = {
  title: string;
  type: string;
  icon: string;
};

export const MatterItem = (props: any) => {
  const { data } = useBackend<Data>();
  const { matterLeft } = data;
  return (
    <LabeledList.Item label="Units Left">
      &nbsp;{matterLeft} Units
    </LabeledList.Item>
  );
};

const CategoryItem = (props: any) => {
  const { act, data } = useBackend<Data>();
  const { root_categories = [], selected_root } = data;
  return (
    <LabeledList.Item label="Category">
      {root_categories.map((root) => (
        <Button
          key={root}
          content={root}
          selected={selected_root === root}
          color="transparent"
          onClick={() => act("root_category", { root_category: root })}
        />
      ))}
    </LabeledList.Item>
  );
};

export const InfoSection = (props: any) => {
  const { data } = useBackend<Data>();

  return (
    <Section>
      <LabeledList>
        <MatterItem />
        <CategoryItem />
      </LabeledList>
    </Section>
  );
};

const DesignSection = (props: any) => {
  const { act, data } = useBackend<Data>();
  const { categories = [], selected_category, selected_design } = data;
  const [categoryName, setCategoryName] = useLocalState(
    "false",
    selected_category
  );
  const shownCategory =
    categories.find((category) => category.cat_name === categoryName) ||
    categories[0];

  return (
    <Section fill scrollable>
      <Tabs>
        {categories.map((category) => (
          <Tabs.Tab
            key={category.cat_name}
            selected={category.cat_name === shownCategory.cat_name}
            onClick={() => setCategoryName(category.cat_name)}
          >
            {category.cat_name}
          </Tabs.Tab>
        ))}
      </Tabs>
      {shownCategory?.designs.map((design, i) => (
        <Button
          key={i + 1}
          fluid
          height="32px"
          color="transparent"
          selected={
            design.type === selected_design &&
            shownCategory.cat_name === selected_category
          }
          onClick={() =>
            act("design", {
              category: shownCategory.cat_name,
              index: i + 1,
            })
          }
        >
          <Box inline verticalAlign="middle" mr="10px">
            <GameIcon html={design.icon} />
          </Box>
          {capitalize(design.title)}
        </Button>
      ))}
    </Section>
  );
};

const ConfigureSection = (props: any) => {
  const { data } = useBackend<Data>();
  const { selected_root } = data;

  return (
    <Stack.Item grow>
      {selected_root === "Airlock Access" ? (
        <AirlockMainSection />
      ) : (
        <DesignSection />
      )}
    </Stack.Item>
  );
};

export const RapidConstructionDevice = (props: any) => {
  return (
    <Window width={450} height={590}>
      <Window.Content>
        <Stack vertical fill>
          <Stack.Item>
            <InfoSection />
          </Stack.Item>
          <Stack.Item grow>
            <Stack fill>
              <ConfigureSection />
            </Stack>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
