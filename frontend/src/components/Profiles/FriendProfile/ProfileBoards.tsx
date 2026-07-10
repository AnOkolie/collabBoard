import { Grid, Card, Flex, Pill, Progress, Text, Title } from "@mantine/core";
import { profile, profileBoards } from "../../../types/user";
type props = {
  boards: profileBoards[];
  user: profile;
};

export const ProfileBoards = ({ boards, user }: props) => {
  const groups = [
    { name: "Web Design", color: "Blue" },
    { name: "Mobile App", color: "Orange" },
    { name: "App Development", color: "Pink" },
    { name: "Landing Page", color: "Blue" },
    { name: "Dashboard", color: "Purple" },
  ];

  const colorMatch = groups.reduce<Record<string, string>>((acc, group) => {
    acc[group.name] = group.color;
    return acc;
  }, {});
  return (
    <>
      {boards.length > 0 ? (
        <>
          <Title>Boards</Title>
          <Grid>
            {boards.map((board) => (
              <Grid.Col span={{ base: 12, sm: 6, xl: 4 }} key={board.id}>
                <Card
                  withBorder
                  radius="lg"
                  p="md"
                  style={{ cursor: "pointer" }}
                >
                  <Flex justify="space-between" align="center" mb="sm">
                    <Pill
                      color={colorMatch[board.title]?.toLowerCase() || "gray"}
                    >
                      {board.title}
                    </Pill>
                  </Flex>

                  <Text size="sm" mb="sm">
                    {board.title}
                  </Text>

                  <Progress value={board.progress ?? 0} />
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="xl"
          gap="xs"
        >
          <Text fw={600} size="lg">
            No boards yet
          </Text>

          <Text size="sm" c="dimmed" ta="center">
            {`${user.username} hasn't created or joined any boards.`}
          </Text>
        </Flex>
      )}
    </>
  );
};
