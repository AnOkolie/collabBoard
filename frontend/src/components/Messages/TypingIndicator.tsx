import { IconPointFilled } from "@tabler/icons-react";
import { motion } from "motion/react";
import { Box, Group, Paper, Avatar, Text, Flex, Stack } from "@mantine/core";

import classes from "./TypingIndicator.module.css";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";
export const TypingIndicator = () => {
  const { typingUsers } = useMessageStore();
  return (
    <>
      <Flex dir="row" justify={"flex-start"}>
        <Avatar.Group>
          {typingUsers &&
            typingUsers.map((user) => (
              <Avatar src={user.profilepic} size="sm" />
            ))}
        </Avatar.Group>
        <TypingDots />
      </Flex>
    </>
  );
};

const TypingDots = () => {
  return (
    <>
      <Paper
        radius="xl"
        p="sm"
        withBorder
        className={classes.bubble}
        bg={"gray.3"}
        __size="md"
      >
        <Group gap={4}>
          <Box className={`${classes.dot}`} />
          <Box className={`${classes.dot} ${classes.dot2}`} />

          <Box className={`${classes.dot} ${classes.dot3}`} />
        </Group>
      </Paper>
    </>
  );
};
