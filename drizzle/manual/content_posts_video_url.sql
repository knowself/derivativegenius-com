-- Manual migration: add video_url to content_posts for video podcast episodes.
-- Run once in the Neon SQL editor (or psql) against the production database.
-- Safe to re-run: guarded by IF NOT EXISTS.

ALTER TABLE content_posts
  ADD COLUMN IF NOT EXISTS video_url text;

ALTER TABLE content_posts
  ADD COLUMN IF NOT EXISTS transcript_markdown text;
