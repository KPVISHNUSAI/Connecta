from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Post

@registry.register_document
class PostDocument(Document):
    user = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
        'profile_picture': fields.TextField(),
    })
    
    media = fields.NestedField(properties={
        'media_type': fields.TextField(),
        'file': fields.TextField(),
    })
    
    class Index:
        name = 'posts'
        settings = {
            'number_of_shards': 3,
            'number_of_replicas': 1,
            'refresh_interval': '5s',
        }

    class Django:
        model = Post
        fields = [
            'id',
            'caption',
            'location',
            'likes_count',
            'comments_count',
            'created_at',
        ]
        related_models = ['user']

    def get_queryset(self):
        return super().get_queryset().filter(is_archived=False)

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, self.django.model):
            return related_instance