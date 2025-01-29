import { HasFile } from './has-file';
import { StoredFileMetadata } from './stored-file-metadata';

export interface StoredFile extends HasFile, StoredFileMetadata {}
