import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { type ProductInput, ProductInputSchema } from "shared";
import type { WithProductAddProps } from "../Containers/ProductManager.tsx";

const UploadSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File && val.type === "text/csv", {
      message: "Only CSV files are allowed",
    })
    .refine((file) => file?.name.endsWith(".csv"), {
      message: "File must have .csv extension",
    }),
});

type UploadFormValues = z.infer<typeof UploadSchema>;

export const ProductCsvUpload = ({ addProducts }: WithProductAddProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(UploadSchema),
  });

  const [parsedData, setParsedData] = useState<ProductInput | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const result = await UploadSchema.safeParseAsync({ file });

    if (!result.success) {
      setParseError(result.error.format().file?._errors?.[0] ?? "Invalid file");
      return;
    }

    // Clear previous errors and update form state
    setParseError(null);
    setValue("file", file, { shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    onDrop,
    onDropRejected: (fileRejections) => {
      const reason =
        fileRejections[0]?.errors[0]?.message ?? "Invalid file type";
      setParseError(`Rejected file: ${reason}`);
    },
  });

  const onSubmit = (data: UploadFormValues) => {
    setIsParsing(true);
    setParseError(null);
    setParsedData(null);

    Papa.parse(data.file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setIsParsing(false);
        const rowErrors: string[] = [];
        const productInput: ProductInput = [];

        const rowSchema = ProductInputSchema.element;

        result.data.forEach((row: any, index: number) => {
          const unvalidatedRow = {
            sku: row.sku,
            quantity: Number(row.quantity),
            description: row.description === "" ? null : row.description,
            store: row.store,
          };

          const validateRow = rowSchema.safeParse(unvalidatedRow);

          if (!validateRow.success) {
            const issues = validateRow.error.errors
              .map((e) => `'${e.path[0]}' ${e.message}`)
              .join(", ");
            rowErrors.push(`Row ${index + 2}: ${issues}`); // +2 to account for header row
          } else {
            productInput.push(validateRow.data);
          }
        });

        if (rowErrors.length > 0) {
          setParseError(rowErrors.join("\n"));
        } else {
          addProducts(productInput);
          // TODO: could be improved with a Toast notification and input reset, leaving as is
          setParsedData(productInput);
          console.log(productInput);
        }
      },
      error: (err) => {
        setParseError(err.message);
        setIsParsing(false);
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      p={2}
      maxWidth="sm"
      mx="auto"
    >
      <Typography variant="h6" gutterBottom>
        Add with a CSV file
      </Typography>
      <Controller
        name="file"
        control={control}
        render={({ field }) => (
          <Paper
            {...getRootProps()}
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              backgroundColor: isDragActive ? "grey.100" : "transparent",
              cursor: "pointer",
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            <UploadFileIcon fontSize="large" color="action" />
            <Typography variant="body1" mt={1}>
              {isDragActive
                ? "Drop your CSV here"
                : "Drag & drop or click to upload CSV"}
            </Typography>
            {field.value && (
              <Typography variant="caption" mt={1} display="block">
                Selected: {field.value.name}
              </Typography>
            )}
          </Paper>
        )}
      />

      {errors.file && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.file.message}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isParsing}
        startIcon={isParsing ? <CircularProgress size={20} /> : undefined}
      >
        {isParsing ? "Parsing..." : "Upload CSV"}
      </Button>

      {parsedData && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Successfully added {parsedData.length} products!
        </Alert>
      )}

      {parseError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {parseError}
        </Alert>
      )}
    </Box>
  );
};
