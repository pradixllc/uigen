"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden bg-[#0e0e14]">
          <ResizablePanelGroup id="main-layout" direction="horizontal" className="h-full">
            {/* Left Panel - Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col bg-[#0e0e14]">
                {/* Chat Header */}
                <div className="h-12 flex items-center px-5 border-b border-white/[0.07] shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[18px] h-[18px] rounded-[4px] bg-amber-500/[0.12] border border-amber-500/[0.22] flex items-center justify-center">
                      <div className="w-[6px] h-[6px] rounded-full bg-amber-400/80" />
                    </div>
                    <h1 className="text-[13px] font-semibold text-white/70 tracking-tight">
                      React Component Generator
                    </h1>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-[1px] bg-white/[0.06] hover:bg-amber-500/25 transition-colors duration-200 cursor-col-resize" />

            {/* Right Panel - Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-[#111118]">
                {/* Top Bar */}
                <div className="h-12 border-b border-white/[0.07] px-5 flex items-center justify-between shrink-0">
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList className="bg-white/[0.05] border border-white/[0.08] p-[3px] h-8 gap-0.5 rounded-lg">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-[#1e1e2a] data-[state=active]:text-white/90 data-[state=active]:shadow-none text-white/30 px-4 py-1 text-[12px] font-medium tracking-wide transition-all rounded-[5px]">Preview</TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-[#1e1e2a] data-[state=active]:text-white/90 data-[state=active]:shadow-none text-white/30 px-4 py-1 text-[12px] font-medium tracking-wide transition-all rounded-[5px]">Code</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {activeView === "preview" ? (
                    <div className="h-full bg-[#111118]">
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      id="code-layout"
                      direction="horizontal"
                      className="h-full"
                    >
                      {/* File Tree */}
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                      >
                        <div className="h-full bg-[#0e0e14] border-r border-white/[0.07]">
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle className="w-[1px] bg-white/[0.06] hover:bg-amber-500/25 transition-colors duration-200" />

                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-[#111118]">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
