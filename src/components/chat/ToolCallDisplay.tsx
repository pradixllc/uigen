import { Loader2, FilePlus, FilePen, FileSearch, Trash2, FolderInput } from "lucide-react";

interface ToolCallDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
}

function getFilename(path: unknown): string {
  if (typeof path !== "string" || !path) return "";
  return path.split("/").pop() ?? path;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const filename = getFilename(args.path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    const newFilename = getFilename(args.new_path);
    switch (args.command) {
      case "rename":
        return `Renaming ${filename} to ${newFilename}`;
      case "delete":
        return `Deleting ${filename}`;
    }
  }

  return toolName;
}

function getIcon(toolName: string, args: Record<string, unknown>) {
  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return FilePlus;
      case "str_replace":
      case "insert":
        return FilePen;
      case "view":
        return FileSearch;
    }
  }
  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return FolderInput;
      case "delete":
        return Trash2;
    }
  }
  return null;
}

export function ToolCallDisplay({ toolName, args, state }: ToolCallDisplayProps) {
  const label = getLabel(toolName, args);
  const done = state === "result";
  const Icon = getIcon(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      {Icon && <Icon className="w-3 h-3 text-neutral-500 flex-shrink-0" />}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
