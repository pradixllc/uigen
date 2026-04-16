"use client";

import { type UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { User, Bot, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolCallDisplay } from "./ToolCallDisplay";

interface MessageListProps {
  messages: UIMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/[0.1] border border-amber-500/[0.18] mb-5">
          <Bot className="h-5 w-5 text-amber-400/80" />
        </div>
        <p className="text-white/75 font-semibold text-[15px] mb-2 leading-snug">
          Start a conversation to generate<br />React components
        </p>
        <p className="text-white/30 text-[13px] max-w-[220px] leading-relaxed">
          I can help you create buttons, forms, cards, and more
        </p>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6">
      <div className="space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#1c1c26] border border-white/[0.08] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white/45" />
                </div>
              </div>
            )}

            <div className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              message.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-xl px-4 py-3",
                message.role === "user"
                  ? "bg-[#d49a2a] text-[#0e0e14]"
                  : "bg-[#1c1c26] text-white/80 border border-white/[0.07]"
              )}>
                <div className="text-sm">
                  <>
                    {message.parts.map((part, partIndex) => {
                      switch (part.type) {
                        case "text":
                          return message.role === "user" ? (
                            <span key={partIndex} className="whitespace-pre-wrap font-medium">{part.text}</span>
                          ) : (
                            <MarkdownRenderer
                              key={partIndex}
                              content={part.text}
                              className="prose-sm"
                            />
                          );
                        case "reasoning":
                          return (
                            <div key={partIndex} className="mt-3 p-3 bg-white/[0.04] rounded-md border border-white/[0.07]">
                              <span className="text-xs font-medium text-white/40 block mb-1 uppercase tracking-wider">Reasoning</span>
                              <span className="text-sm text-white/55">{part.text}</span>
                            </div>
                          );
                        case "dynamic-tool":
                          return (
                            <ToolCallDisplay
                              key={partIndex}
                              toolName={part.toolName}
                              args={part.input as Record<string, unknown>}
                              state={part.state === "output-available" ? "result" : part.state === "input-available" ? "call" : "partial-call"}
                            />
                          );
                        case "source-url":
                          return (
                            <div key={partIndex} className="mt-2 text-xs text-white/30">
                              Source: {part.url}
                            </div>
                          );
                        case "step-start":
                          return partIndex > 0 ? <hr key={partIndex} className="my-3 border-white/[0.06]" /> : null;
                        default:
                          return null;
                      }
                    })}
                    {isLoading &&
                      message.role === "assistant" &&
                      messages.indexOf(message) === messages.length - 1 &&
                      !message.parts.some((p) => p.type === "text" && (p as { type: "text"; text: string }).text.length > 0) && (
                        <div className="flex items-center gap-2 mt-3 text-white/35">
                          <Loader2 className="h-3 w-3 animate-spin text-amber-400/60" />
                          <span className="text-sm">Generating...</span>
                        </div>
                      )}
                  </>
                </div>
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#d49a2a] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#0e0e14]" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
