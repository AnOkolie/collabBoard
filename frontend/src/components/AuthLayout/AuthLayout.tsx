import { Box, Container, Paper } from "@mantine/core";

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <Container size={440}>
        <Paper radius="xl" p="xl" shadow="xl" withBorder>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
