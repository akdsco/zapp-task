import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductInputSchema } from "shared";
import { z } from "zod";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { WithProductAddProps } from "../Containers/ProductManager.tsx";

type ProductInput = z.infer<typeof ProductInputSchema>[number];

// TODO: suboptimal use of types from zod, skipping fix due to time constraints

export const ProductManualAdd = ({ addProducts }: WithProductAddProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductInputSchema.element),
    defaultValues: {
      sku: "",
      quantity: 0,
      description: "",
      store: "",
    },
  });

  const onSubmit = async (data: ProductInput) => {
    await addProducts([data]);
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 2, pb: 4 }}
    >
      <Typography variant="h6" gutterBottom>
        Add manually
      </Typography>
      <Stack spacing={2}>
        <TextField
          size="small"
          label="SKU"
          fullWidth
          {...register("sku")}
          error={!!errors.sku}
          helperText={errors.sku?.message}
        />
        <TextField
          size="small"
          label="Quantity"
          type="number"
          fullWidth
          {...register("quantity", { valueAsNumber: true })}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />
        <TextField
          size="small"
          label="Store"
          fullWidth
          {...register("store")}
          error={!!errors.store}
          placeholder="e.g. BAT or LON"
          helperText={errors.store?.message}
        />
        <TextField
          size="small"
          label="Description"
          fullWidth
          multiline
          rows={2}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <Button variant="contained" type="submit">
          Add Product
        </Button>
      </Stack>
    </Box>
  );
};
