CREATE TABLE "producers" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"fullname" text,
	"nickname" text,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "producers_songs" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"producer_id" text NOT NULL,
	"song_id" text NOT NULL,
	CONSTRAINT "producers_songs_producer_id_song_id_pk" PRIMARY KEY("producer_id","song_id")
);
--> statement-breakpoint
CREATE TABLE "producers_albums" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"producer_id" text NOT NULL,
	"album_id" text NOT NULL,
	CONSTRAINT "producers_albums_producer_id_album_id_pk" PRIMARY KEY("producer_id","album_id")
);
--> statement-breakpoint
CREATE TABLE "producers_genres" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"producer_id" text NOT NULL,
	"genre_id" text NOT NULL,
	CONSTRAINT "producers_genres_producer_id_genre_id_pk" PRIMARY KEY("producer_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"description" text,
	"cover_image_key" text,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "playlists_songs" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"playlist_id" text NOT NULL,
	"song_id" text NOT NULL,
	CONSTRAINT "playlists_songs_playlist_id_song_id_pk" PRIMARY KEY("playlist_id","song_id")
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"audio_file_key" text,
	"cover_image_key" text,
	"title" text NOT NULL,
	"released_date" date,
	"duration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs_genres" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"song_id" text NOT NULL,
	"genre_id" text NOT NULL,
	CONSTRAINT "songs_genres_song_id_genre_id_pk" PRIMARY KEY("song_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"cover_image_key" text,
	"released_date" date
);
--> statement-breakpoint
CREATE TABLE "albums_songs" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"song_id" text NOT NULL,
	"album_id" text NOT NULL,
	CONSTRAINT "albums_songs_song_id_album_id_pk" PRIMARY KEY("song_id","album_id")
);
--> statement-breakpoint
CREATE TABLE "albums_producers" (
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"producer_id" text NOT NULL,
	"album_id" text NOT NULL,
	CONSTRAINT "albums_producers_producer_id_album_id_pk" PRIMARY KEY("producer_id","album_id")
);
--> statement-breakpoint
ALTER TABLE "producers_songs" ADD CONSTRAINT "producers_songs_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers_songs" ADD CONSTRAINT "producers_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers_albums" ADD CONSTRAINT "producers_albums_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers_albums" ADD CONSTRAINT "producers_albums_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers_genres" ADD CONSTRAINT "producers_genres_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers_genres" ADD CONSTRAINT "producers_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genres" ADD CONSTRAINT "genres_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlists_songs" ADD CONSTRAINT "playlists_songs_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlists_songs" ADD CONSTRAINT "playlists_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs_genres" ADD CONSTRAINT "songs_genres_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs_genres" ADD CONSTRAINT "songs_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums_songs" ADD CONSTRAINT "albums_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums_songs" ADD CONSTRAINT "albums_songs_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums_producers" ADD CONSTRAINT "albums_producers_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums_producers" ADD CONSTRAINT "albums_producers_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;