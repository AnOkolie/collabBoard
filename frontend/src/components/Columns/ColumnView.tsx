import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridCol,
  Input,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconGitFork,
  IconHome,
  IconPlus,
  IconSettings,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { use, useEffect, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import { ColumnResponse, ColumnType } from "~/types/columns";
import { useDroppable } from "@dnd-kit/core";
import { useDisclosure } from "@mantine/hooks";
import { create } from "node:domain";
import {
  CANCEL_BUTTON_TEXT,
  CREATE_BUTTON_TEXT,
  CREATE_CARD_BUTTON_TEXT,
  CREATE_COLUMN_BUTTON_TEXT,
  CREATE_COLUMN_DESCRIPTION,
  EXPORT_DATA_BUTTON_TEXT,
  PROJECT_HEADER_TEXT,
} from "../../constants/string";

export const ColumnView = () => {
  type LoaderData = {
    data: {
      message: string;
      columns: ColumnType[];
    };
  };
  const { data } = useLoaderData() as LoaderData;
  const [createColumnOpened, createColumnHandlers] = useDisclosure(false);
  const [createCardOpened, createCardHandlers] = useDisclosure(false);
  const [boardId, setBoardId] = useState("");

  useEffect(() => {
    if (data.columns && data.columns.length > 0) {
      setBoardId(data.columns[0].board_id);
    }
  }, [data.columns]);

  const columns = data.columns ?? [];

  console.log("columns in ColumnView", useLoaderData()); // => returns backend response
  console.log("columns in ColumnView", columns); // => returns empty array

  return (
    <Container fluid h="80vh" w="100%" p={"xl"}>
      <Flex direction="column" align="center" gap="md">
        {/* Top Bar */}
        <Paper withBorder radius="md" p="sm" w="100%">
          <Flex align="center">
            {/* Left side */}
            <Flex align="center" gap="xs" style={{ flex: 1 }}>
              <IconHome size={16} />
              <Text size="sm">{">"}</Text>
              <Text size="sm" variant="link" component="a" href="/" span>
                {PROJECT_HEADER_TEXT}
              </Text>
              <Text size="sm">{">"}</Text>
            </Flex>

            {/* Right side */}
            <Flex align="center" gap="md">
              <IconSettings />
              <IconGitFork />
              <IconUser />
              <Button size="sm" rightSection={<IconUpload size={16} />}>
                {EXPORT_DATA_BUTTON_TEXT}
              </Button>
              <Button onClick={createColumnHandlers.open}>
                {CREATE_COLUMN_BUTTON_TEXT}
              </Button>
            </Flex>
          </Flex>
        </Paper>

        {/* Board */}
        <Paper withBorder radius="md" p="md" w="100%" style={{ flex: 1 }}>
          <Modal
            opened={createColumnOpened}
            onClose={createColumnHandlers.close}
            title="Add a new Column"
            centered
            withinPortal
            zIndex={4000}
            overlayProps={{ zIndex: 3999 }}
          >
            <Form method="post">
              <Input type="hidden" name="boardId" value={boardId} />
              <Text>{CREATE_COLUMN_DESCRIPTION}</Text>
              <TextInput
                label="Column Title"
                placeholder="e.g. To Do"
                name="columnTitle"
              />
              <Flex justify={"flex-end"} mt="md" gap="md">
                <Button variant="outline" onClick={createColumnHandlers.close}>
                  {CANCEL_BUTTON_TEXT}
                </Button>
                <Button onClick={createColumnHandlers.close} type="submit">
                  {CREATE_BUTTON_TEXT}
                </Button>
              </Flex>
            </Form>
          </Modal>
          <Grid h="100%" columns={columns.length} gutter="md">
            {columns.map((column) => (
              <Grid.Col span={1} key={column.id}>
                <Card withBorder radius="md" p="md" h="100%">
                  <Flex
                    direction={"row"}
                    align="center"
                    justify="space-between"
                    mb="md"
                  >
                    <Text size="lg" fw={700} mb="md">
                      {column.title}
                    </Text>
                    <IconPlus size={20} onClick={createCardHandlers.open} />
                  </Flex>
                </Card>
                <Modal
                  opened={createCardOpened}
                  onClose={createCardHandlers.close}
                  title="Add a new Card"
                  centered
                  withinPortal
                  zIndex={4000}
                >
                  <TextInput
                    label="Card Title"
                    placeholder="e.g. Task 1"
                    name="cardTitle"
                  />
                  <Flex justify={"flex-end"} mt="md" gap="md">
                    <Button
                      mt="md"
                      onClick={createCardHandlers.close}
                      type="submit"
                    >
                      {CREATE_CARD_BUTTON_TEXT}
                    </Button>
                    <Button
                      mt="md"
                      variant="outline"
                      onClick={createCardHandlers.close}
                    >
                      {CANCEL_BUTTON_TEXT}
                    </Button>
                  </Flex>
                </Modal>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      </Flex>
    </Container>
  );
};
