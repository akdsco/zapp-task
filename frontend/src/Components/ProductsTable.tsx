import {
  DataGrid,
  type GridColDef,
  GridOverlay,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Product } from "shared";
import { useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

type ProductsTableProps = {
  loading: boolean;
  products: Product[];
  onDelete: (id: number) => void;
};

export const ProductsTable = ({
  loading,
  products,
  onDelete,
}: ProductsTableProps) => {
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  useResizeObserver(containerRef, () => {
    // TODO: could debounce, hacky solution, letting go due to time constraint
    setWidth((k) => k + 1); // triggers re-render
  });

  const columns: GridColDef[] = [
    { field: "sku", headerName: "SKU", minWidth: 25, flex: 1 },
    { field: "quantity", headerName: "Qty", type: "number", flex: 1 },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "store",
      headerName: "Store",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Remove",
      width: 75,
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <IconButton size="small" onClick={() => onDelete(row.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <div ref={containerRef} style={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h6" gutterBottom>
        Data explorer
      </Typography>
      <DataGrid
        key={width}
        loading={loading}
        rows={products}
        columns={columns}
        getRowId={({ id }) => id}
        density={isMobile ? "compact" : "standard"}
        columnVisibilityModel={{
          description: !isMobile,
        }}
        slots={{
          noRowsOverlay: () => (
            <GridOverlay>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1">
                  No products saved yet
                </Typography>
              </Box>
            </GridOverlay>
          ),
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
      />
    </div>
  );
};
