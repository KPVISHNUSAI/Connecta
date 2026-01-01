from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .documents import UserDocument
from .serializers import UserSerializer

class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'results': []})
        
        # Search in username, first_name, last_name
        search = UserDocument.search().query(
            'multi_match',
            query=query,
            fields=['username^3', 'first_name', 'last_name'],
            fuzziness='AUTO'
        )
        
        # Execute search
        response = search[:20].execute()
        
        # Get actual User objects
        user_ids = [hit.meta.id for hit in response]
        from django.contrib.auth import get_user_model
        User = get_user_model()
        users = User.objects.filter(id__in=user_ids)
        
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response({
            'count': response.hits.total.value,
            'results': serializer.data
        })