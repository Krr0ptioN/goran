"use client"

import React from "react"
import { motion } from "framer-motion"
import { SidebarProvider, SidebarInset, SidebarTrigger, Avatar, AvatarFallback } from "@goran/ui-components"
import AppSidebar from "./app-sidebar"

export default function MusicApp() {
  return (
    <div className="min-h-svh bg-background text-foreground relative overflow-hidden">
        <SidebarProvider defaultOpen>
            <AppSidebar />
            <SidebarInset className="relative">
                <motion.header
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.7 }}
                    className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 bg-background/90 border-b border-border"
                >
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                    <div className="flex-1 max-w-2xl">
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                    <Avatar className="size-8 bg-primary text-primary-foreground">
                        <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    </div>
                </motion.header>
            </SidebarInset>
        </SidebarProvider>
    </div>
  )
}
