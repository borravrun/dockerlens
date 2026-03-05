import { useContainerContext } from "@/store/container-context";

function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
}

export default function DrawerDetails() {
  const { containerDetails: details } = useContainerContext();

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 border-b border-b-[#333332]">
      <h2 className="text-sm font-inter font-semibold text-[#737373] uppercase">
        Container Details
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 font-sans">
          <p className="text-xs text-[#737373] uppercase font-medium">
            Container ID
          </p>
          <p className="text-sm text-[#E5E5E5] font-mono">
            {details?.id?.substring(0, 12)}
          </p>
        </div>
        <div className="flex flex-col gap-1 font-sans">
          <p className="text-xs text-[#737373] uppercase font-medium">Image</p>
          <p className="text-sm text-[#E5E5E5]">{details?.image || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1 font-sans">
          <p className="text-xs text-[#737373] uppercase font-medium">
            Created
          </p>
          <p className="text-sm text-[#E5E5E5]">
            {formatDate(details?.created)}
          </p>
        </div>
        <div className="flex flex-col gap-1 font-sans">
          <p className="text-xs text-[#737373] uppercase font-medium">
            Restart Policy
          </p>
          <p className="text-sm text-[#E5E5E5]">
            {details?.restart_policy || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#737373] uppercase font-medium">Ports</p>
        {details?.ports && details.ports.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {details.ports.map((port, index) => (
              <span
                key={index}
                className="text-sm text-[#E5E5E5] bg-[#262626] px-2 py-1 rounded font-mono"
              >
                {port}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#525252]">No ports exposed</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#737373] uppercase font-medium">Mounts</p>
        {details?.mounts && details.mounts.length > 0 ? (
          <div className="flex flex-col gap-1">
            {details.mounts.map((mount, index) => (
              <span
                key={index}
                className="text-sm text-[#E5E5E5] bg-[#262626] px-2 py-1 rounded font-mono truncate"
              >
                {mount}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#525252]">No mounts configured</p>
        )}
      </div>
    </div>
  );
}
