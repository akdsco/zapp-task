import { Box, Container, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

type PageProps = PropsWithChildren<{ title: string; description: string }>;

export const Page = ({ title, description, children }: PageProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Box maxWidth="sm" mx="auto">
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>{children}</Box>
    </Container>
  );
};
