# Goran

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

# Docs Required API

### Song metadata scrabing

-   use a third-party api to retrieve metadata from it
    -   required informations
        -   Genre
        -   Producers
        -   Album

### Album Only

-   [ ] Add new album to catalog
-   [ ] Edit the existing album information in catalog
-   [ ] Delete the exsting album from catalog
-   [ ] Add new album to catalog

### Producers Only

-   [ ] Add new producer to catalog
-   [ ] Edit the existing producer information in catalog
-   [ ] Delete the exsting producer from catalog
-   [ ] Add new producer to catalog

### Genres Only

-   [ ] Add new genre to catalog
-   [ ] Edit the existing genre information in catalog
-   [ ] Delete the exsting genre from catalog
-   [ ] Add new genre to catalog

### Playlists Only

-   [ ] Add new playlist to catalog
-   [ ] Edit the existing playlist information in catalog
-   [ ] Delete the exsting playlist from catalog
-   [ ] Add new playlist to catalog

### Songs Only

-   [ ] Add new song to catalog
    -   The status of uploaded file is very important
        -   Statuses
            -   uploaded: the file is uploaded however it is not associated with any entity
            -   registered: the file is associated with an entity
            -   published: the file can be retrieved from the client
            -   optimizied: the file is fully optimized for retrieving and it at its perfect state to be consumed
                -   Audio: different quality and format
                -   Image: different quality, format and size
            -   archieved: the file is fully is associated with an entity however its not retrievable until the client explicity announce it to be unarchived
            -   trash: the file is fully is dissociated from any entity and it is scheduled to be removed from the bucket
            -   deleted: the file is permanently removed
    -   Add new genre
    -   find the producer
-   [ ] Edit the existing song information in catalog
    -   Add new genre
    -   find the producer
-   [ ] Delete the exsting song from catalog

### Fancy Features

-   [ ] Bulk upload for songs
-   [ ] Duplicate detection
