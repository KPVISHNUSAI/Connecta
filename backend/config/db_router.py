import random

class PrimaryReplicaRouter:
    """
    A router to control database operations on models
    """
    
    def db_for_read(self, model, **hints):
        """
        Reads go to a randomly-chosen replica
        """
        return random.choice(['default', 'replica'])
    
    def db_for_write(self, model, **hints):
        """
        Writes always go to primary
        """
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed if both objects are
        in the primary/replica pool
        """
        db_set = {'default', 'replica'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All migrations should only run on the primary database
        """
        return db == 'default'