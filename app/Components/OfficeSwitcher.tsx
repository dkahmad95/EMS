"use client";

import { TextField, MenuItem } from "@mui/material";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { usePermissions } from "../hooks/usePermissions";

const muiSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#fff",
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5", borderWidth: "2px" },
  },
};

export default function OfficeSwitcher() {
  const { availableOffices, currentOfficeId, switchOffice, hasAllOfficesAccess, isLoading } =
    usePermissions();

  if (isLoading || availableOffices.length === 0) return null;

  // Single-office user: no switching, just show which office they belong to
  if (!hasAllOfficesAccess) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 mx-2 md:mx-3 mt-2 md:mt-3 rounded-lg bg-gray-50 border border-gray-100 text-gray-600">
        <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0 text-primary-600" />
        <span className="text-xs font-semibold truncate">{availableOffices[0].office_name}</span>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-3 mt-2 md:mt-3">
      <TextField
        select
        fullWidth
        size="small"
        value={currentOfficeId ?? "all"}
        onChange={(e) =>
          switchOffice(e.target.value === "all" ? null : Number(e.target.value))
        }
        sx={{ minWidth: 130, ...muiSx }}
        slotProps={{
          select: {
            startAdornment: (
              <BuildingOfficeIcon className="w-4 h-4 ml-2 flex-shrink-0 text-primary-600" />
            ),
          },
        }}
      >
        <MenuItem value="all" sx={{ fontFamily: "Cairo, sans-serif", fontSize: "13px" }}>
          جميع المكاتب
        </MenuItem>
        {availableOffices.map((o) => (
          <MenuItem
            key={o.office_id}
            value={o.office_id}
            sx={{ fontFamily: "Cairo, sans-serif", fontSize: "13px" }}
          >
            {o.office_name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
