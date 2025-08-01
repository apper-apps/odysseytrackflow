import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Open: { variant: "open", label: "Open" },
    "In Progress": { variant: "progress", label: "In Progress" },
    Resolved: { variant: "resolved", label: "Resolved" },
    Closed: { variant: "closed", label: "Closed" },
  };

  const config = statusConfig[status] || statusConfig.Open;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;