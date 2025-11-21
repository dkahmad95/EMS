// RevenueSummary.tsx
"use client";
import { Box, Typography } from "@mui/material";
import { RevenueRecord } from "../utils/types";

interface Props {
  revenues: RevenueRecord[];
}

export default function RevenueSummary({ revenues }: Props) {
  // Calculate total revenues per currency
  const totalsByCurrency = revenues.reduce<Record<string, number>>((acc, r) => {
    if (!acc[r.currency]) acc[r.currency] = 0;
    acc[r.currency] += r.revenueAmount;
    return acc;
  }, {});


  
  // Count revenues per destination
  const destinationsCount = revenues.reduce<Record<string, number>>((acc, r) => {
    if (!acc[r.destination]) acc[r.destination] = 0;
    acc[r.destination] += 1;
    return acc;
  }, {});

  return (
    <Box display="flex" gap={3} flexWrap="wrap" mb={4} dir="rtl">
      
      
      <Box
        p={3}
        bgcolor="#E0F7FA"
        borderRadius={2}
        flex={1}
        minWidth={150}
      > <Box
  display="flex"
  flexDirection={{ sm: "column", md: "row" }}
  gap={3}        // adds spacing between items
  mb={2}         // margin bottom
  flexWrap="wrap" // allows wrapping if too many currencies
  dir="rtl"
>
  {Object.entries(totalsByCurrency).map(([currency, total]) => (
    <Box
      key={currency}
      p={2}
      bgcolor="#E0F7FA"
      borderRadius={2}
      minWidth={100} // ensures each box has a minimum width
      flex={1}       // distribute space evenly
      textAlign="center"
    >
      <Typography fontWeight="bold" fontSize={'small'}>إجمالي الإيرادات ({currency})</Typography>
      <Typography variant="h5" fontSize={'small'}>{total.toLocaleString()}</Typography>
    </Box>
  ))}
</Box>
      </Box>

      <Box p={3} bgcolor="#FFF3E0" borderRadius={2} flex={1} minWidth={150}>
        <Typography fontWeight="bold">عدد الإيرادات</Typography>
        <Typography variant="h5">{revenues.length}</Typography>
      </Box>

      <Box p={3} bgcolor="#E8F5E9" borderRadius={2} flex={1} minWidth={150}>
        <Typography fontWeight="bold">الوجهات</Typography>
        <Typography>
          {Object.entries(destinationsCount)
            .map(([dest, count]) => `${dest}: ${count}`)
            .join(", ")}
        </Typography>
      </Box>
    </Box>
  );
}
