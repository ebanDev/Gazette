import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL parameter is required'
    })
  }

  try {
    const response = await fetch(url)
    const xmlContent = await response.text()

    // Set appropriate headers
    event.node.res.setHeader('Content-Type', 'application/xml')
    
    return xmlContent
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch RSS feed',
      cause: error
    })
  }
})
