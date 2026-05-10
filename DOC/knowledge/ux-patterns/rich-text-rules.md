# Rich Text Rules

## Purpose
Safe rich text authoring for docs, comments, and long-form content.

## Editor guidance
- Preferred editors: Lexical or TipTap

## Rules
- Store canonical structured format (JSON) plus rendered output
- Sanitize and validate pasted content
- Support slash commands and keyboard shortcuts for common blocks
- Mentions and links must preserve stable ids, not display text only

## Anti-patterns
- Storing raw unsanitized HTML as source of truth
- Non-versioned document schema