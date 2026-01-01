from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from django.contrib.auth import get_user_model

User = get_user_model()

@registry.register_document
class UserDocument(Document):
    class Index:
        name = 'users'
        settings = {
            'number_of_shards': 3,
            'number_of_replicas': 1,
        }

    class Django:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'bio',
            'profile_picture',
            'is_private',
        ]