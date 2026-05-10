# Skill: Retrieval-Augmented Generation Pattern

**Used by:** turbopuffer, pinecone, pgvector

## Pattern

For RAG features, user queries MUST be embedded, semantically searched against the vector store, and the top-k results injected as context into the LLM prompt.

### Flow
\\\
User query
  → embed with text-embedding-3-small
  → query vector DB for top-5 similar chunks
  → inject chunks as system context
  → LLM completion with grounded context
  → cite source documents in response
\\\

### Implementation sketch
\\\	s
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: userQuery
})
const results = await vectorDB.query({ vector: embedding.data[0].embedding, topK: 5 })
const context = results.map(r => r.metadata.text).join('\n\n')
// Pass context to streamText as system message
\\\

### Rules
- Embedding model MUST match the one used during indexing.
- Context chunks MUST be deduped and trimmed to fit within the model's context window.
- MUST cite source documents in responses when used for factual retrieval.
- Retrieval latency MUST be measured and added to the AI cost tracking log.
