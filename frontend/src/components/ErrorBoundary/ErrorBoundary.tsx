import { Flex, Text } from "@mantine/core";
import { ERROR_BOUNDARY_PAGE_TEXT } from "../../constants/string";

export const ErrorBoundary = () => {
  return (
    <Flex align="center" justify="center" pt={100}>
      <Text size="xl">{ERROR_BOUNDARY_PAGE_TEXT}</Text>
    </Flex>
  );
};
