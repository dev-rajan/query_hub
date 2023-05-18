const possibleStatus = [
  {
    id: "backlog",
    label: "Backlog",
  },
  {
    id: "todo",
    label: "Todo",
  },
  {
    id: "inProgress",
    label: "InProgress",
  },
  {
    id: "done",
    label: "Done",
  },
  {
    id: "cancelled",
    label: "Cancelled",
  },
];

export function StatusSelect({ value, onChange, noEmptyOption = false }) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      {noEmptyOption ? null : (
        <option value="">Select a status to filter</option>
      )}
      {possibleStatus.map((status) => (
        <option value={status.id} key={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
