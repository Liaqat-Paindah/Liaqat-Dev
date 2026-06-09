"use client";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  Building2,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Clock4,
  Sparkles,
  GripVertical,
  MoreHorizontal,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Share2,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/provider/authContext";
import { useCreateConversation } from "@/hooks/useConversations";
import { useRouter } from "next/navigation";

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  status: string;
  gender: string;
  deadline: string;
  vacancies: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    active: {
      bg: "from-emerald-500/15 to-emerald-500/5",
      border: "border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]",
      icon: CheckCircle2,
      pulse: true,
    },
    closed: {
      bg: "from-red-500/15 to-red-500/5",
      border: "border-red-500/30",
      text: "text-red-600 dark:text-red-400",
      glow: "shadow-[0_0_12px_-3px_rgba(239,68,68,0.3)]",
      icon: XCircle,
      pulse: false,
    },
    draft: {
      bg: "from-amber-500/15 to-amber-500/5",
      border: "border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      glow: "shadow-[0_0_12px_-3px_rgba(245,158,11,0.3)]",
      icon: FileText,
      pulse: false,
    },
  }[status.toLowerCase()] || {
    bg: "from-primary/15 to-primary/5",
    border: "border-primary/30",
    text: "text-primary dark:text-cyan-400",
    glow: "shadow-[0_0_12px_-3px_rgba(6,182,212,0.3)]",
    icon: Clock4,
    pulse: false,
  };

  const Icon = config.icon;

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 rounded-full border bg-linear-to-r px-2.5 py-1 text-xs font-medium ${config.bg} ${config.border} ${config.text} ${config.glow}`}
    >
      {config.pulse && (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
};

const NexusTable = ({ data }: { data: Job[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const columns: ColumnDef<Job>[] = useMemo(
    () => [
      {
        id: "selection",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-3.5 w-3.5 rounded border-border/70 bg-background text-primary accent-primary dark:accent-cyan-400"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-3.5 w-3.5 rounded border-border/70 bg-background text-primary accent-primary dark:accent-cyan-400"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <SortHeader column={column} label="Position" />
        ),
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div className="flex min-w-0 max-w-50 items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                className="relative shrink-0"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-border/70 bg-linear-to-br from-background to-muted transition-all group-hover:border-primary/40 dark:group-hover:border-cyan-400/40">
                  <Building2 className="h-4 w-4 text-primary/70 dark:text-cyan-400/70" />
                </div>
              </motion.div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {job.isUrgent && (
                    <span className="shrink-0 rounded bg-red-500/10 px-1 py-0.5 text-[9px] font-bold uppercase text-red-600 dark:text-red-400">
                      Urgent
                    </span>
                  )}
                  <Link
                    href={`/jobs/${job.id}`}
                    className="block truncate text-sm font-semibold tracking-tight hover:text-primary dark:hover:text-cyan-400"
                  >
                    {job.title}
                  </Link>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {job.company}
                </p>
              </div>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <SortHeader column={column} label="Location" />
        ),
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80 dark:text-cyan-300/80" />
            <span className="truncate text-sm">{getValue() as string}</span>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "jobType",
        header: "Type",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-sky-600/80 dark:text-fuchsia-300/80" />
            <span className="text-sm">{getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: "deadline",
        header: ({ column }) => (
          <SortHeader column={column} label="Deadline" />
        ),
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          const now = new Date();
          const diffDays = Math.ceil(
            (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          const isNear = diffDays <= 3;

          return (
            <span
              className={`text-sm ${isNear ? "font-semibold text-red-600 dark:text-red-400" : ""}`}
            >
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {isNear && (
                <span className="ml-1 text-[10px]">({diffDays}d)</span>
              )}
            </span>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "vacancies",
        header: "Vacancies",
        cell: ({ getValue }) => {
          const count = getValue() as number;
          return (
            <span
              className={`inline-flex justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                count <= 2
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-primary/10 text-primary dark:bg-cyan-400/10 dark:text-cyan-400"
              }`}
            >
              {count}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-sm p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-cyan-400/10 dark:hover:text-cyan-400"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-sm p-1.5 text-muted-foreground hover:bg-sky-500/10 hover:text-sky-600 dark:hover:bg-fuchsia-400/10 dark:hover:text-fuchsia-400"
            >
              <Share2 className="h-3.5 w-3.5" />
            </motion.button>
            <Link
              href={`/jobs/${row.original.id}`}
              className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: { sorting, globalFilter, pagination, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "auto",
  });

  const { user } = useAuth();
  const router = useRouter();
  const createConversation = useCreateConversation();

  const handleOpenConversation = async (rowData: any) => {
    if (!user?.id) return;

    const topic = (rowData as any).jobType || (rowData as any).title || 'General';
    const title = (rowData as any).title || topic;
    const otherParticipantId =
      (rowData as any).applicant_id ||
      (rowData as any).applicantId ||
      (rowData as any).ownerId ||
      (rowData as any).applicant?.id;

    const participantIds = otherParticipantId && otherParticipantId !== user.id
      ? [user.id, otherParticipantId]
      : [user.id];

    try {
      const data = await createConversation.mutateAsync({
        participantIds,
        topic,
        title,
      });

      if (data?.id) {
        router.push(`/dashboard/messages?conversationId=${data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group/table relative overflow-hidden rounded-sm border border-border/70 bg-card p-4 dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65)]"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent dark:via-cyan-400/50" />
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-700 dark:via-cyan-400"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <div className="relative border-b border-border/50 bg-linear-to-b from-muted/40 to-transparent px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-primary dark:text-cyan-400" />
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 dark:bg-cyan-400/20" />
              </div>
              <h2 className="text-sm font-bold tracking-tight">Positions</h2>
            </div>
            {Object.keys(rowSelection).length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary dark:bg-cyan-400/10 dark:text-cyan-400"
              >
                {Object.keys(rowSelection).length} selected
              </motion.span>
            )}
            <span className="rounded-full border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
              {table.getFilteredRowModel().rows.length} total
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="text"
                placeholder="Search positions..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-48 rounded-sm border border-border/60 bg-background/80 py-1.5 pl-8 pr-8 text-sm backdrop-blur-sm transition-all placeholder:text-muted-foreground/50 hover:border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 dark:focus:border-cyan-400/50 dark:focus:ring-cyan-400/20"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-sm border p-2 transition-all ${
                showFilters
                  ? "border-primary/50 bg-primary/10 text-primary dark:border-cyan-400/50 dark:bg-cyan-400/10 dark:text-cyan-400"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Quick filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap gap-2 border-t border-border/40 pt-3">
                {["All", "Active", "Draft", "Closed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() =>
                      table
                        .getColumn("status")
                        ?.setFilterValue(
                          filter === "All"
                            ? ""
                            : filter.toLowerCase()
                        )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      (table.getColumn("status")?.getFilterValue() as string) ===
                        filter.toLowerCase() ||
                      (!table.getColumn("status")?.getFilterValue() &&
                        filter === "All")
                        ? "border-primary/50 bg-primary/10 text-primary dark:border-cyan-400/50 dark:bg-cyan-400/10 dark:text-cyan-400"
                        : "border-border/60 bg-background text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border/30 bg-muted/10"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`whitespace-nowrap px-3 py-2 text-left ${
                      ["selection", "vacancies", "status", "actions"].includes(
                        header.id
                      )
                        ? "text-center"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                  transition={{ delay: i * 0.02, duration: 0.25 }}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`group relative border-b border-border/20 transition-all duration-200 ${
                    row.getIsSelected()
                      ? "bg-primary/5 dark:bg-cyan-400/5"
                      : hoveredRow === row.id
                        ? "bg-muted/20"
                        : "hover:bg-muted/10"
                  }`}
                  onClick={() => handleOpenConversation(row.original)}
                >
                  {/* Row highlight bar */}
                  <td className="absolute inset-y-0 left-0 w-0.5 bg-transparent transition-colors group-hover:bg-primary/60 dark:group-hover:bg-cyan-400/60" />

                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap px-3 py-2.5 ${
                        ["selection", "vacancies", "status", "actions"].includes(
                          cell.column.id
                        )
                          ? "text-center"
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Empty state */}
        {table.getRowModel().rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16"
          >
            <div className="mb-3 rounded-full bg-muted/30 p-3">
              <Search className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium">No positions found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Clear filters or try a different search term
            </p>
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="mt-3 rounded-sm bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 dark:bg-cyan-400/10 dark:text-cyan-400"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/40 bg-muted/10 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              data.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground focus:border-primary/50 focus:outline-none dark:focus:border-cyan-400/50"
          >
            {[5, 8, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}/page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-sm p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              const current = table.getState().pagination.pageIndex;
              const total = table.getPageCount();
              let pageIndex: number;

              if (total <= 5) {
                pageIndex = i;
              } else if (current < 2) {
                pageIndex = i;
              } else if (current > total - 3) {
                pageIndex = total - 5 + i;
              } else {
                pageIndex = current - 2 + i;
              }

              if (pageIndex >= total) return null;

              const isActive = current === pageIndex;
              return (
                <motion.button
                  key={pageIndex}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`relative min-w-7 rounded-sm px-2 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-cyan-400/10 dark:text-cyan-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePage"
                      className="absolute inset-0 rounded-sm bg-primary/10 dark:bg-cyan-400/10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative">{pageIndex + 1}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-sm p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Sort header component
const SortHeader = ({
  column,
  label,
}: {
  column: any;
  label: string;
}) => (
  <button
    onClick={() => column.toggleSorting()}
    className="group inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 transition-colors hover:text-foreground"
  >
    {label}
    <span className="flex flex-col -space-y-1">
      <ArrowUp
        className={`h-2.5 w-2.5 transition-all ${
          column.getIsSorted() === "asc"
            ? "text-primary dark:text-cyan-400"
            : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
        }`}
      />
      <ArrowDown
        className={`h-2.5 w-2.5 transition-all ${
          column.getIsSorted() === "desc"
            ? "text-primary dark:text-cyan-400"
            : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
        }`}
      />
    </span>
  </button>
);

export default NexusTable;