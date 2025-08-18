"use client"

import type React from "react"

import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarRail,
  Input,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
 } from "@goran/ui-components"
import {
  Home,
  Search,
  LibraryBig,
  ListMusic,
  Heart,
  Plus,
  Waves,
  Music,
  Disc3,
  Mic,
  FolderIcon as FolderMusic,
  Clock,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

// Helper component for the animated wave effect
function AnimatedSidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SidebarMenuButton
      asChild
      className="relative overflow-hidden hover:bg-muted transition-colors"
    >
      <Link href={href} className="flex items-center gap-2 min-w-0 relative z-10">
        {children}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, backgroundPositionX: "100%", boxShadow: "0 0 0px hsl(var(--primary) / 0)" }}
          whileHover={{
            opacity: 1,
            backgroundPositionX: "-100%",
            boxShadow: "0 0 20px hsl(var(--primary) / 0.8)",
            transition: {
              backgroundPositionX: {
                duration: 1.5,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              },
              opacity: { duration: 0.4 },
              boxShadow: { duration: 0.4 },
            },
          }}
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.9) 15%, hsl(var(--primary) / 0.9) 85%, hsl(var(--primary) / 0) 100%)",
            backgroundSize: "300% 100%",
            pointerEvents: "none",
          }}
        />
      </Link>
    </SidebarMenuButton>
  )
}

export default function AppSidebar() {
  const [createPlaylistDialogOpen, setCreatePlaylistDialogOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("New Playlist")

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-sidebar text-sidebar-foreground">
      <SidebarHeader>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="flex items-center gap-2 px-2"
        >
          <Waves className="size-6 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)]" />
          <div className="font-semibold tracking-tight">Goran</div>
        </motion.div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/">
                  <Home />
                  <span>Home</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/search">
                  <Search />
                  <span>Search</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/your-library">
                  <LibraryBig />
                  <span>Your Library</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/recents">
                  <Clock />
                  <span>Recently Played</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/liked-songs">
                  <Heart />
                  <span>Liked Songs</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/albums">
                  <Disc3 />
                  <span>Albums</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/artists">
                  <Mic />
                  <span>Artists</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/songs">
                  <Music />
                  <span>Songs</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AnimatedSidebarLink href="/local-files">
                  <FolderMusic />
                  <span>Local Files</span>
                </AnimatedSidebarLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Now Playing Queue */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Queue
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              {/* <NowPlayingQueue /> */}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Playlists
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Dialog open={createPlaylistDialogOpen} onOpenChange={setCreatePlaylistDialogOpen}>
                  <DialogTrigger asChild>
                    <SidebarMenuButton
                      className="relative overflow-hidden hover:bg-muted transition-colors"
                    >
                      <Plus />
                      <span>Create Playlist</span>
                      <motion.div
                        className="absolute inset-0 z-0"
                        initial={{
                          opacity: 0,
                          backgroundPositionX: "100%",
                          boxShadow: "0 0 0px hsl(var(--primary) / 0)",
                        }}
                        whileHover={{
                          opacity: 1,
                          backgroundPositionX: "-100%",
                          boxShadow: "0 0 20px hsl(var(--primary) / 0.8)",
                          transition: {
                            backgroundPositionX: {
                              duration: 1.5,
                              ease: "linear",
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            },
                            opacity: { duration: 0.4 },
                            boxShadow: { duration: 0.4 },
                          },
                        }}
                        style={{
                          background:
                            "linear-gradient(90deg, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.9) 15%, hsl(var(--primary) / 0.9) 85%, hsl(var(--primary) / 0) 100%)",
                          backgroundSize: "300% 100%",
                          pointerEvents: "none",
                        }}
                      />
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Create playlist</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Playlist name"
                      className="bg-input border-border"
                    />
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          // const id = createPlaylist(newPlaylistName.trim() || "New Playlist")
                          // if (id) setCreatePlaylistDialogOpen(false)
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </SidebarMenuItem>

              {/* {playlists.map((p, i) => ( */}
              {/*   <motion.li */}
              {/*     key={p.id} */}
              {/*     initial={{ opacity: 0, y: 8 }} */}
              {/*     animate={{ opacity: 1, y: 0 }} */}
              {/*     transition={{ delay: i * 0.03 }} */}
              {/*     className="list-none" */}
              {/*   > */}
              {/*     <AnimatedSidebarLink href={`/playlists/${p.id}`}> */}
              {/*       <ListMusic /> */}
              {/*       <span className="truncate">{p.name}</span> */}
              {/*     </AnimatedSidebarLink> */}
              {/*   </motion.li> */}
              {/* ))} */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 text-xs text-muted-foreground">Made by <Link href="https://mardin.cc" className="text-primary font-bold">Mardin.cc</Link></div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
