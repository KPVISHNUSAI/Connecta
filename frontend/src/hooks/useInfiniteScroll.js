import { useEffect, useRef } from 'react'

const useInfiniteScroll = (fetchMore, hasMore, isLoading) => {
  const sentinelRef = useRef(null)

  useEffect(() => {
    // Don't set up observer if we're loading or there's no more data
    if (isLoading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Only fetch if the sentinel is visible
        if (entries[0].isIntersecting) {
          console.log('🔄 Fetching more posts...')
          fetchMore()
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start fetching 200px before the element
        threshold: 0.1,
      }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    // Cleanup
    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [fetchMore, hasMore, isLoading])

  return sentinelRef
}

export default useInfiniteScroll