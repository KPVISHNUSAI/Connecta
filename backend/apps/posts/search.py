from elasticsearch_dsl import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .documents import PostDocument
from .serializers import PostSerializer

class PostSearchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'results': []})
        
        # Search in caption and location
        search = PostDocument.search().query(
            'multi_match',
            query=query,
            fields=['caption^2', 'location', 'user.username'],
            fuzziness='AUTO'
        )
        
        # Execute search
        response = search.execute()
        
        # Get actual Post objects
        post_ids = [hit.meta.id for hit in response]
        from .models import Post
        posts = Post.objects.filter(id__in=post_ids)
        
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response({
            'count': response.hits.total.value,
            'results': serializer.data
        })